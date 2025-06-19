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
node_test_1.default.describe('bacnet - Services layer ReadProperty unit', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadProperty.encode(buffer, 4, 630, 85, 0xffffffff);
        const result = services_1.ReadProperty.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 4, instance: 630 },
            property: { id: 85, index: 0xffffffff },
        });
    });
    (0, node_test_1.default)('should successfully encode and decode with object-type > 512', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadProperty.encode(buffer, 630, 5, 12, 0xffffffff);
        const result = services_1.ReadProperty.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 630, instance: 5 },
            property: { id: 12, index: 0xffffffff },
        });
    });
    (0, node_test_1.default)('should successfully encode and decode with array index', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadProperty.encode(buffer, 4, 630, 85, 2);
        const result = services_1.ReadProperty.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 4, instance: 630 },
            property: { id: 85, index: 2 },
        });
    });
});
node_test_1.default.describe('ReadPropertyAcknowledge', () => {
    (0, node_test_1.default)('should successfully encode and decode a boolean value', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadProperty.encodeAcknowledge(buffer, { type: 8, instance: 40000 }, 81, 0xffffffff, [
            { type: 1, value: true },
            { type: 1, value: false },
        ]);
        const result = services_1.ReadProperty.decodeAcknowledge(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: {
                type: 8,
                instance: 40000,
            },
            property: {
                index: 0xffffffff,
                id: 81,
            },
            values: [
                { type: 1, value: true },
                { type: 1, value: false },
            ],
        });
    });
    (0, node_test_1.default)('should successfully encode and decode an unsigned value', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadProperty.encodeAcknowledge(buffer, { type: 8, instance: 40000 }, 81, 0xffffffff, [
            { type: 2, value: 1 },
            { type: 2, value: 1000 },
            { type: 2, value: 1000000 },
            { type: 2, value: 1000000000 },
        ]);
        const result = services_1.ReadProperty.decodeAcknowledge(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: {
                type: 8,
                instance: 40000,
            },
            property: {
                index: 0xffffffff,
                id: 81,
            },
            values: [
                { type: 2, value: 1 },
                { type: 2, value: 1000 },
                { type: 2, value: 1000000 },
                { type: 2, value: 1000000000 },
            ],
        });
    });
});
//# sourceMappingURL=service-read-property.spec.js.map