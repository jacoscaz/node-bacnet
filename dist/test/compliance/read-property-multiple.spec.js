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
const utils = __importStar(require("./utils"));
const node_events_1 = require("node:events");
const src_1 = require("../../src");
node_test_1.default.describe('bacnet - read property multiple compliance', () => {
    let bacnetClient;
    let discoveredAddress;
    const onClose = null;
    function asyncReadPropertyMultiple(address, propertiesArray) {
        return new Promise((resolve, reject) => {
            bacnetClient.readPropertyMultiple(address, propertiesArray, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
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
    (0, node_test_1.default)('read all properties from invalid device, expect errors in response', async () => {
        const requestArray = [
            {
                objectId: { type: 8, instance: utils.deviceUnderTest + 1 },
                properties: [{ index: src_1.ASN1_ARRAY_ALL, id: 8 }],
            },
        ];
        try {
            await asyncReadPropertyMultiple(discoveredAddress, requestArray);
            node_assert_1.default.fail('Expected an error but got none');
        }
        catch (err) {
            node_assert_1.default.ok(err, 'Error should be present');
            node_assert_1.default.ok(err.message.includes('BacnetError'), `Error message should include BacnetError, got: ${err.message}`);
        }
    });
    (0, node_test_1.default)('read all properties from device, use discovered device address object', async () => {
        const requestArray = [
            {
                objectId: { type: 8, instance: utils.deviceUnderTest },
                properties: [{ index: src_1.ASN1_ARRAY_ALL, id: 8 }],
            },
        ];
        const value = await asyncReadPropertyMultiple(discoveredAddress, requestArray);
        node_assert_1.default.ok(value, 'value should be an object');
        node_assert_1.default.ok(Array.isArray(value.values), 'value.values should be an array');
        node_assert_1.default.ok(value.values[0], 'value.values[0] should be an object');
        node_assert_1.default.deepStrictEqual(value.values[0].objectId, {
            type: 8,
            instance: utils.deviceUnderTest,
        });
        node_assert_1.default.ok(Array.isArray(value.values[0].values), 'value.values[0].values should be an array');
        const prop75 = value.values[0].values.find((v) => v.id === 75);
        node_assert_1.default.ok(prop75, 'Should have property with ID 75');
        node_assert_1.default.deepStrictEqual(prop75.value[0], {
            len: 5,
            value: {
                type: 8,
                instance: utils.deviceUnderTest,
            },
            type: 12,
        });
    });
    (0, node_test_1.default)('read all properties from device, use discovered device address as IP', async () => {
        const requestArray = [
            {
                objectId: { type: 8, instance: utils.deviceUnderTest },
                properties: [{ index: src_1.ASN1_ARRAY_ALL, id: 8 }],
            },
        ];
        const value = await asyncReadPropertyMultiple(discoveredAddress.address, requestArray);
        node_assert_1.default.ok(value, 'value should be an object');
        node_assert_1.default.ok(Array.isArray(value.values), 'value.values should be an array');
        node_assert_1.default.ok(value.values[0], 'value.values[0] should be an object');
        node_assert_1.default.deepStrictEqual(value.values[0].objectId, {
            type: 8,
            instance: utils.deviceUnderTest,
        });
        node_assert_1.default.ok(Array.isArray(value.values[0].values), 'value.values[0].values should be an array');
        const prop75 = value.values[0].values.find((v) => v.id === 75);
        node_assert_1.default.ok(prop75, 'Should have property with ID 75');
        node_assert_1.default.deepStrictEqual(prop75.value[0], {
            len: 5,
            value: {
                type: 8,
                instance: utils.deviceUnderTest,
            },
            type: 12,
        });
    });
    (0, node_test_1.default)('read all properties from analog-output,2 of simulator device', { timeout: 15000 }, async () => {
        const requestArray = [
            {
                objectId: { type: 1, instance: 2 },
                properties: [{ index: src_1.ASN1_ARRAY_ALL, id: 8 }],
            },
        ];
        const value = await asyncReadPropertyMultiple(discoveredAddress, requestArray);
        node_assert_1.default.ok(value, 'value should be an object');
        node_assert_1.default.ok(Array.isArray(value.values), 'value.values should be an array');
        node_assert_1.default.ok(value.values[0], 'value.values[0] should be an object');
        node_assert_1.default.deepStrictEqual(value.values[0].objectId, {
            type: 1,
            instance: 2,
        });
        node_assert_1.default.ok(Array.isArray(value.values[0].values), 'value.values[0].values should be an array');
        const prop75 = value.values[0].values.find((v) => v.id === 75);
        node_assert_1.default.ok(prop75, 'Should have property with ID 75');
        node_assert_1.default.deepStrictEqual(prop75.value[0], {
            len: 5,
            value: {
                type: 1,
                instance: 2,
            },
            type: 12,
        });
        const prop77 = value.values[0].values.find((v) => v.id === 77);
        node_assert_1.default.ok(prop77, 'Should have property with ID 77');
        node_assert_1.default.deepStrictEqual(prop77.value[0], {
            len: 18,
            value: 'ANALOG OUTPUT 2',
            type: 7,
            encoding: 0,
        });
    });
    (0, node_test_1.default)('read all properties from device, use broadcast', { timeout: 15000 }, async () => {
        const requestArray = [
            {
                objectId: { type: 8, instance: utils.deviceUnderTest },
                properties: [{ index: src_1.ASN1_ARRAY_ALL, id: 8 }],
            },
        ];
        const value = await asyncReadPropertyMultiple(null, requestArray);
        node_assert_1.default.ok(value, 'value should be an object');
        node_assert_1.default.ok(Array.isArray(value.values), 'value.values should be an array');
        node_assert_1.default.ok(value.values[0], 'value.values[0] should be an object');
        node_assert_1.default.deepStrictEqual(value.values[0].objectId, {
            type: 8,
            instance: utils.deviceUnderTest,
        });
        node_assert_1.default.ok(Array.isArray(value.values[0].values), 'value.values[0].values should be an array');
        const prop75 = value.values[0].values.find((v) => v.id === 75);
        node_assert_1.default.ok(prop75, 'Should have property with ID 75');
        node_assert_1.default.deepStrictEqual(prop75.value[0], {
            len: 5,
            value: {
                type: 8,
                instance: utils.deviceUnderTest,
            },
            type: 12,
        });
    });
});
//# sourceMappingURL=read-property-multiple.spec.js.map