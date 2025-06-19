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
const services_1 = require("../../src/lib/services");
node_test_1.default.describe('bacnet - Services layer AtomicReadFile unit', () => {
    (0, node_test_1.default)('should successfully encode and decode as stream', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicReadFile.encode(buffer, true, { type: 13, instance: 5000 }, -50, 12);
        const result = services_1.AtomicReadFile.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 13, instance: 5000 },
            count: 12,
            isStream: true,
            position: -50,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode as non-stream', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicReadFile.encode(buffer, false, { type: 14, instance: 5001 }, 60, 13);
        const result = services_1.AtomicReadFile.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 14, instance: 5001 },
            count: 13,
            isStream: false,
            position: 60,
        });
    });
});
node_test_1.default.describe('AtomicReadFileAcknowledge', () => {
    (0, node_test_1.default)('should successfully encode and decode as stream', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicReadFile.encodeAcknowledge(buffer, true, false, 0, 90, [[12, 12, 12]], [3]);
        const result = services_1.AtomicReadFile.decodeAcknowledge(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            isStream: true,
            position: 0,
            endOfFile: false,
            buffer: Buffer.from([12, 12, 12]),
        });
    });
    (0, node_test_1.default)('should successfully encode and decode as non-stream', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicReadFile.encodeAcknowledge(buffer, false, false, 0, 90, [[12, 12, 12]], [3]);
        node_assert_1.default.throws(() => services_1.AtomicReadFile.decodeAcknowledge(buffer.buffer, 0), /NotImplemented/);
    });
});
//# sourceMappingURL=service-atomic-read-file.spec.js.map