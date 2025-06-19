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
const baAsn1 = __importStar(require("../../src/lib/asn1"));
node_test_1.default.describe('bacnet - ASN1 layer', () => {
    node_test_1.default.describe('decodeUnsigned', () => {
        (0, node_test_1.default)('should successfully decode 8-bit unsigned integer', () => {
            const result = baAsn1.decodeUnsigned(Buffer.from([0x00, 0xff, 0xff, 0xff, 0xff]), 1, 1);
            node_assert_1.default.deepStrictEqual(result, { len: 1, value: 255 });
        });
        (0, node_test_1.default)('should successfully decode 16-bit unsigned integer', () => {
            const result = baAsn1.decodeUnsigned(Buffer.from([0x00, 0xff, 0xff, 0xff, 0xff]), 1, 2);
            node_assert_1.default.deepStrictEqual(result, { len: 2, value: 65535 });
        });
        (0, node_test_1.default)('should successfully decode 24-bit unsigned integer', () => {
            const result = baAsn1.decodeUnsigned(Buffer.from([0x00, 0xff, 0xff, 0xff, 0xff]), 1, 3);
            node_assert_1.default.deepStrictEqual(result, { len: 3, value: 16777215 });
        });
        (0, node_test_1.default)('should successfully decode 32-bit unsigned integer', () => {
            const result = baAsn1.decodeUnsigned(Buffer.from([0x00, 0xff, 0xff, 0xff, 0xff]), 1, 4);
            node_assert_1.default.deepStrictEqual(result, { len: 4, value: 4294967295 });
        });
        (0, node_test_1.default)('should successfully decode length 0', () => {
            const result = baAsn1.decodeUnsigned(Buffer.from([]), 0, 0);
            node_assert_1.default.deepStrictEqual(result, { len: 0, value: 0 });
        });
    });
    node_test_1.default.describe('encodeBacnetObjectId', () => {
        (0, node_test_1.default)('should successfully encode with object-type > 512', () => {
            const buffer = { buffer: Buffer.alloc(4), offset: 0 };
            baAsn1.encodeBacnetObjectId(buffer, 600, 600);
            node_assert_1.default.deepStrictEqual(buffer, {
                buffer: Buffer.from([150, 0, 2, 88]),
                offset: 4,
            });
        });
    });
    node_test_1.default.describe('encodeOpeningTag', () => {
        (0, node_test_1.default)('should successfully encode with opening-tag > 14 = 15', () => {
            const buffer = { buffer: Buffer.alloc(15, 10), offset: 0 };
            baAsn1.encodeOpeningTag(buffer, 15);
            node_assert_1.default.deepStrictEqual(buffer, {
                buffer: Buffer.from([
                    254, 15, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                ]),
                offset: 2,
            });
        });
        (0, node_test_1.default)('should successfully encode with opening-tag > 253 = 255', () => {
            const buffer = { buffer: Buffer.alloc(255, 12), offset: 0 };
            const testBuffer = Buffer.alloc(255, 12);
            const testBufferChange = Buffer.from([142, 12, 12, 12]);
            testBuffer.fill(testBufferChange, 0, 4);
            const bufferToCompare = { buffer: testBuffer, offset: 1 };
            baAsn1.encodeOpeningTag(buffer, 8);
            node_assert_1.default.deepStrictEqual(buffer, bufferToCompare);
        });
    });
    node_test_1.default.describe('encodeClosingTag', () => {
        (0, node_test_1.default)('should successfully encode with closing-tag > 14 = 15', () => {
            const buffer = { buffer: Buffer.alloc(15, 10), offset: 0 };
            baAsn1.encodeClosingTag(buffer, 15);
            node_assert_1.default.deepStrictEqual(buffer, {
                buffer: Buffer.from([
                    255, 15, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                ]),
                offset: 2,
            });
        });
        (0, node_test_1.default)('should successfully encode with closing-tag > 253 = 255', () => {
            const buffer = { buffer: Buffer.alloc(255, 12), offset: 0 };
            const testBuffer = Buffer.alloc(255, 12);
            const testBufferChange = Buffer.from([143, 12, 12, 12]);
            testBuffer.fill(testBufferChange, 0, 4);
            const bufferToCompare = { buffer: testBuffer, offset: 1 };
            baAsn1.encodeClosingTag(buffer, 8);
            node_assert_1.default.deepStrictEqual(buffer, bufferToCompare);
        });
    });
    node_test_1.default.describe('encodeBacnetDate', () => {
        (0, node_test_1.default)('should successfully encode with Date 1-1-1', () => {
            const buffer = { buffer: Buffer.alloc(15, 10), offset: 0 };
            const testBuffer = Buffer.alloc(15, 10);
            const testBufferChange = Buffer.from([1, 1, 1, 5]);
            testBuffer.fill(testBufferChange, 0, 4);
            const bufferToCompare = { buffer: testBuffer, offset: 4 };
            baAsn1.encodeBacnetDate(buffer, new Date(1, 1, 1));
            node_assert_1.default.deepStrictEqual(buffer, bufferToCompare);
        });
        (0, node_test_1.default)('should throw error with Date 257-1-1', () => {
            const buffer = { buffer: Buffer.alloc(15, 10), offset: 0 };
            const bufferToCompare = { buffer: Buffer.alloc(15, 10), offset: 0 };
            node_assert_1.default.throws(() => baAsn1.encodeBacnetDate(buffer, new Date(257, 1, 1)), /invalid year: 257/);
            node_assert_1.default.deepStrictEqual(buffer, bufferToCompare);
        });
        (0, node_test_1.default)('should successfully encode with Date 2020-6-1', () => {
            const buffer = { buffer: Buffer.alloc(15, 10), offset: 0 };
            const testBuffer = Buffer.alloc(15, 10);
            const testBufferChange = Buffer.from([120, 6, 1, 3]);
            testBuffer.fill(testBufferChange, 0, 4);
            const bufferToCompare = { buffer: testBuffer, offset: 4 };
            baAsn1.encodeBacnetDate(buffer, new Date(2020, 6, 1));
            node_assert_1.default.deepStrictEqual(buffer, bufferToCompare);
        });
    });
});
//# sourceMappingURL=asn1.spec.js.map