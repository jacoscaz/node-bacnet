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
node_test_1.default.describe('bacnet - Services layer GetEnrollmentSummary unit', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        services_1.GetEnrollmentSummary.encode(buffer, 2);
        const result = services_1.GetEnrollmentSummary.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            acknowledgmentFilter: 2,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode full payload', (t) => {
        const buffer = utils.getBuffer();
        services_1.GetEnrollmentSummary.encode(buffer, 2, { objectId: { type: 5, instance: 33 }, processId: 7 }, 1, 3, { min: 1, max: 65 }, 5);
        const result = services_1.GetEnrollmentSummary.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            acknowledgmentFilter: 2,
            enrollmentFilter: {
                objectId: { type: 5, instance: 33 },
                processId: 7,
            },
            eventStateFilter: 1,
            eventTypeFilter: 3,
            priorityFilter: { min: 1, max: 65 },
            notificationClassFilter: 5,
        });
    });
});
node_test_1.default.describe('GetEnrollmentSummaryAcknowledge', () => {
    (0, node_test_1.default)('should successfully encode and decode', (t) => {
        const buffer = utils.getBuffer();
        services_1.GetEnrollmentSummary.encodeAcknowledge(buffer, [
            {
                objectId: { type: 12, instance: 120 },
                eventType: 3,
                eventState: 2,
                priority: 18,
                notificationClass: 11,
            },
        ]);
        const result = services_1.GetEnrollmentSummary.decodeAcknowledge(buffer.buffer, 0, buffer.offset);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            enrollmentSummaries: [
                {
                    objectId: { type: 12, instance: 120 },
                    eventType: 3,
                    eventState: 2,
                    priority: 18,
                    notificationClass: 11,
                },
            ],
        });
    });
});
//# sourceMappingURL=service-get-enrollment-summary.spec.js.map