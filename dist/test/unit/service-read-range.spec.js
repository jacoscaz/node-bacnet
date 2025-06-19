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
const src_1 = require("../../src");
node_test_1.default.describe('bacnet - Services layer ReadRange unit', () => {
    (0, node_test_1.default)('should successfully encode and decode by position', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadRange.encode(buffer, { type: src_1.ObjectType.DEVICE, instance: 35 }, 85, 0xffffffff, src_1.ReadRangeType.BY_POSITION, 10, null, 0);
        const result = services_1.ReadRange.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            count: 0,
            objectId: { type: src_1.ObjectType.DEVICE, instance: 35 },
            position: 10,
            property: {
                index: 0xffffffff,
                id: 85,
            },
            requestType: src_1.ReadRangeType.BY_POSITION,
            time: undefined,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode by position with array index', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadRange.encode(buffer, { type: src_1.ObjectType.DEVICE, instance: 35 }, 12, 2, src_1.ReadRangeType.BY_SEQUENCE_NUMBER, 10, null, 0);
        const result = services_1.ReadRange.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            count: 0,
            objectId: { type: src_1.ObjectType.DEVICE, instance: 35 },
            position: 10,
            property: {
                index: 2,
                id: 12,
            },
            requestType: src_1.ReadRangeType.BY_SEQUENCE_NUMBER,
            time: undefined,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode by sequence', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadRange.encode(buffer, { type: src_1.ObjectType.DEVICE, instance: 35 }, 85, 0xffffffff, src_1.ReadRangeType.BY_SEQUENCE_NUMBER, 11, null, 1111);
        const result = services_1.ReadRange.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            count: 1111,
            objectId: { type: src_1.ObjectType.DEVICE, instance: 35 },
            position: 11,
            property: {
                index: 0xffffffff,
                id: 85,
            },
            requestType: src_1.ReadRangeType.BY_SEQUENCE_NUMBER,
            time: undefined,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode by time', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date(1, 1, 1);
        date.setMilliseconds(990);
        services_1.ReadRange.encode(buffer, { type: src_1.ObjectType.DEVICE, instance: 35 }, 85, 0xffffffff, src_1.ReadRangeType.BY_TIME_REFERENCE_TIME_COUNT, null, date, -1111);
        const result = services_1.ReadRange.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            count: -1111,
            objectId: { type: src_1.ObjectType.DEVICE, instance: 35 },
            position: undefined,
            property: {
                index: 0xffffffff,
                id: 85,
            },
            requestType: src_1.ReadRangeType.BY_TIME_REFERENCE_TIME_COUNT,
            time: date,
        });
    });
});
node_test_1.default.describe('ReadRangeAcknowledge', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        services_1.ReadRange.encodeAcknowledge(buffer, { type: 12, instance: 500 }, 5048, 0xffffffff, { bitsUsed: 24, value: [1, 2, 3] }, 12, Buffer.from([1, 2, 3]), 2, 2);
        const result = services_1.ReadRange.decodeAcknowledge(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            objectId: { type: 12, instance: 500 },
            itemCount: 12,
            property: { id: 5048, index: 0xffffffff },
            resultFlag: { bitsUsed: 24, value: [1, 2, 3] },
            rangeBuffer: Buffer.from([1, 2, 3]),
        });
    });
});
//# sourceMappingURL=service-read-range.spec.js.map