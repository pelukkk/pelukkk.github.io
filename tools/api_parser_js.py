#Magic ChatGPT parser

import re

INPUT_FILE = "wheel_api.h"
OUTPUT_FILE = "wheel_api_lib.js"

define_pattern = re.compile(r'#define\s+(\w+)\s+(.+?)(?:\s*//\s*(.*))?$')
enum_start_pattern = re.compile(r'(typedef\s+)?enum\s+(\w+)?\s*\{')
enum_entry_pattern = re.compile(r'^\s*(\w+)(?:\s*=\s*([^,/\}]+))?,?\s*(?://\s*(.*))?$')
enum_end_pattern = re.compile(r'^\s*\}\s*(\w+)?\s*;')
struct_start_pattern = re.compile(r'(typedef\s+)?struct\s+__attribute__\(\(packed\)\)\s*\{')
struct_field_pattern = re.compile(r'\s*([\w_]+(?:\s*\*)?)\s+(\w+)\s*(\[\d+\])?\s*;\s*(?://\s*(.*))?')
struct_end_pattern = re.compile(r'^\s*\}\s*(\w+)\s*;')

def parse_header(file_path):
    defines = []
    enums = {}
    structs = {}
    current_enum = []
    current_struct = []
    current_struct_name = None
    next_value = 0
    in_enum = False
    in_struct = False

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()

            if not line or line.startswith('//') or line.startswith('/*') or line.startswith('*'):
                continue

            match = define_pattern.match(line)
            if match:
                name, value, comment = match.groups()
                defines.append((name, value.strip(), comment.strip() if comment else None))
                continue

            match = enum_start_pattern.match(line)
            if match:
                in_enum = True
                current_enum = []
                next_value = 0
                continue

            if in_enum:
                match = enum_end_pattern.match(line)
                if match:
                    enum_name = match.group(1)
                    if enum_name:
                        enums[enum_name] = current_enum
                    in_enum = False
                    continue

                match = enum_entry_pattern.match(line)
                if match:
                    name, value, comment = match.groups()
                    if value is not None:
                        value_str = value.strip()
                        try:
                            next_value = int(value_str, 0) + 1
                        except:
                            next_value += 1
                    else:
                        value_str = f"0x{next_value:X}"
                        next_value += 1
                    current_enum.append((name, value_str, comment.strip() if comment else None))
                continue

            match = struct_start_pattern.match(line)
            if match:
                in_struct = True
                current_struct = []
                continue

            if in_struct:
                match = struct_end_pattern.match(line)
                if match:
                    current_struct_name = match.group(1)
                    if current_struct_name:
                        structs[current_struct_name] = current_struct
                    in_struct = False
                    continue

                match = struct_field_pattern.match(line)
                if match:
                    type_, name, array, comment = match.groups()
                    field_type = type_.strip()
                    field_name = name.strip()
                    if array:
                        field_name += array.replace(' ', '')
                    current_struct.append((field_type, field_name, comment.strip() if comment else None))
    return defines, enums, structs

def expand_struct(name, structs, prefix=""):
    result = []
    if name not in structs:
        return result
    for field_type, field_name, comment in structs[name]:
        full_name = f"{prefix}{field_name}" if prefix else field_name
        if field_type in structs:
            result.extend(expand_struct(field_type, structs, prefix=f"{full_name}."))
        else:
            result.append({"type": field_type, "name": full_name, "comment": comment})
    return result

def write_js(defines, enums, structs, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated from wheel_api.h\n\n")

        for name, value, comment in defines:
            comment_str = f" // {comment}" if comment else ""
            f.write(f'export const {name} = {value};{comment_str}\n')

        f.write("\n")

        for enum_name, entries in enums.items():
            f.write(f"export const {enum_name} = {{\n")
            for name, value, comment in entries:
                comment_str = f" // {comment}" if comment else ""
                f.write(f'    {name}: {value},{comment_str}\n')
            f.write("};\n\n")

        for struct_name in structs:
            f.write(f"export const {struct_name} = [\n")
            for field in expand_struct(struct_name, structs):
                comment_str = f" // {field['comment']}" if field['comment'] else ""
                f.write(f'    {{ type: "{field['type']}", name: "{field['name']}" }},{comment_str}\n')
            f.write("]\n\n")

if __name__ == "__main__":
    defines, enums, structs = parse_header(INPUT_FILE)
    write_js(defines, enums, structs, OUTPUT_FILE)
    print(f"✅ Generated {OUTPUT_FILE} with {len(defines)} defines, {len(enums)} enums, and {len(structs)} structs.")
