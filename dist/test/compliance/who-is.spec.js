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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_events_1 = require("node:events");
const utils = __importStar(require("./utils"));
node_test_1.default.describe('bacnet - whoIs compliance', () => {
    let bacnetClient;
    function asyncWhoIs(options, timeoutMs = 10000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Test timed out waiting for device'));
            }, timeoutMs);
            const handleIAm = (device) => {
                if (device.payload.deviceId === utils.deviceUnderTest) {
                    clearTimeout(timeoutId);
                    bacnetClient.removeListener('iAm', handleIAm);
                    resolve(device);
                }
            };
            bacnetClient.on('iAm', handleIAm);
            bacnetClient.whoIs(options);
        });
    }
    function asyncNoDeviceResponse(options, timeoutMs = 4000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                bacnetClient.removeListener('iAm', handleIAm);
                resolve();
            }, timeoutMs);
            const handleIAm = (device) => {
                if (device.payload.deviceId >= options.lowLimit &&
                    device.payload.deviceId <= options.highLimit) {
                    clearTimeout(timeoutId);
                    bacnetClient.removeListener('iAm', handleIAm);
                    reject(new Error('No discovery result to be expected'));
                }
            };
            bacnetClient.on('iAm', handleIAm);
            bacnetClient.whoIs(options);
        });
    }
    node_test_1.default.beforeEach(async () => {
        bacnetClient = new utils.bacnetClient({
            apduTimeout: utils.apduTimeout,
            interface: utils.clientListenerInterface,
        });
        bacnetClient.on('message', (msg, rinfo) => {
            utils.debug(msg);
            if (rinfo)
                utils.debug(rinfo);
        });
        bacnetClient.on('error', (err) => {
            console.error(err);
            bacnetClient.close();
        });
        await (0, node_events_1.once)(bacnetClient, 'listening');
    });
    node_test_1.default.afterEach(async () => {
        return new Promise((done) => {
            setTimeout(() => {
                bacnetClient.close();
                done();
            }, 1000);
        });
    });
    (0, node_test_1.default)('should find the device simulator', async () => {
        const device = await asyncWhoIs();
        node_assert_1.default.ok(device.header, 'device.header should exist');
        node_assert_1.default.ok(device.payload, 'device.payload should exist');
        node_assert_1.default.strictEqual(device.payload.deviceId, utils.deviceUnderTest);
        node_assert_1.default.strictEqual(device.payload.maxApdu, utils.maxApdu);
        node_assert_1.default.strictEqual(device.payload.segmentation, 3);
        node_assert_1.default.strictEqual(device.payload.vendorId, utils.vendorId);
        node_assert_1.default.ok(device.header.sender, 'device.header.sender should exist');
        node_assert_1.default.ok(device.header.sender.address, 'device.header.sender.address should exist');
        node_assert_1.default.strictEqual(device.header.sender.forwardedFrom, null);
    });
    (0, node_test_1.default)('should find the device simulator with provided min device ID', async () => {
        const device = await asyncWhoIs({ lowLimit: utils.deviceUnderTest - 1 });
        node_assert_1.default.strictEqual(device.payload.deviceId, utils.deviceUnderTest);
    });
    (0, node_test_1.default)('should find the device simulator with provided min/max device ID and IP', async () => {
        const device = await asyncWhoIs({
            lowLimit: utils.deviceUnderTest - 1,
            highLimit: utils.deviceUnderTest + 1,
        });
        node_assert_1.default.strictEqual(device.payload.deviceId, utils.deviceUnderTest);
    });
    (0, node_test_1.default)('should NOT find any device', async () => {
        await asyncNoDeviceResponse({
            lowLimit: utils.deviceUnderTest + 1,
            highLimit: utils.deviceUnderTest + 3,
        });
    });
});
//# sourceMappingURL=who-is.spec.js.map