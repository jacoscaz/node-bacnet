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
node_test_1.default.describe('bacnet - Services layer WriteProperty unit', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date(1, 1, 1);
        const time = new Date(1, 1, 1);
        time.setMilliseconds(990);
        services_1.WriteProperty.encode(buffer, 31, 12, 80, 0xffffffff, 0, [
            { type: 0, value: null },
            { type: 1, value: null },
            { type: 1, value: true },
            { type: 1, value: false },
            { type: 2, value: 1 },
            { type: 2, value: 1000 },
            { type: 2, value: 1000000 },
            { type: 2, value: 1000000000 },
            { type: 3, value: -1 },
            { type: 3, value: -1000 },
            { type: 3, value: -1000000 },
            { type: 3, value: -1000000000 },
            { type: 4, value: 0 },
            { type: 5, value: 100.121212 },
            { type: 7, value: 'Test1234$' },
            { type: 9, value: 4 },
            { type: 10, value: date },
            { type: 11, value: time },
            { type: 12, value: { type: 3, instance: 0 } },
        ]);
        const result = services_1.WriteProperty.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: {
                instance: 12,
                type: 31,
            },
            value: {
                priority: 16,
                property: {
                    index: 4294967295,
                    id: 80,
                },
                value: [
                    { type: 0, value: null },
                    { type: 0, value: null },
                    { type: 1, value: true },
                    { type: 1, value: false },
                    { type: 2, value: 1 },
                    { type: 2, value: 1000 },
                    { type: 2, value: 1000000 },
                    { type: 2, value: 1000000000 },
                    { type: 3, value: -1 },
                    { type: 3, value: -1000 },
                    { type: 3, value: -1000000 },
                    { type: 3, value: -1000000000 },
                    { type: 4, value: 0 },
                    { type: 5, value: 100.121212 },
                    { type: 7, value: 'Test1234$', encoding: 0 },
                    { type: 9, value: 4 },
                    { type: 10, value: date },
                    { type: 11, value: time },
                    { type: 12, value: { type: 3, instance: 0 } },
                ],
            },
        });
    });
    (0, node_test_1.default)('should successfully encode and decode with defined priority', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date(1, 1, 1);
        const time = new Date(1, 1, 1);
        time.setMilliseconds(990);
        services_1.WriteProperty.encode(buffer, 31, 12, 80, 0xffffffff, 8, [
            { type: 0, value: null },
            { type: 1, value: null },
            { type: 1, value: true },
            { type: 1, value: false },
            { type: 2, value: 1 },
            { type: 2, value: 1000 },
            { type: 2, value: 1000000 },
            { type: 2, value: 1000000000 },
            { type: 3, value: -1 },
            { type: 3, value: -1000 },
            { type: 3, value: -1000000 },
            { type: 3, value: -1000000000 },
            { type: 4, value: 0 },
            { type: 5, value: 100.121212 },
            { type: 7, value: 'Test1234$' },
            { type: 9, value: 4 },
            { type: 10, value: date },
            { type: 11, value: time },
            { type: 12, value: { type: 3, instance: 0 } },
        ]);
        const result = services_1.WriteProperty.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: {
                instance: 12,
                type: 31,
            },
            value: {
                priority: 8,
                property: {
                    index: 4294967295,
                    id: 80,
                },
                value: [
                    { type: 0, value: null },
                    { type: 0, value: null },
                    { type: 1, value: true },
                    { type: 1, value: false },
                    { type: 2, value: 1 },
                    { type: 2, value: 1000 },
                    { type: 2, value: 1000000 },
                    { type: 2, value: 1000000000 },
                    { type: 3, value: -1 },
                    { type: 3, value: -1000 },
                    { type: 3, value: -1000000 },
                    { type: 3, value: -1000000000 },
                    { type: 4, value: 0 },
                    { type: 5, value: 100.121212 },
                    { type: 7, value: 'Test1234$', encoding: 0 },
                    { type: 9, value: 4 },
                    { type: 10, value: date },
                    { type: 11, value: time },
                    { type: 12, value: { type: 3, instance: 0 } },
                ],
            },
        });
    });
    (0, node_test_1.default)('should successfully encode and decode with defined array index', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date(1, 1, 1);
        const time = new Date(1, 1, 1);
        time.setMilliseconds(990);
        services_1.WriteProperty.encode(buffer, 31, 12, 80, 2, 0, [
            { type: 0, value: null },
            { type: 0, value: null },
            { type: 1, value: true },
            { type: 1, value: false },
            { type: 2, value: 1 },
            { type: 2, value: 1000 },
            { type: 2, value: 1000000 },
            { type: 2, value: 1000000000 },
            { type: 3, value: -1 },
            { type: 3, value: -1000 },
            { type: 3, value: -1000000 },
            { type: 3, value: -1000000000 },
            { type: 4, value: 0 },
            { type: 5, value: 100.121212 },
            { type: 7, value: 'Test1234$', encoding: 0 },
            { type: 9, value: 4 },
            { type: 10, value: date },
            { type: 11, value: time },
            { type: 12, value: { type: 3, instance: 0 } },
        ]);
        const result = services_1.WriteProperty.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: {
                instance: 12,
                type: 31,
            },
            value: {
                priority: 16,
                property: {
                    index: 2,
                    id: 80,
                },
                value: [
                    { type: 0, value: null },
                    { type: 0, value: null },
                    { type: 1, value: true },
                    { type: 1, value: false },
                    { type: 2, value: 1 },
                    { type: 2, value: 1000 },
                    { type: 2, value: 1000000 },
                    { type: 2, value: 1000000000 },
                    { type: 3, value: -1 },
                    { type: 3, value: -1000 },
                    { type: 3, value: -1000000 },
                    { type: 3, value: -1000000000 },
                    { type: 4, value: 0 },
                    { type: 5, value: 100.121212 },
                    { type: 7, value: 'Test1234$', encoding: 0 },
                    { type: 9, value: 4 },
                    { type: 10, value: date },
                    { type: 11, value: time },
                    { type: 12, value: { type: 3, instance: 0 } },
                ],
            },
        });
    });
});
//# sourceMappingURL=service-write-property.spec.js.map