// Auto-generated from wheel_api.h

export const USB_VID = 1115;
export const WHEEL_PID_FS = 22999;

export const ExtensionModeEnum = {
    EXTENSION_MODE_NONE: 0,
    EXTENSION_MODE_CUSTOM: 1,
};

export const SettingsFieldEnum = {
    SETTINGS_FIELD_DIRECT_X_CONSTANT_DIRECTION: 0,
    SETTINGS_FIELD_DIRECT_X_SPRING_STRENGTH: 1,
    SETTINGS_FIELD_DIRECT_X_CONSTANT_STRENGTH: 2,
    SETTINGS_FIELD_DIRECT_X_PERIODIC_STRENGTH: 3,
    SETTINGS_FIELD_TOTAL_EFFECT_STRENGTH: 4,
    SETTINGS_FIELD_MOTION_RANGE: 5,
    SETTINGS_FIELD_SOFT_STOP_STRENGTH: 6,
    SETTINGS_FIELD_SOFT_STOP_RANGE: 7,
    SETTINGS_FIELD_STATIC_DAMPENING_STRENGTH: 8,
    SETTINGS_FIELD_SOFT_STOP_DAMPENING_STRENGTH: 9,
    SETTINGS_FIELD_DYNAMIC_DAMPENING_STRENGTH: 10,
    SETTINGS_FIELD_FORCE_ENABLED: 11,
    SETTINGS_FIELD_DEBUG_TORQUE: 12,
    SETTINGS_FIELD_AMPLIFIER_GAIN: 13,
    SETTINGS_FIELD_CALIBRATION_MAGNITUDE: 15,
    SETTINGS_FIELD_CALIBRATION_SPEED: 16,
    SETTINGS_FIELD_POWER_LIMIT: 17,
    SETTINGS_FIELD_BRAKING_LIMIT: 18,
    SETTINGS_FIELD_POSITION_SMOOTHING: 19,
    SETTINGS_FIELD_SPEED_BUFFER_SIZE: 20,
    SETTINGS_FIELD_ENCODER_DIRECTION: 21,
    SETTINGS_FIELD_FORCE_DIRECTION: 22,
    SETTINGS_FIELD_POLE_PAIRS: 23,
    SETTINGS_FIELD_ENCODER_CPR: 24,
    SETTINGS_FIELD_P_GAIN: 25,
    SETTINGS_FIELD_I_GAIN: 26,
    SETTINGS_FIELD_EXTENSION_MODE: 27,
    SETTINGS_FIELD_PIN_MODE: 28,
    SETTINGS_FIELD_BUTTON_MODE: 29,
    SETTINGS_FIELD_SPI_MODE: 30,
    SETTINGS_FIELD_SPI_LATCH_MODE: 31,
    SETTINGS_FIELD_SPI_LATCH_DELAY: 32,
    SETTINGS_FIELD_SPI_CLK_PULSE_LENGTH: 33,
    SETTINGS_FIELD_ADC_MIN_DEAD_ZONE: 34,
    SETTINGS_FIELD_ADC_MAX_DEAD_ZONE: 35,
    SETTINGS_FIELD_ADC_TO_BUTTON_LOW: 36,
    SETTINGS_FIELD_ADC_TO_BUTTON_HIGH: 37,
    SETTINGS_FIELD_ADC_SMOOTHING: 38,
    SETTINGS_FIELD_ADC_INVERT: 39,
    SETTINGS_FIELD_RESET_CENTER_ON_Z0: 41,
    SETTINGS_FIELD_INTEGRATED_SPRING_STRENGTH: 43,
};

export const PinModeEnum = {
    PIN_MODE_NONE: 0,
    PIN_MODE_GPIO: 1,
    PIN_MODE_ANALOG: 2,
    PIN_MODE_SPI_CS: 3,
    PIN_MODE_SPI_SCK: 4,
    PIN_MODE_SPI_MISO: 5,
    PIN_MODE_ENABLE_EFFECTS: 6,
    PIN_MODE_CENTER_RESET: 7,
    PIN_MODE_BRAKING_PWM: 8,
    PIN_MODE_EFFECT_LED: 9,
    PIN_MODE_REBOOT: 10,
};

export const ButtonModeEnum = {
    BUTTON_MODE_NONE: 0,
    BUTTON_MODE_NORMAL: 1,
    BUTTON_MODE_INVERTED: 2,
    BUTTON_MODE_PULSE: 3, // Not implemented
    BUTTON_MODE_PULSE_INVERTED: 4, // Not implemented
};

export const AmplifierGainEnum = {
    AMPLIFIER_GAIN_80: 0,
    AMPLIFIER_GAIN_40: 1,
    AMPLIFIER_GAIN_20: 2,
    AMPLIFIER_GAIN_10: 3,
};

export const SpiModeEnum = {
    SPI_MODE_0: 0, // The first bit is outputted immediately when CS activates. READ-CLK_UP-DELAY-CLK_DOWN-DELAY
    SPI_MODE_1: 1, // The first bit is outputted on first clock edge after CS activates CLK_UP-DELAY-READ-CLK_DOWN-DELAY
    SPI_MODE_2: 2, // The first bit is outputted immediately when CS activates. READ-CLK_DOWN-DELAY-CLK_UP-DELAY
    SPI_MODE_3: 3, // The first bit is outputted on first clock edge after CS activates CLK_DOWN-DELAY-READ-CLK_UP-DELAY
};

export const SpiLatchModeEnum = {
    LATCH_MODE_UP: 0, // nCS goes UP for triggering SPI latch
    LATCH_MODE_DOWN: 1, // nCS goes DOWN for triggering SPI latch
};

export const ReportDataEnum = {
    DATA_COMMAND_REBOOT: 0x01,
    DATA_COMMAND_SAVE_SETTINGS: 0x02,
    DATA_COMMAND_DFU_MODE: 0x03,
    DATA_OVERRIDE_DATA: 0x10,
    DATA_FIRMWARE_ACTIVATION_DATA: 0x13,
    DATA_SETTINGS_FIELD_DATA: 0x14,
    DATA_COMMAND_RESET_CENTER: 0x04,
};

export const ReportTypeEnum = {
    REPORT_JOYSTICK_INPUT: 0x01,
    REPORT_CREATE_NEW_EFFECT: 0x11,
    REPORT_PID_BLOCK_LOAD: 0x12,
    REPORT_PID_POOL: 0x13,
    REPORT_SET_EFFECT: 0x11,
    REPORT_SET_ENVELOPE: 0x12,
    REPORT_SET_CONDITION: 0x13,
    REPORT_SET_PERIODIC: 0x14,
    REPORT_SET_CONSTANT_FORCE: 0x15,
    REPORT_SET_RAMP_FORCE: 0x16,
    REPORT_EFFECT_OPERATION: 0x1A,
    REPORT_PID_STATE: 0x12,
    REPORT_PID_BLOCK_FREE: 0x1B,
    REPORT_PID_DEVICE_CONTROL: 0x1C,
    REPORT_DEVICE_GAIN: 0x1D,
    REPORT_HARDWARE_SETTINGS_FEATURE: 0x21,
    REPORT_EFFECT_SETTINGS_FEATURE: 0x22,
    REPORT_FIRMWARE_LICENSE_FEATURE: 0x25,
    REPORT_GPIO_SETTINGS_FEATURE: 0xA1,
    REPORT_ADC_SETTINGS_FEATURE: 0xA2,
    REPORT_GENERIC_INPUT_OUTPUT: 0xA3,
};

export const FirmwareVersionTypeDef = [
    { type: "uint8_t", name: "ReleaseType" }, // See FirmwareReleaseTypeEnum for possible types
    { type: "uint8_t", name: "ReleaseMajor" }, // Change to the year of the release
    { type: "uint8_t", name: "ReleaseMinor" }, // Introduce new version of firmware when new version of companion app is needed
    { type: "uint8_t", name: "ReleasePatch" }, // Increment on each patch in scope of the same version
]

export const FirmwareLicenseTypeDef = [
    { type: "uint8_t", name: "FirmwareVersion.ReleaseType" }, // See FirmwareReleaseTypeEnum for possible types
    { type: "uint8_t", name: "FirmwareVersion.ReleaseMajor" }, // Change to the year of the release
    { type: "uint8_t", name: "FirmwareVersion.ReleaseMinor" }, // Introduce new version of firmware when new version of companion app is needed
    { type: "uint8_t", name: "FirmwareVersion.ReleasePatch" }, // Increment on each patch in scope of the same version
    { type: "uint32_t", name: "SerialKey[3]" },
    { type: "uint32_t", name: "DeviceId[3]" },
    { type: "uint8_t", name: "IsRegistered" }, // Value is 0 or 1 as representation of boolean flag
    { type: "uint8_t", name: "_padding[35]" }, // TODO:IMPORTANT! Keep size 64b. Report size must be same size as in descriptor otherwise Windows will drop the packet as corrupted
]

export const EffectSettingsTypeDef = [
    { type: "uint16_t", name: "MotionRange" }, // Degrees
    { type: "uint16_t", name: "StaticDampeningStrength" }, // 0 to 100 in %.
    { type: "uint16_t", name: "SoftStopDampeningStrength" }, // 0 to 100 in %.
    { type: "uint8_t", name: "TotalEffectStrength" }, // 0 to 100 in %.
    { type: "uint8_t", name: "IntegratedSpringStrength" }, // 0 to 100 in %.
    { type: "uint8_t", name: "SoftStopRange" }, // Degrees (will be added on top of MotionRange)
    { type: "uint8_t", name: "SoftStopStrength" }, // 0 to 100 in %.
    { type: "int8_t", name: "DirectXConstantDirection" }, // -1 or +1
    { type: "uint8_t", name: "DirectXSpringStrength" }, // 0 to 100 in %.
    { type: "uint8_t", name: "DirectXConstantStrength" }, // 0 to 100 in %.
    { type: "uint8_t", name: "DirectXPeriodicStrength" }, // 0 to 100 in %.
    { type: "uint16_t", name: "DynamicDampeningStrength" }, // 0 to 100 in %.
    { type: "uint8_t", name: "_padding[48]" }, // TODO:IMPORTANT! Keep size 64b. Report size must be same size as in descriptor otherwise Windows will drop the packet as corrupted
]

export const HardwareSettingsTypeDef = [
    { type: "uint16_t", name: "EncoderCPR" },
    { type: "uint16_t", name: "IntegralGain" },
    { type: "uint8_t", name: "ProportionalGain" },
    { type: "uint8_t", name: "ForceEnabled" }, // Expect this value to be 0 or 1 as representation of boolean flag
    { type: "uint8_t", name: "DebugTorque" }, // Expect this value to be 0 or 1 as representation of boolean flag
    { type: "uint8_t", name: "AmplifierGain" }, // See AmplifierGainEnum
    { type: "uint8_t", name: "CalibrationMagnitude" }, // 0 to 100 in %.
    { type: "uint8_t", name: "CalibrationSpeed" }, // 0 to 100 in %.
    { type: "uint8_t", name: "PowerLimit" }, // 0 to 100 in %.
    { type: "uint8_t", name: "BrakingLimit" }, // 0 to 100 in %.
    { type: "uint8_t", name: "PositionSmoothing" }, // 0 to 100 in %.
    { type: "uint8_t", name: "SpeedBufferSize" },
    { type: "int8_t", name: "EncoderDirection" }, // Expect this value to be -1 or +1
    { type: "int8_t", name: "ForceDirection" }, // Expect this value to be -1 or +1
    { type: "uint8_t", name: "PolePairs" },
    { type: "uint8_t", name: "_padding[47]" }, // TODO:IMPORTANT! Keep size 64b. Report size must be same size as in descriptor otherwise Windows will drop the packet as corrupted
]

export const AdcExtensionSettingsTypeDef = [
    { type: "uint16_t", name: "RAxisMin[3]" },
    { type: "uint16_t", name: "RAxisMax[3]" },
    { type: "uint8_t", name: "RAxisSmoothing[3]" }, // Divide by 100 to get normalized ratio (0..1)
    { type: "uint8_t", name: "RAxisToButtonLow[3]" }, // Point in % where button on axis lower value is triggered. If 0 disabled
    { type: "uint8_t", name: "RAxisToButtonHigh[3]" }, // Point in % where button on axis upper value is triggered. If 100 disabled
    { type: "uint8_t", name: "RAxisInvert[3]" }, // 0 or 1 boolean
    { type: "uint8_t", name: "_padding[40]" }, // TODO:IMPORTANT! Keep size 64b. Report size must be same size as in descriptor otherwise Windows will drop the packet as corrupted
]

export const GpioExtensionSettingsTypeDef = [
    { type: "uint8_t", name: "ExtensionMode" }, // See ExtensionModeEnum
    { type: "uint8_t", name: "PinMode[10]" }, // See PinModeEnum
    { type: "uint8_t", name: "ButtonMode[32]" }, // See ButtonModeEnum
    { type: "uint8_t", name: "SpiMode" }, // See SpiModeEnum
    { type: "uint8_t", name: "SpiLatchMode" }, // See SpiLatchModeEnum
    { type: "uint8_t", name: "SpiLatchDelay" }, // In microseconds
    { type: "uint8_t", name: "SpiClkPulseLength" }, // In microseconds
    { type: "uint8_t", name: "_padding[17]" }, // TODO:IMPORTANT! Keep size 64b. Report size must be same size as in descriptor otherwise Windows will drop the packet as corrupted
]

export const DirectControlTypeDef = [
    { type: "int16_t", name: "SpringForce" },
    { type: "int16_t", name: "ConstantForce" },
    { type: "int16_t", name: "PeriodicForce" },
    { type: "uint8_t", name: "ForceDrop" },
]

export const DeviceStateTypeDef = [
    { type: "uint8_t", name: "FirmwareVersion.ReleaseType" }, // See FirmwareReleaseTypeEnum for possible types
    { type: "uint8_t", name: "FirmwareVersion.ReleaseMajor" }, // Change to the year of the release
    { type: "uint8_t", name: "FirmwareVersion.ReleaseMinor" }, // Introduce new version of firmware when new version of companion app is needed
    { type: "uint8_t", name: "FirmwareVersion.ReleasePatch" }, // Increment on each patch in scope of the same version
    { type: "uint8_t", name: "IsRegistered" },
    { type: "int16_t", name: "Position" },
    { type: "int16_t", name: "Torque" },
    { type: "uint8_t", name: "_padding[55]" },
]

export const HidInOutReportTypeDef = [
    { type: "uint8_t", name: "ReportId" }, // REPORT_GENERIC_INPUT_OUTPUT
    { type: "uint8_t", name: "Buffer[64]" },
]

export const DataReportTypeDef = [
    { type: "uint8_t", name: "ReportData" }, // One of ReportDataEnum
    { type: "uint8_t", name: "Buffer[63]" },
]

export const FieldValueTypeDef = [
    { type: "uint8_t", name: "Index" }, // 0 for non indexed settings or index of value in case of array based settings
    { type: "uint8_t", name: "Buffer[61]" }, // One of settings value type wrappers
]

export const FieldDataTypeDef = [
    { type: "uint8_t", name: "FieldId" }, // One of SettingsFieldEnum
    { type: "uint8_t", name: "Value.Index" }, // 0 for non indexed settings or index of value in case of array based settings
    { type: "uint8_t", name: "Value.Buffer[61]" }, // One of settings value type wrappers
]

export const FloatValueWrapperTypeDef = [
    { type: "float", name: "Value" },
]

export const UInt8ValueWrapperTypeDef = [
    { type: "uint8_t", name: "Value" },
]

export const Int8ValueWrapperTypeDef = [
    { type: "int8_t", name: "Value" },
]

export const UInt16ValueWrapperTypeDef = [
    { type: "uint16_t", name: "Value" },
]

export const Int16ValueWrapperTypeDef = [
    { type: "int16_t", name: "Value" },
]

