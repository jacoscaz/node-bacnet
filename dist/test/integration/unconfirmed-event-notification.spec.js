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
const utils = __importStar(require("./utils"));
node_test_1.default.describe('bacnet - unconfirmedEventNotification integration', () => {
    (0, node_test_1.default)('should correctly send a telegram', () => {
        const client = new utils.BacnetClient({ apduTimeout: 200 });
        const date = new Date();
        date.setMilliseconds(880);
        client.unconfirmedEventNotification('127.0.0.2', {
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
        client.close();
    });
});
//# sourceMappingURL=unconfirmed-event-notification.spec.js.map