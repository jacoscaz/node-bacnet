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
Object.defineProperty(exports, "__esModule", { value: true });
const baAsn1 = __importStar(require("../asn1"));
const enum_1 = require("../enum");
const AbstractServices_1 = require("./AbstractServices");
class WriteProperty extends AbstractServices_1.BacnetService {
    static encode(buffer, objectType, objectInstance, propertyId, arrayIndex, priority, values) {
        baAsn1.encodeContextObjectId(buffer, 0, objectType, objectInstance);
        baAsn1.encodeContextEnumerated(buffer, 1, propertyId);
        if (arrayIndex !== enum_1.ASN1_ARRAY_ALL) {
            baAsn1.encodeContextUnsigned(buffer, 2, arrayIndex);
        }
        baAsn1.encodeOpeningTag(buffer, 3);
        values.forEach((value) => baAsn1.bacappEncodeApplicationData(buffer, value));
        baAsn1.encodeClosingTag(buffer, 3);
        if (priority !== enum_1.ASN1_NO_PRIORITY) {
            baAsn1.encodeContextUnsigned(buffer, 4, priority);
        }
    }
    static decode(buffer, offset, apduLen) {
        let len = 0;
        const value = {
            property: { id: 0, index: enum_1.ASN1_ARRAY_ALL },
        };
        let decodedValue;
        let result;
        if (!baAsn1.decodeIsContextTag(buffer, offset + len, 0))
            return undefined;
        len++;
        decodedValue = baAsn1.decodeObjectId(buffer, offset + len);
        const objectId = {
            type: decodedValue.objectType,
            instance: decodedValue.instance,
        };
        len += decodedValue.len;
        result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
        len += result.len;
        if (result.tagNumber !== 1)
            return undefined;
        decodedValue = baAsn1.decodeEnumerated(buffer, offset + len, result.value);
        len += decodedValue.len;
        value.property.id = decodedValue.value;
        result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
        if (result.tagNumber === 2) {
            len += result.len;
            decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
            len += decodedValue.len;
            value.property.index = decodedValue.value;
        }
        else {
            value.property.index = enum_1.ASN1_ARRAY_ALL;
        }
        if (!baAsn1.decodeIsOpeningTagNumber(buffer, offset + len, 3))
            return undefined;
        len++;
        const values = [];
        while (apduLen - len > 1 &&
            !baAsn1.decodeIsClosingTagNumber(buffer, offset + len, 3)) {
            decodedValue = baAsn1.bacappDecodeApplicationData(buffer, offset + len, apduLen + offset, objectId.type, value.property.id);
            if (!decodedValue)
                return undefined;
            len += decodedValue.len;
            delete decodedValue.len;
            values.push(decodedValue);
        }
        value.value = values;
        if (!baAsn1.decodeIsClosingTagNumber(buffer, offset + len, 3))
            return undefined;
        len++;
        value.priority = enum_1.ASN1_MAX_PRIORITY;
        if (len < apduLen) {
            result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
            if (result.tagNumber === 4) {
                len += result.len;
                decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
                len += decodedValue.len;
                if (decodedValue.value >= enum_1.ASN1_MIN_PRIORITY &&
                    decodedValue.value <= enum_1.ASN1_MAX_PRIORITY) {
                    value.priority = decodedValue.value;
                }
                else {
                    return undefined;
                }
            }
        }
        return {
            len,
            objectId,
            value: value,
        };
    }
}
exports.default = WriteProperty;
//# sourceMappingURL=WriteProperty.js.map