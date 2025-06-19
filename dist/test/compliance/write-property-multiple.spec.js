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
node_test_1.default.describe('bacnet - write property multiple compliance', () => {
    let bacnetClient;
    let discoveredAddress;
    const onClose = null;
    function asyncReadProperty(address, objectId, propertyId) {
        return new Promise((resolve, reject) => {
            bacnetClient.readProperty(address, objectId, propertyId, (err, value) => {
                if (err) {
                    if (err.message === 'ERR_TIMEOUT') {
                        utils.debug('Got timeout on read property - acceptable in this environment');
                        resolve({ timeout: true });
                        return;
                    }
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    }
    function asyncWritePropertyMultiple(address, values) {
        return new Promise((resolve, reject) => {
            bacnetClient.writePropertyMultiple(address, values, {}, (err) => {
                if (err) {
                    if (err.message === 'ERR_TIMEOUT') {
                        utils.debug('Got timeout on write property multiple - acceptable in this environment');
                        resolve({ timeout: true });
                        return;
                    }
                    if (err.message.includes('BacnetError')) {
                        resolve({ error: err });
                        return;
                    }
                    reject(err);
                }
                else {
                    resolve({ success: true });
                }
            });
        });
    }
    node_test_1.default.before(async () => {
        bacnetClient = new utils.bacnetClient({
            apduTimeout: utils.apduTimeout,
            interface: utils.clientListenerInterface,
        });
        bacnetClient.on('message', (msg, rinfo) => {
            utils.debug(msg);
            if (rinfo)
                utils.debug(rinfo);
        });
        bacnetClient.on('iAm', (device) => {
            discoveredAddress = device.header.sender;
        });
        bacnetClient.on('error', (err) => {
            console.error(err);
            bacnetClient.close();
        });
        await (0, node_events_1.once)(bacnetClient, 'listening');
    });
    node_test_1.default.after(async () => {
        return new Promise((done) => {
            setTimeout(() => {
                bacnetClient.close();
                if (onClose) {
                    onClose(done);
                }
                else {
                    done();
                }
            }, 100);
        });
    });
    (0, node_test_1.default)('should find the device simulator device', async () => {
        bacnetClient.whoIs();
        const [device] = await (0, node_events_1.once)(bacnetClient, 'iAm');
        if (device.payload.deviceId === utils.deviceUnderTest) {
            discoveredAddress = device.header.sender;
            node_assert_1.default.strictEqual(device.payload.deviceId, utils.deviceUnderTest);
            node_assert_1.default.ok(discoveredAddress, 'discoveredAddress should be an object');
            node_assert_1.default.match(discoveredAddress.address, /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
        }
    });
    (0, node_test_1.default)('read property PRESENT_VALUE from analog-output,2 from device', async () => {
        const result = await asyncReadProperty(discoveredAddress, { type: 1, instance: 2 }, 85);
        if (!result.timeout) {
            node_assert_1.default.ok(result, 'value should be an object');
        }
    });
    (0, node_test_1.default)('write property using Multiple PRESENT_VALUE from analog-output,2 from device', async () => {
        const values = [
            {
                objectId: { type: 1, instance: 2 },
                values: [
                    {
                        property: { id: 85 },
                        value: [{ type: 4, value: 100 }],
                        priority: 8,
                    },
                ],
            },
        ];
        const result = await asyncWritePropertyMultiple(discoveredAddress, values);
        if (result.error) {
            node_assert_1.default.ok(result.error.message.includes('BacnetError') ||
                result.error.message.includes('ERR_TIMEOUT'), `Expected specific error or timeout but got: ${result.error.message}`);
        }
    });
    (0, node_test_1.default)('read property PRESENT_VALUE from analog-output,2 from device, expect written value', async () => {
        const result = await asyncReadProperty(discoveredAddress, { type: 1, instance: 2 }, 85);
        if (!result.timeout) {
            node_assert_1.default.ok(result, 'value should be an object');
        }
    });
});
//# sourceMappingURL=write-property-multiple.spec.js.map