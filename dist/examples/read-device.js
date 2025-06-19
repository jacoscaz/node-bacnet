"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importStar(require("../src"));
const process = __importStar(require("process"));
const PropertyIdentifierToEnumMap = {};
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.OBJECT_TYPE] = src_1.ObjectType;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.SEGMENTATION_SUPPORTED] =
    src_1.Segmentation;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.EVENT_STATE] = src_1.EventState;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.UNITS] = src_1.EngineeringUnits;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.RELIABILITY] = src_1.Reliability;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.NOTIFY_TYPE] = src_1.NotifyType;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.POLARITY] = src_1.Polarity;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.PROTOCOL_SERVICES_SUPPORTED] =
    src_1.ServicesSupported;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED] = src_1.ObjectTypesSupported;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.STATUS_FLAGS] = src_1.StatusFlags;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.LIMIT_ENABLE] = src_1.LimitEnable;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.EVENT_ENABLE] =
    src_1.EventTransitionBits;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.ACKED_TRANSITIONS] =
    src_1.EventTransitionBits;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.SYSTEM_STATUS] = src_1.DeviceStatus;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.SYSTEM_STATUS] = src_1.DeviceStatus;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.ACK_REQUIRED] =
    src_1.EventTransitionBits;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.LOGGING_TYPE] = src_1.LoggingType;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.FILE_ACCESS_METHOD] =
    src_1.FileAccessMethod;
PropertyIdentifierToEnumMap[src_1.PropertyIdentifier.NODE_TYPE] = src_1.NodeType;
const ObjectTypeSpecificPropertyIdentifierToEnumMap = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_INPUT] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_INPUT][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_INPUT][src_1.PropertyIdentifier.MODE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.ANALOG_INPUT] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.ANALOG_INPUT][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.ANALOG_OUTPUT] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.ANALOG_OUTPUT][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_OUTPUT] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_OUTPUT][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_OUTPUT][src_1.PropertyIdentifier.RELINQUISH_DEFAULT] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_VALUE] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_VALUE][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_VALUE][src_1.PropertyIdentifier.RELINQUISH_DEFAULT] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_LIGHTING_OUTPUT] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BINARY_LIGHTING_OUTPUT][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryLightingPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BITSTRING_VALUE] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.BITSTRING_VALUE][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT][src_1.PropertyIdentifier.TRACKING_VALUE] = src_1.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT][src_1.PropertyIdentifier.MODE] = src_1.LifeSafetyMode;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT][src_1.PropertyIdentifier.ACCEPTED_MODES] = src_1.LifeSafetyMode;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT][src_1.PropertyIdentifier.SILENCED] = src_1.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_POINT][src_1.PropertyIdentifier.OPERATION_EXPECTED] = src_1.LifeSafetyOperation;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_ZONE] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_ZONE][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LIFE_SAFETY_ZONE][src_1.PropertyIdentifier.MODE] = src_1.LifeSafetyMode;
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LOAD_CONTROL] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[src_1.ObjectType.LOAD_CONTROL][src_1.PropertyIdentifier.PRESENT_VALUE] = src_1.ShedState;
const propSubSet = process.argv.includes('--all')
    ? (0, src_1.getEnumValues)(src_1.PropertyIdentifier)
    : [
        src_1.PropertyIdentifier.OBJECT_IDENTIFIER,
        src_1.PropertyIdentifier.OBJECT_NAME,
        src_1.PropertyIdentifier.OBJECT_TYPE,
        src_1.PropertyIdentifier.PRESENT_VALUE,
        src_1.PropertyIdentifier.STATUS_FLAGS,
        src_1.PropertyIdentifier.EVENT_STATE,
        src_1.PropertyIdentifier.RELIABILITY,
        src_1.PropertyIdentifier.OUT_OF_SERVICE,
        src_1.PropertyIdentifier.UNITS,
        src_1.PropertyIdentifier.DESCRIPTION,
        src_1.PropertyIdentifier.SYSTEM_STATUS,
        src_1.PropertyIdentifier.VENDOR_NAME,
        src_1.PropertyIdentifier.VENDOR_IDENTIFIER,
        src_1.PropertyIdentifier.MODEL_NAME,
        src_1.PropertyIdentifier.FIRMWARE_REVISION,
        src_1.PropertyIdentifier.APPLICATION_SOFTWARE_VERSION,
        src_1.PropertyIdentifier.LOCATION,
        src_1.PropertyIdentifier.LOCAL_DATE,
        src_1.PropertyIdentifier.LOCAL_TIME,
        src_1.PropertyIdentifier.UTC_OFFSET,
        src_1.PropertyIdentifier.DAYLIGHT_SAVINGS_STATUS,
        src_1.PropertyIdentifier.PROTOCOL_VERSION,
        src_1.PropertyIdentifier.PROTOCOL_REVISION,
        src_1.PropertyIdentifier.PROTOCOL_SERVICES_SUPPORTED,
        src_1.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED,
        src_1.PropertyIdentifier.OBJECT_LIST,
        src_1.PropertyIdentifier.MAX_APDU_LENGTH_ACCEPTED,
        src_1.PropertyIdentifier.SEGMENTATION_SUPPORTED,
        src_1.PropertyIdentifier.APDU_TIMEOUT,
        src_1.PropertyIdentifier.NUMBER_OF_APDU_RETRIES,
        src_1.PropertyIdentifier.DEVICE_ADDRESS_BINDING,
        src_1.PropertyIdentifier.DATABASE_REVISION,
        src_1.PropertyIdentifier.MAX_INFO_FRAMES,
        src_1.PropertyIdentifier.MAX_MASTER,
        src_1.PropertyIdentifier.ACTIVE_COV_SUBSCRIPTIONS,
        src_1.PropertyIdentifier.ACTIVE_COV_MULTIPLE_SUBSCRIPTIONS,
    ];
const debug = process.argv.includes('--debug');
function getAllPropertiesManually(address, objectId, callback, propList, result) {
    if (!propList) {
        propList = propSubSet.map((x) => x);
    }
    if (!result) {
        result = [];
    }
    if (!propList.length) {
        return callback({
            values: [
                {
                    objectId,
                    values: result,
                },
            ],
        });
    }
    const prop = propList.shift();
    if (prop === undefined) {
        return getAllPropertiesManually(address, objectId, callback, propList, result);
    }
    bacnetClient.readProperty(address, objectId, prop, {}, (err, value) => {
        if (!err && value) {
            if (debug) {
                console.log(`Handle value ${prop}: `, JSON.stringify(value));
            }
            const objRes = {
                id: value.property.id,
                index: value.property.index,
                value: value.values,
            };
            result.push(objRes);
        }
        else {
        }
        getAllPropertiesManually(address, objectId, callback, propList, result);
    });
}
function readBit(buffer, i, bit) {
    return (buffer[i] >> bit) % 2;
}
function setBit(buffer, i, bit, value) {
    if (value === 0) {
        buffer[i] &= ~(1 << bit);
    }
    else {
        buffer[i] |= 1 << bit;
    }
}
function handleBitString(buffer, bitsUsed, usedEnum) {
    const res = [];
    for (let i = 0; i < bitsUsed; i++) {
        const bufferIndex = Math.floor(i / 8);
        if (readBit(buffer, bufferIndex, i % 8)) {
            if (usedEnum) {
                try {
                    const enumName = (0, src_1.getEnumName)(usedEnum, i);
                    if (enumName) {
                        res.push(enumName);
                    }
                    else {
                        res.push(i.toString());
                    }
                }
                catch (error) {
                    res.push(i.toString());
                }
            }
            else {
                res.push(i.toString());
            }
        }
    }
    return res;
}
function parseValue(address, objId, parentType, value, supportsMultiple, callback) {
    let resValue = null;
    if (value &&
        value.type &&
        value.value !== null &&
        value.value !== undefined) {
        switch (value.type) {
            case src_1.ApplicationTag.NULL:
                resValue = null;
                break;
            case src_1.ApplicationTag.BOOLEAN:
                resValue = !!value.value;
                break;
            case src_1.ApplicationTag.UNSIGNED_INTEGER:
            case src_1.ApplicationTag.SIGNED_INTEGER:
            case src_1.ApplicationTag.REAL:
            case src_1.ApplicationTag.DOUBLE:
            case src_1.ApplicationTag.CHARACTER_STRING:
                resValue = value.value;
                break;
            case src_1.ApplicationTag.DATE:
            case src_1.ApplicationTag.TIME:
            case src_1.ApplicationTag.TIMESTAMP:
                resValue = value.value;
                break;
            case src_1.ApplicationTag.BIT_STRING:
                if (ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType] &&
                    ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId]) {
                    resValue = handleBitString(value.value.value, value.value.bitsUsed, ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId]);
                }
                else if (PropertyIdentifierToEnumMap[objId]) {
                    resValue = handleBitString(value.value.value, value.value.bitsUsed, PropertyIdentifierToEnumMap[objId]);
                }
                else {
                    if (parentType !== src_1.ObjectType.BITSTRING_VALUE) {
                        console.log(`Unknown value for BIT_STRING type for objId ${(0, src_1.getEnumName)(src_1.PropertyIdentifier, objId)} and parent type ${(0, src_1.getEnumName)(src_1.ObjectType, parentType)}`);
                    }
                    resValue = value.value;
                }
                break;
            case src_1.ApplicationTag.ENUMERATED:
                if (ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType] &&
                    ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId]) {
                    resValue = (0, src_1.getEnumName)(ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId], value.value);
                }
                else if (PropertyIdentifierToEnumMap[objId]) {
                    resValue = (0, src_1.getEnumName)(PropertyIdentifierToEnumMap[objId], value.value);
                }
                else {
                    console.log(`Unknown value for ENUMERATED type for objId ${(0, src_1.getEnumName)(src_1.PropertyIdentifier, objId)} and parent type ${(0, src_1.getEnumName)(src_1.ObjectType, parentType)}`);
                    resValue = value.value;
                }
                break;
            case src_1.ApplicationTag.OBJECTIDENTIFIER:
                if (objId === src_1.PropertyIdentifier.OBJECT_IDENTIFIER ||
                    objId === src_1.PropertyIdentifier.STRUCTURED_OBJECT_LIST ||
                    objId === src_1.PropertyIdentifier.SUBORDINATE_LIST) {
                    resValue = value.value;
                }
                else if (supportsMultiple) {
                    const requestArray = [
                        {
                            objectId: value.value,
                            properties: [{ id: 8, index: 0 }],
                        },
                    ];
                    bacnetClient.readPropertyMultiple(address, requestArray, (err, resValue) => {
                        parseDeviceObject(address, resValue, value.value, true, callback);
                    });
                    return;
                }
                else {
                    getAllPropertiesManually(address, value.value, (result) => {
                        parseDeviceObject(address, result, value.value, false, callback);
                    });
                    return;
                }
                break;
            case src_1.ApplicationTag.OCTET_STRING:
                resValue = value.value;
                break;
            case src_1.ApplicationTag.ERROR:
                resValue = {
                    errorClass: (0, src_1.getEnumName)(src_1.ErrorClass, value.value.errorClass),
                    errorCode: (0, src_1.getEnumName)(src_1.ErrorCode, value.value.errorCode),
                };
                break;
            case src_1.ApplicationTag.OBJECT_PROPERTY_REFERENCE:
            case src_1.ApplicationTag.DEVICE_OBJECT_PROPERTY_REFERENCE:
            case src_1.ApplicationTag.DEVICE_OBJECT_REFERENCE:
            case src_1.ApplicationTag.READ_ACCESS_SPECIFICATION:
                resValue = value.value;
                break;
            case src_1.ApplicationTag.CONTEXT_SPECIFIC_DECODED:
                parseValue(address, objId, parentType, value.value, supportsMultiple, callback);
                return;
            case src_1.ApplicationTag.READ_ACCESS_RESULT:
                resValue = value.value;
                break;
            default:
                console.log(`unknown type ${value.type}: ${JSON.stringify(value)}`);
                resValue = value;
        }
    }
    setImmediate(() => callback(resValue));
}
function parseDeviceObject(address, obj, parent, supportsMultiple, callback) {
    if (debug) {
        console.log(`START parseDeviceObject: ${JSON.stringify(parent)} : ${JSON.stringify(obj)}`);
    }
    if (!obj) {
        console.log('object not valid on parse device object');
        return;
    }
    if (!obj.values || !Array.isArray(obj.values)) {
        console.log('No device or invalid response');
        callback({ ERROR: 'No device or invalid response' });
        return;
    }
    let cbCount = 0;
    const objDefMap = new Map();
    const finalize = () => {
        const resultObj = {};
        objDefMap.forEach((propMap, devIdKey) => {
            const deviceObj = {};
            resultObj[devIdKey] = deviceObj;
            propMap.forEach((valueArray, propIdKey) => {
                deviceObj[propIdKey] =
                    valueArray.length === 1 ? valueArray[0] : valueArray;
            });
        });
        if (obj.values.length === 1 &&
            obj.values[0]?.objectId?.instance !== undefined) {
            const firstDeviceId = String(obj.values[0].objectId.instance);
            if (resultObj[firstDeviceId]) {
                if (debug) {
                    console.log(`END parseDeviceObject (single device): ${JSON.stringify(parent)} : ${JSON.stringify(resultObj[firstDeviceId])}`);
                }
                callback(resultObj[firstDeviceId]);
                return;
            }
        }
        if (debug) {
            console.log(`END parseDeviceObject (multiple devices): ${JSON.stringify(parent)} : ${JSON.stringify(resultObj)}`);
        }
        callback(resultObj);
    };
    obj.values.forEach((devBaseObj) => {
        if (!devBaseObj.objectId) {
            console.log('No device Id found in object data');
            return;
        }
        if (devBaseObj.objectId.type === undefined ||
            devBaseObj.objectId.instance === undefined) {
            console.log('No device type or instance found in object data');
            return;
        }
        if (!devBaseObj.values || !Array.isArray(devBaseObj.values)) {
            console.log('No device values response');
            return;
        }
        const deviceId = String(devBaseObj.objectId.instance);
        let deviceMap = objDefMap.get(deviceId);
        if (!deviceMap) {
            deviceMap = new Map();
            objDefMap.set(deviceId, deviceMap);
        }
        devBaseObj.values.forEach((devObj) => {
            if (devObj.id === undefined) {
                return;
            }
            let objId = (0, src_1.getEnumName)(src_1.PropertyIdentifier, devObj.id);
            if (objId && devObj.index !== 4294967295) {
                objId += `-${devObj.index}`;
            }
            if (!objId) {
                console.log('Invalid property identifier:', devObj.id);
                return;
            }
            if (debug) {
                console.log('Handle Object property:', deviceId, objId, devObj.value);
            }
            if (!Array.isArray(devObj.value)) {
                console.log('Device object value is not an array:', devObj);
                return;
            }
            devObj.value.forEach((val) => {
                let propArray = deviceMap.get(objId);
                if (!propArray) {
                    propArray = [];
                    deviceMap.set(objId, propArray);
                }
                if (JSON.stringify(val.value) === JSON.stringify(parent)) {
                    propArray.push(val.value);
                    return;
                }
                cbCount++;
                parseValue(address, devObj.id, parent.type, val, supportsMultiple, (parsedValue) => {
                    if (debug) {
                        console.log('RETURN parsedValue', deviceId, objId, devObj.value, parsedValue);
                    }
                    let deviceMapInCallback = objDefMap.get(deviceId);
                    if (!deviceMapInCallback) {
                        deviceMapInCallback = new Map();
                        objDefMap.set(deviceId, deviceMapInCallback);
                    }
                    let propArrayInCallback = deviceMapInCallback.get(objId);
                    if (!propArrayInCallback) {
                        propArrayInCallback = [];
                        deviceMapInCallback.set(objId, propArrayInCallback);
                    }
                    propArrayInCallback.push(parsedValue);
                    if (!--cbCount) {
                        finalize();
                    }
                });
            });
        });
    });
    if (cbCount === 0) {
        finalize();
    }
}
let objectsDone = 0;
function printResultObject(deviceId, obj) {
    objectsDone++;
    console.log(`Device ${deviceId} (${objectsDone}/${Object.keys(knownDevices).length}) read successfully ...`);
    console.log(JSON.stringify(obj));
    console.log();
    console.log();
    if (objectsDone === Object.keys(knownDevices).length) {
        setTimeout(() => {
            bacnetClient.close();
            console.log(`closed transport ${Date.now()}`);
        }, 1000);
    }
}
let limitToDevice = null;
if (process.argv.length === 3) {
    limitToDevice = parseInt(process.argv[2]);
    if (isNaN(limitToDevice)) {
        limitToDevice = null;
    }
}
const bacnetClient = new src_1.default({ apduTimeout: 4000, interface: '0.0.0.0' });
bacnetClient.on('message', (msg, rinfo) => {
    console.log(msg);
    if (rinfo)
        console.log(rinfo);
});
bacnetClient.on('error', (err) => {
    console.error(err);
    bacnetClient.close();
});
bacnetClient.on('listening', () => {
    console.log(`sent whoIs ${Date.now()}`);
    bacnetClient.whoIs();
});
const knownDevices = [];
bacnetClient.on('iAm', (device) => {
    if (!device.header || !device.payload) {
        console.log('Received invalid device information');
        return;
    }
    const address = device.header.sender;
    const deviceId = device.payload.deviceId;
    if (knownDevices.includes(deviceId))
        return;
    if (limitToDevice !== null && limitToDevice !== deviceId)
        return;
    console.log(`Found Device ${deviceId} on ${JSON.stringify(address)}`);
    knownDevices.push(deviceId);
    const propertyList = [];
    propSubSet.forEach((item) => {
        propertyList.push({ id: item, index: 4294967295 });
    });
    const requestArray = [
        {
            objectId: { type: 8, instance: deviceId },
            properties: propertyList,
        },
    ];
    bacnetClient.readPropertyMultiple(address.address, requestArray, (err, value) => {
        if (err) {
            console.log(deviceId, 'No ReadPropertyMultiple supported:', err.message);
            getAllPropertiesManually(address, { type: 8, instance: deviceId }, (result) => {
                parseDeviceObject(address, result, { type: 8, instance: deviceId }, false, (res) => printResultObject(deviceId, res));
            });
        }
        else {
            console.log(deviceId, 'ReadPropertyMultiple supported ...');
            parseDeviceObject(address, value, { type: 8, instance: deviceId }, true, (res) => printResultObject(deviceId, res));
        }
    });
});
//# sourceMappingURL=read-device.js.map