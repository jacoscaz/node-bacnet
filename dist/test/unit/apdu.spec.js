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
const baApdu = __importStar(require("../../src/lib/apdu"));
node_test_1.default.describe('bacnet - APDU layer', () => {
    node_test_1.default.describe('decodedType', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const value = Buffer.from([0, 128, 4, 5]);
            baApdu.setDecodedType(value, 1, 48);
            const result = baApdu.getDecodedInvokeId(value, 1);
            node_assert_1.default.strictEqual(result, 4);
        });
        (0, node_test_1.default)('should correctly encode and decode a confirmed service package', () => {
            const value = Buffer.from([0, 128, 4, 5]);
            baApdu.setDecodedType(value, 1, 0);
            const result = baApdu.getDecodedInvokeId(value, 1);
            node_assert_1.default.strictEqual(result, 5);
        });
        (0, node_test_1.default)('should fail if decode an invalid package', () => {
            const value = Buffer.from([0, 128, 4, 5]);
            const result = baApdu.getDecodedInvokeId(value, 1);
            node_assert_1.default.strictEqual(result, undefined);
        });
    });
    node_test_1.default.describe('confirmedServiceRequest', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeConfirmedServiceRequest(buffer, 0, 41, 176, 12, 44, 45, 46);
            const result = baApdu.decodeConfirmedServiceRequest(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 4,
                type: 0,
                service: 41,
                maxSegments: 176,
                maxApdu: 12,
                invokeId: 44,
                sequencenumber: 0,
                proposedWindowNumber: 0,
            });
        });
        (0, node_test_1.default)('should correctly encode and decode a segmented package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeConfirmedServiceRequest(buffer, 8, 47, 208, 14, 50, 51, 52);
            const result = baApdu.decodeConfirmedServiceRequest(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 6,
                type: 8,
                service: 47,
                maxSegments: 208,
                maxApdu: 14,
                invokeId: 50,
                sequencenumber: 51,
                proposedWindowNumber: 52,
            });
        });
    });
    node_test_1.default.describe('unconfirmedServiceRequest', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeUnconfirmedServiceRequest(buffer, 33, 34);
            const result = baApdu.decodeUnconfirmedServiceRequest(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 2,
                type: 33,
                service: 34,
            });
        });
    });
    node_test_1.default.describe('simpleAck', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeSimpleAck(buffer, 11, 12, 13);
            const result = baApdu.decodeSimpleAck(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 3,
                type: 11,
                service: 12,
                invokeId: 13,
            });
        });
    });
    node_test_1.default.describe('complexAck', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeComplexAck(buffer, 0, 15, 16, 20, 21);
            const result = baApdu.decodeComplexAck(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 3,
                type: 0,
                service: 15,
                invokeId: 16,
                sequencenumber: 0,
                proposedWindowNumber: 0,
            });
        });
        (0, node_test_1.default)('should correctly encode and decode a segmented package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeComplexAck(buffer, 8, 18, 19, 20, 21);
            const result = baApdu.decodeComplexAck(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 5,
                type: 8,
                service: 18,
                invokeId: 19,
                sequencenumber: 20,
                proposedWindowNumber: 21,
            });
        });
    });
    node_test_1.default.describe('segmentAck', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeSegmentAck(buffer, 6, 7, 8, 9);
            const result = baApdu.decodeSegmentAck(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 4,
                type: 6,
                originalInvokeId: 7,
                sequencenumber: 8,
                actualWindowSize: 9,
            });
        });
    });
    node_test_1.default.describe('error', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeError(buffer, 5, 6, 7);
            const result = baApdu.decodeError(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 3,
                type: 5,
                service: 6,
                invokeId: 7,
            });
        });
    });
    node_test_1.default.describe('abort', () => {
        (0, node_test_1.default)('should correctly encode and decode a package', () => {
            const buffer = utils.getBuffer();
            baApdu.encodeAbort(buffer, 4, 5, 6);
            const result = baApdu.decodeAbort(buffer.buffer, 0);
            node_assert_1.default.deepStrictEqual(result, {
                len: 3,
                type: 4,
                invokeId: 5,
                reason: 6,
            });
        });
    });
});
//# sourceMappingURL=apdu.spec.js.map