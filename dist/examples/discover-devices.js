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
const bacnetClient = new src_1.default({ apduTimeout: 10000, interface: '0.0.0.0' });
bacnetClient.on('error', (err) => {
    console.error(err);
    bacnetClient.close();
});
bacnetClient.on('listening', () => {
    console.log('discovering devices for 30 seconds ...');
    bacnetClient.whoIs();
    setTimeout(() => {
        bacnetClient.close();
        console.log(`closed transport ${Date.now()}`);
    }, 30000);
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
    const deviceObjectId = { type: 8, instance: deviceId };
    bacnetClient.readProperty(address, deviceObjectId, src_1.PropertyIdentifier.OBJECT_NAME, (err, value) => {
        if (err) {
            console.log(`Found Device ${deviceId} on ${JSON.stringify(address)}`);
            console.log(err);
        }
        else {
            bacnetClient.readProperty(address, deviceObjectId, src_1.PropertyIdentifier.VENDOR_NAME, (err2, valueVendor) => {
                if (value && value.values && value.values[0]?.value) {
                    console.log(`Found Device ${deviceId} on ${JSON.stringify(address)}: ${value.values[0].value}`);
                }
                else {
                    console.log(`Found Device ${deviceId} on ${JSON.stringify(address)}`);
                    console.log('value: ', JSON.stringify(value));
                }
                if (!err2 &&
                    valueVendor?.values &&
                    valueVendor.values[0]?.value) {
                    console.log(`Vendor: ${valueVendor.values[0].value}`);
                }
                console.log();
            });
        }
    });
    knownDevices.push(deviceId);
});
//# sourceMappingURL=discover-devices.js.map