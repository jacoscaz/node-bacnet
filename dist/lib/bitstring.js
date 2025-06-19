"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesSupportedBitString = exports.ObjectTypesSupportedBitString = exports.StatusFlagsBitString = exports.AbstractBitString = void 0;
class AbstractBitString {
    bitsUsed;
    value;
    constructor(bitsUsed, trueBits) {
        this.bitsUsed = bitsUsed;
        this.value = new Array(bitsUsed).fill(0);
        for (const index of trueBits) {
            if (typeof index === 'number') {
                this.value[index] = 1;
            }
        }
    }
}
exports.AbstractBitString = AbstractBitString;
class StatusFlagsBitString extends AbstractBitString {
    constructor(...trueBits) {
        super(4, trueBits);
    }
}
exports.StatusFlagsBitString = StatusFlagsBitString;
class ObjectTypesSupportedBitString extends AbstractBitString {
    constructor(...trueBits) {
        super(112, trueBits);
    }
}
exports.ObjectTypesSupportedBitString = ObjectTypesSupportedBitString;
class ServicesSupportedBitString extends AbstractBitString {
    constructor(...trueBits) {
        super(112, trueBits);
    }
}
exports.ServicesSupportedBitString = ServicesSupportedBitString;
//# sourceMappingURL=bitstring.js.map