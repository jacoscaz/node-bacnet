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
node_test_1.default.describe('bacnet - Services layer AlarmAcknowledge unit', () => {
    (0, node_test_1.default)('should successfully encode and decode with time timestamp', () => {
        const buffer = utils.getBuffer();
        const eventTime = new Date(1, 1, 1);
        eventTime.setMilliseconds(990);
        const ackTime = new Date(1, 1, 1);
        ackTime.setMilliseconds(880);
        services_1.AlarmAcknowledge.encode(buffer, 57, { type: 0, instance: 33 }, 5, 'Alarm Acknowledge Test', { value: eventTime, type: src_1.TimeStamp.TIME }, { value: ackTime, type: src_1.TimeStamp.TIME });
        const result = services_1.AlarmAcknowledge.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            acknowledgedProcessId: 57,
            eventObjectId: {
                type: 0,
                instance: 33,
            },
            eventStateAcknowledged: 5,
            acknowledgeSource: 'Alarm Acknowledge Test',
            eventTimeStamp: eventTime,
            acknowledgeTimeStamp: ackTime,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode with sequence timestamp', () => {
        const buffer = utils.getBuffer();
        const eventTime = 5;
        const ackTime = 6;
        services_1.AlarmAcknowledge.encode(buffer, 57, { type: 0, instance: 33 }, 5, 'Alarm Acknowledge Test', { value: eventTime, type: src_1.TimeStamp.SEQUENCE_NUMBER }, { value: ackTime, type: src_1.TimeStamp.SEQUENCE_NUMBER });
        const result = services_1.AlarmAcknowledge.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            acknowledgedProcessId: 57,
            eventObjectId: {
                type: 0,
                instance: 33,
            },
            eventStateAcknowledged: 5,
            acknowledgeSource: 'Alarm Acknowledge Test',
            eventTimeStamp: eventTime,
            acknowledgeTimeStamp: ackTime,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode with datetime timestamp', () => {
        const buffer = utils.getBuffer();
        const eventTime = new Date(1, 1, 1);
        eventTime.setMilliseconds(990);
        const ackTime = new Date(1, 1, 2);
        ackTime.setMilliseconds(880);
        services_1.AlarmAcknowledge.encode(buffer, 57, { type: 0, instance: 33 }, 5, 'Alarm Acknowledge Test', { value: eventTime, type: src_1.TimeStamp.DATETIME }, { value: ackTime, type: src_1.TimeStamp.DATETIME });
        const result = services_1.AlarmAcknowledge.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            acknowledgedProcessId: 57,
            eventObjectId: {
                type: 0,
                instance: 33,
            },
            eventStateAcknowledged: 5,
            acknowledgeSource: 'Alarm Acknowledge Test',
            eventTimeStamp: eventTime,
            acknowledgeTimeStamp: ackTime,
        });
    });
});
//# sourceMappingURL=service-alarm-acknowledge.spec.js.map