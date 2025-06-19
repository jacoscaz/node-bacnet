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
const src_1 = require("../../src");
const services_1 = require("../../src/lib/services");
node_test_1.default.describe('bacnet - Services layer EventNotifyData unit', () => {
    (0, node_test_1.default)('should successfully encode and decode a change of bitstring event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: { type: 60, instance: 12 },
            eventObjectId: { type: 61, instance: 1121 },
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 0,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: true,
            fromState: 5,
            toState: 6,
            changeOfBitstringReferencedBitString: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
            changeOfBitstringStatusFlags: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 60, instance: 12 },
            eventObjectId: { type: 61, instance: 1121 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 0,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: true,
            fromState: 5,
            toState: 6,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a change of state event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 1,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 1,
            toState: 2,
            changeOfStateNewState: { type: 2, state: 2 },
            changeOfStateStatusFlags: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 1,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 1,
            toState: 2,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a change of value event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 2,
            messageText: 'Test1234$',
            notifyType: 1,
            changeOfValueTag: src_1.CovType.REAL,
            changeOfValueChangeValue: 90,
            changeOfValueStatusFlags: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 2,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 0,
            toState: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a floating limit event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 4,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: true,
            fromState: 19,
            toState: 12,
            floatingLimitReferenceValue: 121,
            floatingLimitStatusFlags: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
            floatingLimitSetPointValue: 120,
            floatingLimitErrorLimit: 120,
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 4,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: true,
            fromState: 19,
            toState: 12,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode an out of range event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 5,
            messageText: 'Test1234$',
            notifyType: 1,
            outOfRangeExceedingValue: 155,
            outOfRangeStatusFlags: { bitsUsed: 24, value: [0xaa, 0xaa, 0xaa] },
            outOfRangeDeadband: 50,
            outOfRangeExceededLimit: 150,
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 5,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 0,
            toState: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a change of life-safety event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 8,
            messageText: 'Test1234$',
            notifyType: 1,
            changeOfLifeSafetyNewState: 8,
            changeOfLifeSafetyNewMode: 9,
            changeOfLifeSafetyStatusFlags: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
            changeOfLifeSafetyOperationExpected: 2,
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 8,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 0,
            toState: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a buffer ready event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 10,
            messageText: 'Test1234$',
            notifyType: 1,
            bufferReadyBufferProperty: {
                objectId: { type: 65, instance: 2 },
                id: 85,
                arrayIndex: 3,
                deviceIndentifier: { type: 8, instance: 443 },
            },
            bufferReadyPreviousNotification: 121,
            bufferReadyCurrentNotification: 281,
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 10,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 0,
            toState: 0,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode a unsigned range event', (t) => {
        const buffer = utils.getBuffer();
        const date = new Date();
        date.setMilliseconds(880);
        services_1.EventNotifyData.encode(buffer, {
            processId: 3,
            initiatingObjectId: {},
            eventObjectId: {},
            timeStamp: { type: 2, value: date },
            notificationClass: 9,
            priority: 7,
            eventType: 11,
            messageText: 'Test1234$',
            notifyType: 1,
            unsignedRangeExceedingValue: 101,
            unsignedRangeStatusFlags: {
                bitsUsed: 24,
                value: [0xaa, 0xaa, 0xaa],
            },
            unsignedRangeExceededLimit: 100,
        });
        const result = services_1.EventNotifyData.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            processId: 3,
            initiatingObjectId: { type: 0, instance: 0 },
            eventObjectId: { type: 0, instance: 0 },
            timeStamp: date,
            notificationClass: 9,
            priority: 7,
            eventType: 11,
            messageText: 'Test1234$',
            notifyType: 1,
            ackRequired: false,
            fromState: 0,
            toState: 0,
        });
    });
});
//# sourceMappingURL=service-event-notify-data.spec.js.map