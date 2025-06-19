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
const baBvlc = __importStar(require("../../src/lib/bvlc"));
node_test_1.default.describe('bacnet - BVLC layer', () => {
    (0, node_test_1.default)('should successfuly encode and decode a package', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 10, 1482);
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 4,
            func: 10,
            msgLength: 1482,
            originatingIP: null,
        });
    });
    (0, node_test_1.default)('should successfuly encode and decode a forwarded package', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 4, 1482, '1.2.255.0');
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 10,
            func: 4,
            msgLength: 1482,
            originatingIP: '1.2.255.0',
        });
    });
    (0, node_test_1.default)('should successfuly encode and decode a forwarded package on a different port', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 4, 1482, '1.2.255.0:47810');
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.deepStrictEqual(result, {
            len: 10,
            func: 4,
            msgLength: 1482,
            originatingIP: '1.2.255.0:47810',
        });
    });
    (0, node_test_1.default)('should fail forwarding a non FORWARDED_NPU', () => {
        const buffer = utils.getBuffer();
        node_assert_1.default.throws(() => {
            baBvlc.encode(buffer.buffer, 3, 1482, '1.2.255.0');
        }, /Cannot specify originatingIP unless/);
    });
    (0, node_test_1.default)('should fail if invalid BVLC type', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 10, 1482);
        buffer.buffer[0] = 8;
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.strictEqual(result, undefined);
    });
    (0, node_test_1.default)('should fail if invalid length', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 10, 1481);
        buffer.buffer[0] = 8;
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.strictEqual(result, undefined);
    });
    (0, node_test_1.default)('should fail if invalid function', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 100, 1482);
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.strictEqual(result, undefined);
    });
    (0, node_test_1.default)('should fail if unsuported function', () => {
        const buffer = utils.getBuffer();
        baBvlc.encode(buffer.buffer, 99, 1482);
        const result = baBvlc.decode(buffer.buffer, 0);
        node_assert_1.default.strictEqual(result, undefined);
    });
});
//# sourceMappingURL=bvlc.spec.js.map