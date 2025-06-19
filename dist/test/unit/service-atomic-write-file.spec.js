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
node_test_1.default.describe('bacnet - Services layer AtomicWriteFile unit', () => {
    (0, node_test_1.default)('should successfully encode and decode as stream', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicWriteFile.encode(buffer, true, { type: 12, instance: 51 }, 5, [
            [12, 12],
        ]);
        const result = services_1.AtomicWriteFile.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 12, instance: 51 },
            isStream: true,
            position: 5,
            blocks: [[12, 12]],
        });
    });
    (0, node_test_1.default)('should successfully encode and decode as non-stream', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicWriteFile.encode(buffer, false, { type: 12, instance: 88 }, 10, [
            [12, 12],
            [12, 12],
        ]);
        const result = services_1.AtomicWriteFile.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 12, instance: 88 },
            isStream: false,
            position: 10,
            blocks: [
                [12, 12],
                [12, 12],
            ],
        });
    });
});
node_test_1.default.describe('AtomicWriteFileAcknowledge', () => {
    (0, node_test_1.default)('should successfully encode and decode streamed file', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicWriteFile.encodeAcknowledge(buffer, true, -10);
        const result = services_1.AtomicWriteFile.decodeAcknowledge(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            isStream: true,
            position: -10,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode non-streamed file', () => {
        const buffer = utils.getBuffer();
        services_1.AtomicWriteFile.encodeAcknowledge(buffer, false, 10);
        const result = services_1.AtomicWriteFile.decodeAcknowledge(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            isStream: false,
            position: 10,
        });
    });
});
//# sourceMappingURL=service-atomic-write-file.spec.js.map