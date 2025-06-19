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
const baNpdu = __importStar(require("../../src/lib/npdu"));
node_test_1.default.describe('bacnet - NPDU layer', () => {
    (0, node_test_1.default)('should successfully decode the NPDU function', () => {
        const result = baNpdu.decodeFunction(Buffer.from([0, 1, 12]), 1);
        node_assert_1.default.strictEqual(result, 12);
    });
    (0, node_test_1.default)('should fail decoding the NPDU function if invalid version', () => {
        const result = baNpdu.decodeFunction(Buffer.from([0, 2, 12]), 1);
        node_assert_1.default.strictEqual(result, undefined);
    });
    (0, node_test_1.default)('should successfully encode and decode a basic NPDU package', () => {
        const buffer = utils.getBuffer();
        baNpdu.encode(buffer, 1);
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 2,
            funct: 1,
            destination: undefined,
            source: undefined,
            hopCount: 0,
            networkMsgType: 0,
            vendorId: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a NPDU package with destination', () => {
        const buffer = utils.getBuffer();
        const destination = { net: 1000, adr: [1, 2, 3] };
        baNpdu.encode(buffer, 1, destination, undefined, 11, 5, 7);
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 9,
            funct: 33,
            destination: { type: 0, net: 1000, adr: [1, 2, 3] },
            source: undefined,
            hopCount: 11,
            networkMsgType: 0,
            vendorId: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a NPDU package with destination and source', () => {
        const buffer = utils.getBuffer();
        const destination = { net: 1000, adr: [1, 2, 3] };
        const source = { net: 1000, adr: [1, 2, 3] };
        baNpdu.encode(buffer, 1, destination, source, 13, 10, 11);
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 15,
            funct: 41,
            destination: { type: 0, net: 1000, adr: [1, 2, 3] },
            source: { type: 0, net: 1000, adr: [1, 2, 3] },
            hopCount: 13,
            networkMsgType: 0,
            vendorId: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a NPDU package with broadcast destination and source', () => {
        const buffer = utils.getBuffer();
        const destination = { net: 65535 };
        const source = { net: 1000 };
        baNpdu.encode(buffer, 1, destination, source, 12, 8, 9);
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 9,
            funct: 41,
            destination: { type: 0, net: 65535 },
            source: { type: 0, net: 1000 },
            hopCount: 12,
            networkMsgType: 0,
            vendorId: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a network layer NPDU package', () => {
        const buffer = utils.getBuffer();
        baNpdu.encode(buffer, 128, undefined, undefined, 1, 128, 7777);
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 5,
            funct: 128,
            destination: undefined,
            source: undefined,
            hopCount: 0,
            networkMsgType: 128,
            vendorId: 7777,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a who is router to network layer NPDU package', () => {
        const buffer = utils.getBuffer();
        baNpdu.encode(buffer, 128, undefined, undefined, 1, 0, 7777);
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 5,
            funct: 128,
            destination: undefined,
            source: undefined,
            hopCount: 0,
            networkMsgType: 0,
            vendorId: 0,
        });
    });
    (0, node_test_1.default)('should fail if invalid BACNET version', () => {
        const buffer = utils.getBuffer();
        baNpdu.encode(buffer, 12, undefined, undefined, 1, 2, 3);
        buffer.buffer[0] = 2;
        const result = baNpdu.decode(buffer.buffer, 0);
        node_assert_1.default.strictEqual(result, undefined);
    });
});
//# sourceMappingURL=npdu.spec.js.map