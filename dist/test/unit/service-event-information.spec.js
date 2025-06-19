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
node_test_1.default.describe('bacnet - Services layer EventInformation unit', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        const date1 = new Date();
        date1.setMilliseconds(990);
        const date2 = new Date();
        date2.setMilliseconds(990);
        const date3 = new Date();
        date3.setMilliseconds(990);
        services_1.EventInformation.encode(buffer, [
            {
                objectId: { type: 0, instance: 32 },
                eventState: src_1.EventState.NORMAL,
                acknowledgedTransitions: { value: [14], bitsUsed: 6 },
                eventTimeStamps: [date1, date2, date3],
                notifyType: src_1.NotifyType.EVENT,
                eventEnable: { value: [15], bitsUsed: 7 },
                eventPriorities: [2, 3, 4],
            },
        ], false);
        const result = services_1.EventInformation.decode(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            alarms: [
                {
                    objectId: {
                        type: 0,
                        instance: 32,
                    },
                    eventState: src_1.EventState.NORMAL,
                    acknowledgedTransitions: {
                        bitsUsed: 6,
                        value: [14],
                    },
                    eventTimeStamps: [date1, date2, date3],
                    notifyType: src_1.NotifyType.EVENT,
                    eventEnable: {
                        bitsUsed: 7,
                        value: [15],
                    },
                    eventPriorities: [2, 3, 4],
                },
            ],
            moreEvents: false,
        });
    });
});
//# sourceMappingURL=service-event-information.spec.js.map