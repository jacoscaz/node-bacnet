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
const bacnetEnum = __importStar(require("../../src/lib/enum"));
node_test_1.default.describe('bacnet - ENUM tests', () => {
    (0, node_test_1.default)('enum get name of BOOLEAN should be defined with 1', () => {
        node_assert_1.default.strictEqual(bacnetEnum.getEnumName(bacnetEnum.ApplicationTag, 1, false), bacnetEnum.ApplicationTag[1]);
    });
    (0, node_test_1.default)('enum get name of BOOLEAN(1) should be defined with 1', () => {
        node_assert_1.default.strictEqual(bacnetEnum.getEnumName(bacnetEnum.ApplicationTag, 1), 'BOOLEAN(1)');
    });
    (0, node_test_1.default)('enum get undefined with -1', () => {
        node_assert_1.default.strictEqual(bacnetEnum.getEnumName(bacnetEnum.ApplicationTag, -1, false), '-1');
    });
});
//# sourceMappingURL=enum.spec.js.map