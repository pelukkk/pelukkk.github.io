// wheel_api_comm.js
// JavaScript implementation of wheel_api.cpp for WebHID communication



import * as API from './wheel_api_lib.js';


const INTERFACE_0_USAGE_PAGE = 0xFF72;
const INTERFACE_0_USAGE = 0xA1;



export class WheelApi {
    constructor() {
        this.device = null;
        this._disconnectTimeout = null;
        this.isConnected = false; // Track connection state
    }


    async connect() {
        const filters = [
        {
            vendorId: API.USB_VID,
            productId: API.WHEEL_PID_FS,
            usagePage: INTERFACE_0_USAGE_PAGE,
            usage: INTERFACE_0_USAGE
        }
        ];        
        const devices = await navigator.hid.requestDevice({ filters });
        if (devices.length > 0) {
            this.device = devices[0];
            await this.device.open();
            //this.setupInputReportListener(); // Setup listener after opening the device
            return true;
        }
        return false;
    }
    

    //Attempts to reconnect to a previously paired device (no user prompt).
    //Returns true if successful, false otherwise.
async tryAutoReconnect() {
        const devices = await navigator.hid.getDevices();
        // Find a device matching our filters
        const device = devices.find(d =>
            d.vendorId === API.USB_VID &&
            d.productId === API.WHEEL_PID_FS &&
            d.collections.some(
                c => c.usagePage === INTERFACE_0_USAGE_PAGE && c.usage === INTERFACE_0_USAGE
            )
        );
        if (device) {
            this.device = device;
            if (!this.device.opened) {
                await this.device.open();
            }
            //this.setupInputReportListener(); // Setup listener after reconnecting to the device
            return true;
        }
        return false;
    }

    
    //readState, Device will be constantly sending interrupt report with the state on vendor interface when device is active
    setupInputReportListener(onStateReceived) {
        if (!this.device) return;
        this.device.addEventListener('inputreport', (event) => {
            // Reset the disconnect timer
            if (this._disconnectTimeout) clearTimeout(this._disconnectTimeout);
            this.isConnected = true;
            // Parse state as usual
            const state = this._parseStruct(event.data, API.DeviceStateTypeDef, 0);     // Does NOT include ReportId, so offset is 0
            if (typeof onStateReceived === "function") onStateReceived(state);

            // Start a new 100ms timeout for connection status
            this._disconnectTimeout = setTimeout(() => {
                this.isConnected = false;
                // Call your disconnect handler here if needed
                // e.g. onDisconnected();
            }, 100);
        });
    }


    // Helper: Get the type string for a given field name from the known struct definitions
    getFieldDataType(fieldName) {
        const structDefs = [
            API.EffectSettingsTypeDef,
            API.HardwareSettingsTypeDef,
            API.GpioExtensionSettingsTypeDef,
            API.AdcExtensionSettingsTypeDef,
            API.DirectControlTypeDef,
        ];
        for (const structDef of structDefs) {
            for (const field of structDef) {
                // Handle array fields (strip [index] for matching)
                let baseName = field.name.split('[')[0];
                if (baseName === fieldName) {
                    return field.type;
                }
            }
        }
        return null; // Not found
    }
   

    async readEffectsSettings() {
        return this._readFeatureReport(API.ReportTypeEnum.REPORT_EFFECT_SETTINGS_FEATURE, API.EffectSettingsTypeDef);
    }

    async readHardwareSettings() {
        return this._readFeatureReport(API.ReportTypeEnum.REPORT_HARDWARE_SETTINGS_FEATURE, API.HardwareSettingsTypeDef);
    }

    async readGpioExtensionSettings() {
        return this._readFeatureReport(API.ReportTypeEnum.REPORT_GPIO_SETTINGS_FEATURE, API.GpioExtensionSettingsTypeDef);
    }

    async readAdcExtensionSettings() {
        return this._readFeatureReport(API.ReportTypeEnum.REPORT_ADC_SETTINGS_FEATURE, API.AdcExtensionSettingsTypeDef);
    }

    async readFirmwareLicense() {
        return this._readFeatureReport(API.ReportTypeEnum.REPORT_FIRMWARE_LICENSE_FEATURE, API.FirmwareLicenseTypeDef);
    }

    async _readFeatureReport(reportId, structDef) {
        if (!this.device) throw new Error('Device not connected');
        const report = await this.device.receiveFeatureReport(reportId);
        // Start parsing at offset 1 to skip ReportId
        return this._parseStruct(report, structDef, 1);             //Does YES include ReportId, so offset is 1 (discard first byte)
    }


    async saveAndReboot() {
        return this._sendSimpleCommand(API.ReportTypeEnum.REPORT_GENERIC_INPUT_OUTPUT, API.ReportDataEnum.DATA_COMMAND_SAVE_SETTINGS);
    }

    async rebootController() {
        return this._sendSimpleCommand(API.ReportTypeEnum.REPORT_GENERIC_INPUT_OUTPUT, API.ReportDataEnum.DATA_COMMAND_REBOOT);
    }

    async switchtoDFU() {
        return this._sendSimpleCommand(API.ReportTypeEnum.REPORT_GENERIC_INPUT_OUTPUT, API.ReportDataEnum.DATA_COMMAND_DFU_MODE);
    }

    async resetCenter() {
        return this._sendSimpleCommand(API.ReportTypeEnum.REPORT_GENERIC_INPUT_OUTPUT, API.ReportDataEnum.DATA_COMMAND_RESET_CENTER);
    }    

    async _sendSimpleCommand(reportId, command) {
        if (!this.device) throw new Error('Device not connected');
        const buffer = new Uint8Array(65);
        buffer[0] = reportId;  // Not actually used here as it's set in .sendReport
        buffer[1] = command;
        await this.device.sendReport(reportId, buffer.slice(1));
        return 1;
    }


    async sendSettingReport(field, index, value, type) {
        if (!this.device) throw new Error('Device not connected');
        const reportId = API.ReportTypeEnum.REPORT_GENERIC_INPUT_OUTPUT;
        const buffer = new Uint8Array(65);
        buffer[0] = reportId;     // actually not used here as it's set with .sendReport
        buffer[1] = API.ReportDataEnum.DATA_SETTINGS_FIELD_DATA;
        buffer[2] = field;
        buffer[3] = index;
        const view = new DataView(buffer.buffer);
        console.log(`sendSettingReport: field=${field}, value=${value}, index=${index} type=${type}`);

        switch (type) {
            case 'int8_t':
                view.setInt8(4, value);
                break;
            case 'uint8_t':
                view.setUint8(4, value);
                break;
            case 'int16_t':
                view.setInt16(4, value, true); // little-endian
                break;
            case 'uint16_t':
                view.setUint16(4, value, true); // little-endian
                break;
            case 'float':
                view.setFloat32(4, value, true); // little-endian
                break;
            default:
                throw new Error('Unsupported type for settings report');
        }

        await this.device.sendReport(reportId, buffer.slice(1));
        return 1;
    }


    async sendFirmwareActivation(licenseStr) {
        if (!this.device) throw new Error('Device not connected');
        const reportId = API.ReportTypeEnum.REPORT_GENERIC_INPUT_OUTPUT;
        const buffer = new Uint8Array(65);
        buffer[0] = reportId;     // actually not used here as it's set with .sendReport
        buffer[1] = API.ReportDataEnum.DATA_FIRMWARE_ACTIVATION_DATA;

        // Initialize 12 bytes (3 chunks x 4 bytes) with zeros
        let licenseBytes = new Uint8Array(12).fill(0);

        // Validate and parse license string
        let valid = false;
        let chunks = [];
        if (typeof licenseStr === 'string' && licenseStr.trim() !== '') {
            chunks = licenseStr.split('-');
            if (chunks.length === 3) {
                valid = chunks.every(chunk => /^[0-9A-Fa-f]{1,8}$/.test(chunk));    // Check each chunk is valid hex chars and 1-8 digits
            }
        }

        if (valid) {
            const view = new DataView(licenseBytes.buffer);
            for (let i = 0; i < 3; i++) {
                let hex = chunks[i].padStart(8, '0').toUpperCase();     // Pad each chunk to 8 chars, uppercase for consistency
                let value = parseInt(hex, 16);                          // Parse as 32-bit unsigned integer
                view.setUint32(i * 4, value, true);                     // true = little-endian
            }
        }
        else {    // If not valid, licenseBytes stays all zeros
            console.log('Invalid license format. Must be 3 chunks of 1-8 hex digits separated by dashes.');
        }
    
        // Copy license bytes into the buffer starting at buffer[2]
        buffer.set(licenseBytes, 2);

        await this.device.sendReport(reportId, buffer.slice(1));
        return 1;
    }


    _parseStruct(data, structDef, offset = 0) {
        const view = new DataView(data.buffer);
        let result = {};
        let cursor = offset;

        for (const field of structDef) {
            const type = field.type;
            const name = field.name;

            // Handle padding fields: skip them
            if (name.startsWith('_padding')) {
                // Extract array size from name, e.g. "_padding[50]" <- only needed in case there's padding in between elements
                const match = name.match(/\[(\d+)\]/);
                let count = match ? parseInt(match[1]) : 1;
                let size = 1;
                if (type === 'uint8_t' || type === 'int8_t') size = 1;
                else if (type === 'uint16_t' || type === 'int16_t') size = 2;
                else if (type === 'uint32_t' || type === 'int32_t' || type === 'float') size = 4;
                cursor += count * size;
                continue;
            }

            // Handle arrays
            if (name.includes('[')) {
                const [baseName, arrayPart] = name.split('[');
                const arraySize = parseInt(arrayPart.replace(']', ''));
                result[baseName] = [];
                for (let i = 0; i < arraySize; i++) {
                    if (type === 'uint8_t') {
                        result[baseName].push(view.getUint8(cursor++));
                    } else if (type === 'int8_t') {
                        result[baseName].push(view.getInt8(cursor++));
                    } else if (type === 'uint16_t') {
                        result[baseName].push(view.getUint16(cursor, true));
                        cursor += 2;
                    } else if (type === 'int16_t') {
                        result[baseName].push(view.getInt16(cursor, true));
                        cursor += 2;
                    } else if (type === 'uint32_t') {
                        result[baseName].push(view.getUint32(cursor, true));
                        cursor += 4;
                    } else if (type === 'int32_t') {
                        result[baseName].push(view.getInt32(cursor, true));
                        cursor += 4;
                    } else if (type === 'float') {
                        result[baseName].push(view.getFloat32(cursor, true));
                        cursor += 4;
                    }
                }
            } else {
                // Handle single values
                if (type === 'uint8_t') {
                    result[name] = view.getUint8(cursor++);
                } else if (type === 'int8_t') {
                    result[name] = view.getInt8(cursor++);
                } else if (type === 'uint16_t') {
                    result[name] = view.getUint16(cursor, true);
                    cursor += 2;
                } else if (type === 'int16_t') {
                    result[name] = view.getInt16(cursor, true);
                    cursor += 2;
                } else if (type === 'uint32_t') {
                    result[name] = view.getUint32(cursor, true);
                    cursor += 4;
                } else if (type === 'int32_t') {
                    result[name] = view.getInt32(cursor, true);
                    cursor += 4;
                } else if (type === 'float') {
                    result[name] = view.getFloat32(cursor, true);
                    cursor += 4;
                }
            }
        }
        return result;
    }
}