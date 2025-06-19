"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyFormater = exports.TransportStub = exports.BacnetClient = void 0;
const events_1 = require("events");
const client_1 = __importDefault(require("../../src/lib/client"));
exports.BacnetClient = client_1.default;
class TransportStub extends events_1.EventEmitter {
    constructor() {
        super();
    }
    getBroadcastAddress() {
        return '255.255.255.255';
    }
    getMaxPayload() {
        return 1482;
    }
    send() { }
    open() { }
    close() { }
}
exports.TransportStub = TransportStub;
const propertyFormater = (object) => {
    const converted = {};
    object.forEach((property) => {
        if (property.value && Array.isArray(property.value)) {
            const cleanValues = property.value.map((value) => {
                if (value && typeof value === 'object' && 'len' in value) {
                    const { len, ...rest } = value;
                    return rest;
                }
                return value;
            });
            converted[property.id] = cleanValues;
        }
        else {
            converted[property.id] = property.value;
        }
    });
    return converted;
};
exports.propertyFormater = propertyFormater;
//# sourceMappingURL=utils.js.map