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
node_test_1.default.describe('bacnet - Services layer SubscribeProperty unit', () => {
    (0, node_test_1.default)('should successfully encode and decode with cancellation request', (t) => {
        const buffer = utils.getBuffer();
        services_1.SubscribeProperty.encode(buffer, 7, { type: src_1.ObjectType.DEVICE, instance: 362 }, true, false, 1, { id: src_1.PropertyIdentifier.PRESENT_VALUE, index: 0xffffffff }, true, 1);
        const result = services_1.SubscribeProperty.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            cancellationRequest: true,
            covIncrement: 1,
            issueConfirmedNotifications: false,
            lifetime: 0,
            monitoredObjectId: {
                instance: 362,
                type: src_1.ObjectType.DEVICE,
            },
            monitoredProperty: {
                index: 4294967295,
                id: src_1.PropertyIdentifier.PRESENT_VALUE,
            },
            subscriberProcessId: 7,
        });
    });
    (0, node_test_1.default)('should successfully encode and decode without cancellation request', (t) => {
        const buffer = utils.getBuffer();
        services_1.SubscribeProperty.encode(buffer, 8, { type: src_1.ObjectType.DEVICE, instance: 363 }, false, true, 2, { id: src_1.PropertyIdentifier.PRIORITY, index: 3 }, false, 10);
        const result = services_1.SubscribeProperty.decode(buffer.buffer, 0);
        delete result.len;
        node_assert_1.default.deepStrictEqual(result, {
            cancellationRequest: false,
            covIncrement: 0,
            issueConfirmedNotifications: true,
            lifetime: 2,
            monitoredObjectId: {
                instance: 363,
                type: src_1.ObjectType.DEVICE,
            },
            monitoredProperty: {
                index: 3,
                id: src_1.PropertyIdentifier.PRIORITY,
            },
            subscriberProcessId: 8,
        });
    });
});
//# sourceMappingURL=service-subscribe-property.spec.js.map