"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientListenerInterface = exports.apduTimeout = exports.index = exports.vendorId = exports.maxApdu = exports.deviceUnderTest = exports.bacnetClient = exports.trace = exports.debug = void 0;
const debug_1 = __importDefault(require("debug"));
const client_1 = __importDefault(require("../../src/lib/client"));
exports.debug = (0, debug_1.default)('bacnet:test:compliance:debug');
exports.trace = (0, debug_1.default)('bacnet:test:compliance:trace');
exports.bacnetClient = client_1.default;
exports.deviceUnderTest = 1234;
exports.maxApdu = 1482;
exports.vendorId = 260;
exports.index = 4294967295;
exports.apduTimeout = 3000;
exports.clientListenerInterface = '0.0.0.0';
//# sourceMappingURL=utils.js.map