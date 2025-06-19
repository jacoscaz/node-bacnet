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
node_test_1.default.describe('bacnet - subscribe cov compliance', () => {
    let bacnetClient;
    let discoveredAddress;
    const onClose = null;
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
});
//# sourceMappingURL=subscribe-cov.spec.js.map