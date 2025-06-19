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
function removeLen(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map((item) => removeLen(item));
    }
    const newObj = { ...obj };
    delete newObj.len;
    for (const key in newObj) {
        newObj[key] = removeLen(newObj[key]);
    }
    return newObj;
}
node_test_1.default.describe('bacnet - Services layer ReadPropertyMultiple unit', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadPropertyMultiple.encode(buffer, [
            {
                objectId: { type: 51, instance: 1 },
                properties: [
                    { id: 85, index: 0xffffffff },
                    { id: 85, index: 4 },
                ],
            },
        ]);
        const result = services_1.ReadPropertyMultiple.decode(buffer.buffer, 0, buffer.offset);
        const cleanResult = removeLen(result);
        node_assert_1.default.deepStrictEqual(cleanResult, {
            properties: [
                {
                    objectId: { type: 51, instance: 1 },
                    properties: [
                        { id: 85, index: 0xffffffff },
                        { id: 85, index: 4 },
                    ],
                },
            ],
        });
    });
});
node_test_1.default.describe('ReadPropertyMultipleAcknowledge', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date(1, 1, 1);
        const time = new Date(1, 1, 1);
        time.setMilliseconds(990);
        services_1.ReadPropertyMultiple.encodeAcknowledge(buffer, [
            {
                objectId: { type: 9, instance: 50000 },
                values: [
                    {
                        property: { id: 81, index: 0xffffffff },
                        value: [
                            { type: 0 },
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
                            { type: 4, value: 0.1 },
                            { type: 5, value: 100.121212 },
                            { type: 6, value: [1, 2, 100, 200] },
                            { type: 7, value: 'Test1234$' },
                            { type: 8, value: { bitsUsed: 0, value: [] } },
                            {
                                type: 8,
                                value: {
                                    bitsUsed: 24,
                                    value: [0xaa, 0xaa, 0xaa],
                                },
                            },
                            { type: 9, value: 4 },
                            { type: 10, value: date },
                            { type: 11, value: time },
                            { type: 12, value: { type: 3, instance: 0 } },
                        ],
                    },
                ],
            },
        ]);
        const result = services_1.ReadPropertyMultiple.decodeAcknowledge(buffer.buffer, 0, buffer.offset);
        const cleanResult = removeLen(result);
        const modifiedResult = JSON.parse(JSON.stringify(cleanResult));
        modifiedResult.values[0].values[0].value[12].value = 0;
        modifiedResult.values[0].values[0].value[19].value =
            '1901-01-31T23:00:00.000Z';
        modifiedResult.values[0].values[0].value[20].value =
            '1901-01-31T23:00:00.990Z';
        node_assert_1.default.deepStrictEqual(modifiedResult, {
            values: [
                {
                    objectId: {
                        type: 9,
                        instance: 50000,
                    },
                    values: [
                        {
                            index: 4294967295,
                            id: 81,
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
                                { type: 6, value: [1, 2, 100, 200] },
                                { type: 7, value: 'Test1234$', encoding: 0 },
                                { type: 8, value: { bitsUsed: 0, value: [] } },
                                {
                                    type: 8,
                                    value: {
                                        bitsUsed: 24,
                                        value: [0xaa, 0xaa, 0xaa],
                                    },
                                },
                                { type: 9, value: 4 },
                                { type: 10, value: '1901-01-31T23:00:00.000Z' },
                                { type: 11, value: '1901-01-31T23:00:00.990Z' },
                                { type: 12, value: { type: 3, instance: 0 } },
                            ],
                        },
                    ],
                },
            ],
        });
    });
    (0, node_test_1.default)('should successfully encode and decode an error', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadPropertyMultiple.encodeAcknowledge(buffer, [
            {
                objectId: { type: 9, instance: 50000 },
                values: [
                    {
                        property: { id: 81, index: 0xffffffff },
                        value: [
                            {
                                type: 0,
                                value: {
                                    type: 'BacnetError',
                                    errorClass: 12,
                                    errorCode: 13,
                                },
                            },
                        ],
                    },
                ],
            },
        ]);
        const result = services_1.ReadPropertyMultiple.decodeAcknowledge(buffer.buffer, 0, buffer.offset);
        const cleanResult = removeLen(result);
        node_assert_1.default.deepStrictEqual(cleanResult, {
            values: [
                {
                    objectId: {
                        type: 9,
                        instance: 50000,
                    },
                    values: [
                        {
                            index: 4294967295,
                            id: 81,
                            value: [
                                {
                                    type: 105,
                                    value: {
                                        errorClass: 12,
                                        errorCode: 13,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});
//# sourceMappingURL=service-read-property-multiple.spec.js.map