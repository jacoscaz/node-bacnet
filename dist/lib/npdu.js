"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = exports.decodeFunction = void 0;
const enum_1 = require("./enum");
const BACNET_PROTOCOL_VERSION = 1;
const BACNET_ADDRESS_TYPES = {
    NONE: 0,
    IP: 1,
};
const decodeTarget = (buffer, offset) => {
    let len = 0;
    const target = {
        type: BACNET_ADDRESS_TYPES.NONE,
        net: (buffer[offset + len++] << 8) | (buffer[offset + len++] << 0),
    };
    const adrLen = buffer[offset + len++];
    if (adrLen > 0) {
        target.adr = [];
        for (let i = 0; i < adrLen; i++) {
            target.adr.push(buffer[offset + len++]);
        }
    }
    return {
        target,
        len,
    };
};
const encodeTarget = (buffer, target) => {
    buffer.buffer[buffer.offset++] = (target.net & 0xff00) >> 8;
    buffer.buffer[buffer.offset++] = (target.net & 0x00ff) >> 0;
    if (target.net === 0xffff || !target.adr) {
        buffer.buffer[buffer.offset++] = 0;
    }
    else {
        buffer.buffer[buffer.offset++] = target.adr.length;
        if (target.adr.length > 0) {
            for (let i = 0; i < target.adr.length; i++) {
                buffer.buffer[buffer.offset++] = target.adr[i];
            }
        }
    }
};
const decodeFunction = (buffer, offset) => {
    if (buffer[offset + 0] !== BACNET_PROTOCOL_VERSION)
        return undefined;
    return buffer[offset + 1];
};
exports.decodeFunction = decodeFunction;
const decode = (buffer, offset) => {
    const orgOffset = offset;
    offset++;
    const funct = buffer[offset++];
    let destination;
    if (funct & enum_1.NpduControlBit.DESTINATION_SPECIFIED) {
        const tmpDestination = decodeTarget(buffer, offset);
        offset += tmpDestination.len;
        destination = tmpDestination.target;
    }
    let source;
    if (funct & enum_1.NpduControlBit.SOURCE_SPECIFIED) {
        const tmpSource = decodeTarget(buffer, offset);
        offset += tmpSource.len;
        source = tmpSource.target;
    }
    let hopCount = 0;
    if (funct & enum_1.NpduControlBit.DESTINATION_SPECIFIED) {
        hopCount = buffer[offset++];
    }
    let networkMsgType = enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK;
    let vendorId = 0;
    if (funct & enum_1.NpduControlBit.NETWORK_LAYER_MESSAGE) {
        networkMsgType = buffer[offset++];
        if (networkMsgType >= 0x80) {
            vendorId = (buffer[offset++] << 8) | (buffer[offset++] << 0);
        }
        else if (networkMsgType === enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK) {
            offset += 2;
        }
    }
    if (buffer[orgOffset + 0] !== BACNET_PROTOCOL_VERSION)
        return undefined;
    return {
        len: offset - orgOffset,
        funct,
        destination,
        source,
        hopCount,
        networkMsgType,
        vendorId,
    };
};
exports.decode = decode;
const encode = (buffer, funct, destination, source, hopCount, networkMsgType, vendorId) => {
    const isDestinationAddress = destination && typeof destination !== 'string';
    const hasDestination = isDestinationAddress && destination.net > 0;
    const hasSource = source && source.net > 0 && source.net !== 0xffff;
    buffer.buffer[buffer.offset++] = BACNET_PROTOCOL_VERSION;
    buffer.buffer[buffer.offset++] =
        funct |
            (hasDestination ? enum_1.NpduControlBit.DESTINATION_SPECIFIED : 0) |
            (hasSource ? enum_1.NpduControlBit.SOURCE_SPECIFIED : 0);
    if (hasDestination) {
        encodeTarget(buffer, destination);
    }
    if (hasSource) {
        encodeTarget(buffer, source);
    }
    if (hasDestination) {
        buffer.buffer[buffer.offset++] = hopCount || 0;
    }
    if ((funct & enum_1.NpduControlBit.NETWORK_LAYER_MESSAGE) > 0) {
        buffer.buffer[buffer.offset++] = networkMsgType || 0;
        if ((networkMsgType || 0) >= 0x80) {
            buffer.buffer[buffer.offset++] = ((vendorId || 0) & 0xff00) >> 8;
            buffer.buffer[buffer.offset++] = ((vendorId || 0) & 0x00ff) >> 0;
        }
    }
};
exports.encode = encode;
//# sourceMappingURL=npdu.js.map