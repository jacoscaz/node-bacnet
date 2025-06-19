"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const services_1 = require("../../src/lib/services");
node_test_1.default.describe('bacnet - register foreign device integration', () => {
    (0, node_test_1.default)('should encode', () => {
        const buffer = { buffer: Buffer.alloc(16, 12), offset: 0 };
        const testBuffer = { buffer: Buffer.alloc(16, 12), offset: 2 };
        const testBufferChange = Buffer.from([0, 0, 12, 12]);
        testBuffer.buffer.fill(testBufferChange, 0, 4);
        services_1.RegisterForeignDevice.encode(buffer, 0);
        node_assert_1.default.deepStrictEqual(buffer, testBuffer);
    });
    (0, node_test_1.default)('should decode', () => {
        const buffer = Buffer.alloc(16, 23);
        const bufferCompare = Buffer.alloc(16, 23);
        services_1.RegisterForeignDevice.decode(buffer, 0);
        node_assert_1.default.deepStrictEqual(buffer, bufferCompare);
    });
});
//# sourceMappingURL=register-foreign-device.spec.js.map