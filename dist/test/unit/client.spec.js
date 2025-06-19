"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const client_1 = __importDefault(require("../../src/lib/client"));
const src_1 = require("../../src");
node_test_1.default.describe('bacnet - client', () => {
    (0, node_test_1.default)('should successfuly encode a bitstring > 32 bits', () => {
        const result = client_1.default.createBitstring([
            src_1.ServicesSupported.CONFIRMED_COV_NOTIFICATION,
            src_1.ServicesSupported.READ_PROPERTY,
            src_1.ServicesSupported.WHO_IS,
        ]);
        node_assert_1.default.deepStrictEqual(result, {
            value: [2, 16, 0, 0, 4],
            bitsUsed: 35,
        });
    });
    (0, node_test_1.default)('should successfuly encode a bitstring < 8 bits', () => {
        const result = client_1.default.createBitstring([
            src_1.ServicesSupported.GET_ALARM_SUMMARY,
        ]);
        node_assert_1.default.deepStrictEqual(result, {
            value: [8],
            bitsUsed: 4,
        });
    });
    (0, node_test_1.default)('should successfuly encode a bitstring of only one bit', () => {
        const result = client_1.default.createBitstring([
            src_1.ServicesSupported.ACKNOWLEDGE_ALARM,
        ]);
        node_assert_1.default.deepStrictEqual(result, {
            value: [1],
            bitsUsed: 1,
        });
    });
});
//# sourceMappingURL=client.spec.js.map