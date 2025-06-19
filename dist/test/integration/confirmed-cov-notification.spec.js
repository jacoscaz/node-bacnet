"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const client_1 = __importDefault(require("../../src/lib/client"));
const src_1 = require("../../src");
node_test_1.default.describe('bacnet - confirmedCOVNotification integration', () => {
    (0, node_test_1.default)('should return a timeout error if no device is available', async (t) => {
        return new Promise((resolve) => {
            const client = new client_1.default({ apduTimeout: 200 });
            const monitoredObjectId = {
                type: 2,
                instance: 122,
            };
            client.confirmedCOVNotification('127.0.0.2', monitoredObjectId, 3, 433, 120, [
                {
                    property: { id: 85, index: 0 },
                    value: [{ type: src_1.ApplicationTag.REAL, value: 12.3 }],
                },
                {
                    property: { id: 111, index: 0 },
                    value: [
                        {
                            type: src_1.ApplicationTag.BIT_STRING,
                            value: 0xffff,
                        },
                    ],
                },
            ], (err) => {
                node_assert_1.default.strictEqual(err.message, 'ERR_TIMEOUT');
                client.close();
                resolve();
            });
        });
    });
});
//# sourceMappingURL=confirmed-cov-notification.spec.js.map