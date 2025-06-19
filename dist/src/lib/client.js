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
const EventTypes_1 = require("./EventTypes");
const debug_1 = __importDefault(require("debug"));
const transport_1 = __importDefault(require("./transport"));
const services_1 = __importStar(require("./services"));
const baAsn1 = __importStar(require("./asn1"));
const baApdu = __importStar(require("./apdu"));
const baNpdu = __importStar(require("./npdu"));
const baBvlc = __importStar(require("./bvlc"));
const util_1 = require("util");
const enum_1 = require("./enum");
const debug = (0, debug_1.default)('bacnet:client:debug');
const trace = (0, debug_1.default)('bacnet:client:trace');
const ALL_INTERFACES = '0.0.0.0';
const LOCALHOST_INTERFACES_IPV4 = '127.0.0.1';
const BROADCAST_ADDRESS = '255.255.255.255';
const DEFAULT_HOP_COUNT = 0xff;
const BVLC_HEADER_LENGTH = 4;
const BVLC_FWD_HEADER_LENGTH = 10;
const beU = enum_1.UnconfirmedServiceChoice;
const unconfirmedServiceMap = {
    [beU.I_AM]: 'iAm',
    [beU.WHO_IS]: 'whoIs',
    [beU.WHO_HAS]: 'whoHas',
    [beU.UNCONFIRMED_COV_NOTIFICATION]: 'covNotifyUnconfirmed',
    [beU.TIME_SYNCHRONIZATION]: 'timeSync',
    [beU.UTC_TIME_SYNCHRONIZATION]: 'timeSyncUTC',
    [beU.UNCONFIRMED_EVENT_NOTIFICATION]: 'eventNotify',
    [beU.I_HAVE]: 'iHave',
    [beU.UNCONFIRMED_PRIVATE_TRANSFER]: 'privateTransfer',
};
const beC = enum_1.ConfirmedServiceChoice;
const confirmedServiceMap = {
    [beC.READ_PROPERTY]: 'readProperty',
    [beC.WRITE_PROPERTY]: 'writeProperty',
    [beC.READ_PROPERTY_MULTIPLE]: 'readPropertyMultiple',
    [beC.WRITE_PROPERTY_MULTIPLE]: 'writePropertyMultiple',
    [beC.CONFIRMED_COV_NOTIFICATION]: 'covNotify',
    [beC.ATOMIC_WRITE_FILE]: 'atomicWriteFile',
    [beC.ATOMIC_READ_FILE]: 'atomicReadFile',
    [beC.SUBSCRIBE_COV]: 'subscribeCov',
    [beC.SUBSCRIBE_COV_PROPERTY]: 'subscribeProperty',
    [beC.DEVICE_COMMUNICATION_CONTROL]: 'deviceCommunicationControl',
    [beC.REINITIALIZE_DEVICE]: 'reinitializeDevice',
    [beC.CONFIRMED_EVENT_NOTIFICATION]: 'eventNotify',
    [beC.READ_RANGE]: 'readRange',
    [beC.CREATE_OBJECT]: 'createObject',
    [beC.DELETE_OBJECT]: 'deleteObject',
    [beC.ACKNOWLEDGE_ALARM]: 'alarmAcknowledge',
    [beC.GET_ALARM_SUMMARY]: 'getAlarmSummary',
    [beC.GET_ENROLLMENT_SUMMARY]: 'getEnrollmentSummary',
    [beC.GET_EVENT_INFORMATION]: 'getEventInformation',
    [beC.LIFE_SAFETY_OPERATION]: 'lifeSafetyOperation',
    [beC.ADD_LIST_ELEMENT]: 'addListElement',
    [beC.REMOVE_LIST_ELEMENT]: 'removeListElement',
    [beC.CONFIRMED_PRIVATE_TRANSFER]: 'privateTransfer',
};
class BACnetClient extends EventTypes_1.TypedEventEmitter {
    _settings;
    _transport;
    _invokeCounter = 1;
    _invokeStore = {};
    _lastSequenceNumber = 0;
    _segmentStore = [];
    constructor(options) {
        super();
        options = options || {};
        this._settings = {
            port: options.port || 47808,
            interface: options.interface || ALL_INTERFACES,
            transport: options.transport,
            broadcastAddress: options.broadcastAddress || BROADCAST_ADDRESS,
            apduTimeout: options.apduTimeout || 3000,
        };
        options.reuseAddr =
            options.reuseAddr === undefined ? true : !!options.reuseAddr;
        this._transport =
            this._settings.transport ||
                new transport_1.default({
                    port: this._settings.port,
                    interface: this._settings.interface,
                    broadcastAddress: this._settings.broadcastAddress,
                    reuseAddr: options.reuseAddr,
                });
        this._transport.on('message', this._receiveData.bind(this));
        this._transport.on('error', this._receiveError.bind(this));
        this._transport.on('listening', () => this.emit('listening'));
        this._transport.open();
    }
    _getInvokeId() {
        const id = this._invokeCounter++;
        if (id >= 256)
            this._invokeCounter = 1;
        return id - 1;
    }
    _invokeCallback(id, err, result) {
        const callback = this._invokeStore[id];
        if (callback) {
            trace(`InvokeId ${id} found -> call callback`);
            return void callback(err, result);
        }
        debug('InvokeId', id, 'not found -> drop package');
        trace(`Stored invokeId: ${Object.keys(this._invokeStore)}`);
    }
    _addCallback(id, callback) {
        const toCall = (err, data) => {
            delete this._invokeStore[id];
            clearTimeout(timeout);
            if (err) {
                debug(`InvokeId ${id} callback called with error:`, err);
            }
            else {
                trace(`InvokeId ${id} callback called with data:`, data);
            }
            callback(err, data);
        };
        const timeout = setTimeout(toCall.bind(this, new Error('ERR_TIMEOUT')), this._settings.apduTimeout);
        this._invokeStore[id] = toCall;
        trace(`InvokeId ${id} callback added -> timeout set to ${this._settings.apduTimeout}.`);
    }
    _getBuffer(isForwarded) {
        return Object.assign({}, {
            buffer: Buffer.alloc(this._transport.getMaxPayload()),
            offset: isForwarded
                ? BVLC_FWD_HEADER_LENGTH
                : BVLC_HEADER_LENGTH,
        });
    }
    _processError(invokeId, buffer, offset, length) {
        const result = services_1.ErrorService.decode(buffer, offset);
        if (!result)
            return debug('Couldn`t decode Error');
        this._invokeCallback(invokeId, new Error(`BacnetError - Class:${result.class} - Code:${result.code}`));
    }
    _processAbort(invokeId, reason) {
        this._invokeCallback(invokeId, new Error(`BacnetAbort - Reason:${reason}`));
    }
    _segmentAckResponse(receiver, negative, server, originalInvokeId, sequencenumber, actualWindowSize) {
        const receiverObj = typeof receiver === 'string' ? { address: receiver } : receiver;
        const buffer = this._getBuffer(receiverObj && receiverObj.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver, null, DEFAULT_HOP_COUNT, enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK, 0);
        baApdu.encodeSegmentAck(buffer, enum_1.PduType.SEGMENT_ACK |
            (negative ? enum_1.PduSegAckBit.NEGATIVE_ACK : 0) |
            (server ? enum_1.PduSegAckBit.SERVER : 0), originalInvokeId, sequencenumber, actualWindowSize);
        baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.ORIGINAL_UNICAST_NPDU, buffer.offset);
        this._transport.send(buffer.buffer, buffer.offset, typeof receiver === 'string' ? receiver : receiver.address);
    }
    _performDefaultSegmentHandling(msg, first, moreFollows, buffer, offset, length) {
        if (first) {
            this._segmentStore = [];
            msg.type &= ~enum_1.PduConReqBit.SEGMENTED_MESSAGE;
            let apduHeaderLen = 3;
            if ((msg.type & enum_1.PDU_TYPE_MASK) === enum_1.PduType.CONFIRMED_REQUEST) {
                apduHeaderLen = 4;
            }
            const apdubuffer = this._getBuffer();
            apdubuffer.offset = 0;
            buffer.copy(apdubuffer.buffer, apduHeaderLen, offset, offset + length);
            if ((msg.type & enum_1.PDU_TYPE_MASK) === enum_1.PduType.CONFIRMED_REQUEST) {
                const confirmedMsg = msg;
                baApdu.encodeConfirmedServiceRequest(apdubuffer, msg.type, confirmedMsg.service, confirmedMsg.maxSegments, confirmedMsg.maxApdu, confirmedMsg.invokeId, 0, 0);
            }
            else {
                const complexMsg = msg;
                baApdu.encodeComplexAck(apdubuffer, msg.type, complexMsg.service, complexMsg.invokeId, 0, 0);
            }
            this._segmentStore.push(apdubuffer.buffer.slice(0, length + apduHeaderLen));
        }
        else {
            this._segmentStore.push(buffer.slice(offset, offset + length));
        }
        if (!moreFollows) {
            const apduBuffer = Buffer.concat(this._segmentStore);
            this._segmentStore = [];
            msg.type &= ~enum_1.PduConReqBit.SEGMENTED_MESSAGE;
            this._handlePdu(apduBuffer, 0, apduBuffer.length, msg.header);
        }
    }
    _processSegment(msg, server, buffer, offset, length) {
        let first = false;
        if (msg.sequencenumber === 0 && this._lastSequenceNumber === 0) {
            first = true;
        }
        else {
            if (msg.sequencenumber !== this._lastSequenceNumber + 1) {
                return this._segmentAckResponse(msg.header.sender.address, true, server, msg.invokeId, this._lastSequenceNumber, msg.proposedWindowNumber);
            }
        }
        this._lastSequenceNumber = msg.sequencenumber;
        const moreFollows = !!(msg.type & enum_1.PduConReqBit.MORE_FOLLOWS);
        if (!moreFollows) {
            this._lastSequenceNumber = 0;
        }
        if (msg.sequencenumber % msg.proposedWindowNumber === 0 ||
            !moreFollows) {
            this._segmentAckResponse(msg.header.sender.address, false, server, msg.invokeId, msg.sequencenumber, msg.proposedWindowNumber);
        }
        this._performDefaultSegmentHandling(msg, first, moreFollows, buffer, offset, length);
    }
    _processServiceRequest(serviceMap, content, buffer, offset, length) {
        const sender = content.header?.sender;
        if (sender?.address === LOCALHOST_INTERFACES_IPV4) {
            debug('Received and skipped localhost service request:', content.service);
            return;
        }
        const name = serviceMap[content.service];
        if (!name) {
            debug('Received unsupported service request:', content.service);
            return;
        }
        const confirmedMsg = content;
        const id = confirmedMsg.invokeId
            ? `with invokeId ${confirmedMsg.invokeId}`
            : '';
        trace(`Received service request${id}:`, name);
        const serviceHandler = services_1.default[name];
        if (serviceHandler) {
            try {
                content.payload = serviceHandler.decode(buffer, offset, length);
                trace(`Handled service request${id}:`, name, JSON.stringify(content));
            }
            catch (e) {
                debug('Exception thrown when processing message:', e);
                debug('Original message was', `${name}:`, content);
                return;
            }
            if (!content.payload) {
                return debug('Received invalid', name, 'message');
            }
        }
        else {
            debug('No serviceHandler defined for:', name);
        }
        if (this.listenerCount(name)) {
            trace(`listener count by name emits ${name} with content. ${(0, util_1.format)('%o', content)}`);
            this.emit(name, content);
        }
        else {
            if (this.listenerCount('unhandledEvent')) {
                trace('unhandled event emitting with content');
                this.emit(name, content);
            }
            else {
                trace(`no unhandled event "${name}" handler with header: ${JSON.stringify(content.header)}`);
                if (content.header?.expectingReply) {
                    debug('Replying with error for unhandled service:', name);
                    if (content.header.sender) {
                        content.header.sender.forwardedFrom = null;
                    }
                    this.errorResponse(content.header.sender, content.service, confirmedMsg.invokeId, enum_1.ErrorClass.SERVICES, enum_1.ErrorCode.REJECT_UNRECOGNIZED_SERVICE);
                }
            }
        }
    }
    _handlePdu(buffer, offset, length, header) {
        let msg;
        trace('handlePdu Header: ', header);
        switch (header.apduType & enum_1.PDU_TYPE_MASK) {
            case enum_1.PduType.UNCONFIRMED_REQUEST:
                msg = baApdu.decodeUnconfirmedServiceRequest(buffer, offset);
                msg.header = header;
                msg.header.confirmedService = false;
                this._processServiceRequest(unconfirmedServiceMap, msg, buffer, offset + msg.len, length - msg.len);
                break;
            case enum_1.PduType.SIMPLE_ACK:
                msg = baApdu.decodeSimpleAck(buffer, offset);
                offset += msg.len;
                length -= msg.len;
                this._invokeCallback(msg.invokeId, null, {
                    msg,
                    buffer,
                    offset: offset + msg.len,
                    length: length - msg.len,
                });
                break;
            case enum_1.PduType.COMPLEX_ACK:
                msg = baApdu.decodeComplexAck(buffer, offset);
                msg.header = header;
                if ((header.apduType & enum_1.PduConReqBit.SEGMENTED_MESSAGE) === 0) {
                    this._invokeCallback(msg.invokeId, null, {
                        msg,
                        buffer,
                        offset: offset + msg.len,
                        length: length - msg.len,
                    });
                }
                else {
                    this._processSegment(msg, true, buffer, offset + msg.len, length - msg.len);
                }
                break;
            case enum_1.PduType.SEGMENT_ACK:
                msg = baApdu.decodeSegmentAck(buffer, offset);
                msg.header = header;
                this._processSegment(msg, true, buffer, offset + msg.len, length - msg.len);
                break;
            case enum_1.PduType.ERROR:
                msg = baApdu.decodeError(buffer, offset);
                this._processError(msg.invokeId, buffer, offset + msg.len, length - msg.len);
                break;
            case enum_1.PduType.REJECT:
            case enum_1.PduType.ABORT:
                msg = baApdu.decodeAbort(buffer, offset);
                this._processAbort(msg.invokeId, msg.reason);
                break;
            case enum_1.PduType.CONFIRMED_REQUEST:
                msg = baApdu.decodeConfirmedServiceRequest(buffer, offset);
                msg.header = header;
                msg.header.confirmedService = true;
                if ((header.apduType & enum_1.PduConReqBit.SEGMENTED_MESSAGE) === 0) {
                    this._processServiceRequest(confirmedServiceMap, msg, buffer, offset + msg.len, length - msg.len);
                }
                else {
                    this._processSegment(msg, true, buffer, offset + msg.len, length - msg.len);
                }
                break;
            default:
                debug(`Received unknown PDU type ${header.apduType} -> Drop packet`);
                break;
        }
    }
    _handleNpdu(buffer, offset, msgLength, header) {
        if (msgLength <= 0) {
            return trace('No NPDU data -> Drop package');
        }
        const result = baNpdu.decode(buffer, offset);
        if (!result) {
            return trace('Received invalid NPDU header -> Drop package');
        }
        if (result.funct & enum_1.NpduControlBit.NETWORK_LAYER_MESSAGE) {
            return trace('Received network layer message -> Drop package');
        }
        offset += result.len;
        msgLength -= result.len;
        if (msgLength <= 0) {
            return trace('No APDU data -> Drop package');
        }
        header.apduType = baApdu.getDecodedType(buffer, offset);
        header.expectingReply = !!(result.funct & enum_1.NpduControlBit.EXPECTING_REPLY);
        this._handlePdu(buffer, offset, msgLength, header);
    }
    _receiveData(buffer, remoteAddress) {
        if (buffer.length < BVLC_HEADER_LENGTH) {
            return trace('Received invalid data -> Drop package');
        }
        const result = baBvlc.decode(buffer, 0);
        if (!result) {
            return trace('Received invalid BVLC header -> Drop package');
        }
        const header = {
            func: result.func,
            sender: {
                address: remoteAddress,
                forwardedFrom: null,
            },
            apduType: 0,
            expectingReply: false,
        };
        switch (result.func) {
            case enum_1.BvlcResultPurpose.ORIGINAL_UNICAST_NPDU:
            case enum_1.BvlcResultPurpose.ORIGINAL_BROADCAST_NPDU:
                this._handleNpdu(buffer, result.len, buffer.length - result.len, header);
                break;
            case enum_1.BvlcResultPurpose.FORWARDED_NPDU:
                header.sender.forwardedFrom = result.originatingIP;
                this._handleNpdu(buffer, result.len, buffer.length - result.len, header);
                break;
            case enum_1.BvlcResultPurpose.REGISTER_FOREIGN_DEVICE:
                const decodeResult = services_1.RegisterForeignDevice.decode(buffer, result.len, buffer.length - result.len);
                if (!decodeResult) {
                    return trace('Received invalid registerForeignDevice message');
                }
                this.emit('registerForeignDevice', {
                    header,
                    payload: decodeResult,
                });
                break;
            case enum_1.BvlcResultPurpose.DISTRIBUTE_BROADCAST_TO_NETWORK:
                this._handleNpdu(buffer, result.len, buffer.length - result.len, header);
                break;
            default:
                debug(`Received unknown BVLC function ${result.func} -> Drop package`);
                break;
        }
    }
    _receiveError(err) {
        this.emit('error', err);
    }
    whoIs(receiver, options) {
        if (!options) {
            if (receiver &&
                typeof receiver === 'object' &&
                receiver.address === undefined &&
                receiver.forwardedFrom === undefined &&
                (receiver.lowLimit !== undefined ||
                    receiver.highLimit !== undefined)) {
                options = receiver;
                receiver = undefined;
            }
        }
        options = options || {};
        const settings = {
            lowLimit: options.lowLimit,
            highLimit: options.highLimit,
        };
        const buffer = this._getBuffer(receiver && typeof receiver === 'object'
            ? receiver.forwardedFrom
            : undefined);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver, null, DEFAULT_HOP_COUNT, enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK, 0);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.WHO_IS);
        services_1.WhoIs.encode(buffer, settings.lowLimit, settings.highLimit);
        this.sendBvlc(receiver, buffer);
    }
    timeSync(receiver, dateTime) {
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string' && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.TIME_SYNCHRONIZATION);
        services_1.TimeSync.encode(buffer, dateTime);
        this.sendBvlc(receiver, buffer);
    }
    timeSyncUTC(receiver, dateTime) {
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string' && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.UTC_TIME_SYNCHRONIZATION);
        services_1.TimeSync.encode(buffer, dateTime);
        this.sendBvlc(receiver, buffer);
    }
    readProperty(receiver, objectId, propertyId, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId ||
                this._getInvokeId(),
            arrayIndex: options.arrayIndex !== undefined
                ? options.arrayIndex
                : enum_1.ASN1_ARRAY_ALL,
        };
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string' && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver, null, DEFAULT_HOP_COUNT, enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK, 0);
        const type = enum_1.PduType.CONFIRMED_REQUEST |
            (settings.maxSegments !== enum_1.MaxSegmentsAccepted.SEGMENTS_0
                ? enum_1.PduConReqBit.SEGMENTED_RESPONSE_ACCEPTED
                : 0);
        baApdu.encodeConfirmedServiceRequest(buffer, type, enum_1.ConfirmedServiceChoice.READ_PROPERTY, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.ReadProperty.encode(buffer, objectId.type, objectId.instance, propertyId, settings.arrayIndex);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.ReadProperty.decodeAcknowledge(data.buffer, data.offset, data.length);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            ;
            next(null, result);
        });
    }
    writeProperty(receiver, objectId, propertyId, values, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId ||
                this._getInvokeId(),
            arrayIndex: options.arrayIndex || enum_1.ASN1_ARRAY_ALL,
            priority: options.priority || enum_1.ASN1_NO_PRIORITY,
        };
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string' && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver, null, DEFAULT_HOP_COUNT, enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK, 0);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.WRITE_PROPERTY, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.WriteProperty.encode(buffer, objectId.type, objectId.instance, propertyId, settings.arrayIndex, settings.priority, values);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            ;
            next(err);
        });
    }
    readPropertyMultiple(receiver, propertiesArray, options, next) {
        next =
            next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver, null, DEFAULT_HOP_COUNT, enum_1.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK, 0);
        const type = enum_1.PduType.CONFIRMED_REQUEST |
            (settings.maxSegments !== enum_1.MaxSegmentsAccepted.SEGMENTS_0
                ? enum_1.PduConReqBit.SEGMENTED_RESPONSE_ACCEPTED
                : 0);
        baApdu.encodeConfirmedServiceRequest(buffer, type, enum_1.ConfirmedServiceChoice.READ_PROPERTY_MULTIPLE, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.ReadPropertyMultiple.encode(buffer, propertiesArray);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.ReadPropertyMultiple.decodeAcknowledge(data.buffer, data.offset, data.length);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result);
        });
    }
    writePropertyMultiple(receiver, values, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.WRITE_PROPERTY_MULTIPLE, settings.maxSegments, settings.maxApdu, settings.invokeId);
        services_1.WritePropertyMultiple.encodeObject(buffer, values);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            next(err);
        });
    }
    confirmedCOVNotification(receiver, monitoredObject, subscribeId, initiatingDeviceId, lifetime, values, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer();
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.CONFIRMED_COV_NOTIFICATION, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.CovNotify.encode(buffer, subscribeId, initiatingDeviceId, monitoredObject, lifetime, values);
        baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.ORIGINAL_UNICAST_NPDU, buffer.offset);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    deviceCommunicationControl(receiver, timeDuration, enableDisable, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId ||
                this._getInvokeId(),
            password: options.password,
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.DEVICE_COMMUNICATION_CONTROL, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.DeviceCommunicationControl.encode(buffer, timeDuration, enableDisable, settings.password);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            next(err);
        });
    }
    reinitializeDevice(receiver, state, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId ||
                this._getInvokeId(),
            password: options.password,
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.REINITIALIZE_DEVICE, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.ReinitializeDevice.encode(buffer, state, settings.password);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            next(err);
        });
    }
    writeFile(receiver, objectId, position, fileBuffer, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.ATOMIC_WRITE_FILE, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        const blocks = fileBuffer;
        services_1.AtomicWriteFile.encode(buffer, false, objectId, position, blocks);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.AtomicWriteFile.decodeAcknowledge(data.buffer, data.offset);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result);
        });
    }
    readFile(receiver, objectId, position, count, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.ATOMIC_READ_FILE, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.AtomicReadFile.encode(buffer, true, objectId, position, count);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.AtomicReadFile.decodeAcknowledge(data.buffer, data.offset);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result);
        });
    }
    readRange(receiver, objectId, idxBegin, quantity, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.READ_RANGE, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.ReadRange.encode(buffer, objectId, enum_1.PropertyIdentifier.LOG_BUFFER, enum_1.ASN1_ARRAY_ALL, enum_1.ReadRangeType.BY_POSITION, idxBegin, new Date(), quantity);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.ReadRange.decodeAcknowledge(data.buffer, data.offset, data.length);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result);
        });
    }
    subscribeCov(receiver, objectId, subscribeId, cancel, issueConfirmedNotifications, lifetime, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments || enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu || enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.SUBSCRIBE_COV, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.SubscribeCov.encode(buffer, subscribeId, objectId, cancel, issueConfirmedNotifications, lifetime);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    subscribeProperty(receiver, objectId, monitoredProperty, subscribeId, cancel, issueConfirmedNotifications, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments || enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu || enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.SUBSCRIBE_COV_PROPERTY, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.SubscribeProperty.encode(buffer, subscribeId, objectId, cancel, issueConfirmedNotifications, 0, monitoredProperty, false, 0x0f);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    unconfirmedCOVNotification(receiver, subscriberProcessId, initiatingDeviceId, monitoredObjectId, timeRemaining, values) {
        const buffer = this._getBuffer();
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.UNCONFIRMED_COV_NOTIFICATION);
        services_1.CovNotify.encode(buffer, subscriberProcessId, initiatingDeviceId, monitoredObjectId, timeRemaining, values);
        baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.ORIGINAL_UNICAST_NPDU, buffer.offset);
        this._transport.send(buffer.buffer, buffer.offset, (receiver && receiver.address) || null);
    }
    createObject(receiver, objectId, values, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments || enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu || enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.CREATE_OBJECT, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.CreateObject.encode(buffer, objectId, values);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    deleteObject(receiver, objectId, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments || enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu || enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.DELETE_OBJECT, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.DeleteObject.encode(buffer, objectId);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    removeListElement(receiver, objectId, reference, values, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments || enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu || enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.REMOVE_LIST_ELEMENT, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.AddListElement.encode(buffer, objectId, reference.id, reference.index, values);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    addListElement(receiver, objectId, reference, values, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments || enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu || enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.ADD_LIST_ELEMENT, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.AddListElement.encode(buffer, objectId, reference.id, reference.index, values);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    getAlarmSummary(receiver, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.GET_ALARM_SUMMARY, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.AlarmSummary.decode(data.buffer, data.offset, data.length);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result.alarms);
        });
    }
    getEventInformation(receiver, objectId, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.GET_EVENT_INFORMATION, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        baAsn1.encodeContextObjectId(buffer, 0, objectId.type, objectId.instance);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.EventInformation.decode(data.buffer, data.offset, data.length);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result.alarms);
        });
    }
    acknowledgeAlarm(receiver, objectId, eventState, ackText, evTimeStamp, ackTimeStamp, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.ACKNOWLEDGE_ALARM, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.AlarmAcknowledge.encode(buffer, 57, objectId, eventState, ackText, evTimeStamp, ackTimeStamp);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    confirmedPrivateTransfer(receiver, vendorId, serviceNumber, data, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.CONFIRMED_PRIVATE_TRANSFER, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.PrivateTransfer.encode(buffer, vendorId, serviceNumber, data);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    unconfirmedPrivateTransfer(receiver, vendorId, serviceNumber, data) {
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.UNCONFIRMED_PRIVATE_TRANSFER);
        services_1.PrivateTransfer.encode(buffer, vendorId, serviceNumber, data);
        this.sendBvlc(receiver, buffer);
    }
    getEnrollmentSummary(receiver, acknowledgmentFilter, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.GET_ENROLLMENT_SUMMARY, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.GetEnrollmentSummary.encode(buffer, acknowledgmentFilter, options.enrollmentFilter, options.eventStateFilter, options.eventTypeFilter, options.priorityFilter, options.notificationClassFilter);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            const result = services_1.GetEnrollmentSummary.decodeAcknowledge(data.buffer, data.offset, data.length);
            if (!result) {
                return void next(new Error('INVALID_DECODING'));
            }
            next(null, result);
        });
    }
    unconfirmedEventNotification(receiver, eventNotification) {
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.UNCONFIRMED_EVENT_NOTIFICATION);
        services_1.EventNotifyData.encode(buffer, eventNotification);
        this.sendBvlc(receiver, buffer);
    }
    confirmedEventNotification(receiver, eventNotification, options, next) {
        next = next || options;
        const settings = {
            maxSegments: options.maxSegments ||
                enum_1.MaxSegmentsAccepted.SEGMENTS_65,
            maxApdu: options.maxApdu ||
                enum_1.MaxApduLengthAccepted.OCTETS_1476,
            invokeId: options.invokeId || this._getInvokeId(),
        };
        const buffer = this._getBuffer(receiver && receiver.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE | enum_1.NpduControlBit.EXPECTING_REPLY, receiver);
        baApdu.encodeConfirmedServiceRequest(buffer, enum_1.PduType.CONFIRMED_REQUEST, enum_1.ConfirmedServiceChoice.CONFIRMED_EVENT_NOTIFICATION, settings.maxSegments, settings.maxApdu, settings.invokeId, 0, 0);
        services_1.EventNotifyData.encode(buffer, eventNotification);
        this.sendBvlc(receiver, buffer);
        this._addCallback(settings.invokeId, (err, data) => {
            if (err) {
                return void next(err);
            }
            next();
        });
    }
    readPropertyResponse(receiver, invokeId, objectId, property, value, options = {}) {
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string'
            ? receiver.forwardedFrom
            : undefined);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeComplexAck(buffer, enum_1.PduType.COMPLEX_ACK, enum_1.ConfirmedServiceChoice.READ_PROPERTY, invokeId);
        const valueArray = Array.isArray(value) ? value : [value];
        services_1.ReadProperty.encodeAcknowledge(buffer, objectId, property.id, property.index, valueArray);
        this.sendBvlc(receiver, buffer);
    }
    readPropertyMultipleResponse(receiver, invokeId, values) {
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string'
            ? receiver.forwardedFrom
            : undefined);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeComplexAck(buffer, enum_1.PduType.COMPLEX_ACK, enum_1.ConfirmedServiceChoice.READ_PROPERTY_MULTIPLE, invokeId);
        services_1.ReadPropertyMultiple.encodeAcknowledge(buffer, values);
        this.sendBvlc(receiver, buffer);
    }
    iAmResponse(receiver, deviceId, segmentation, vendorId) {
        const buffer = this._getBuffer(receiver?.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.I_AM);
        services_1.IAm.encode(buffer, deviceId, this._transport.getMaxPayload(), segmentation, vendorId);
        this.sendBvlc(receiver, buffer);
    }
    iHaveResponse(receiver, deviceId, objectId, objectName) {
        const buffer = this._getBuffer(receiver?.forwardedFrom);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeUnconfirmedServiceRequest(buffer, enum_1.PduType.UNCONFIRMED_REQUEST, enum_1.UnconfirmedServiceChoice.I_HAVE);
        services_1.IHave.encode(buffer, deviceId, objectId, objectName);
        this.sendBvlc(receiver, buffer);
    }
    simpleAckResponse(receiver, service, invokeId) {
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string'
            ? receiver.forwardedFrom
            : undefined);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeSimpleAck(buffer, enum_1.PduType.SIMPLE_ACK, service, invokeId);
        this.sendBvlc(receiver, buffer);
    }
    errorResponse(receiver, service, invokeId, errorClass, errorCode) {
        trace(`error response on ${JSON.stringify(receiver)} service: ${JSON.stringify(service)} invokeId: ${invokeId} errorClass: ${errorClass} errorCode: ${errorCode}`);
        trace(`error message ${services_1.ErrorService.buildMessage({ class: errorClass, code: errorCode })}`);
        const buffer = this._getBuffer(receiver && typeof receiver !== 'string'
            ? receiver.forwardedFrom
            : undefined);
        baNpdu.encode(buffer, enum_1.NpduControlPriority.NORMAL_MESSAGE, receiver);
        baApdu.encodeError(buffer, enum_1.PduType.ERROR, service, invokeId);
        services_1.ErrorService.encode(buffer, errorClass, errorCode);
        this.sendBvlc(receiver, buffer);
    }
    sendBvlc(receiver, buffer) {
        if (typeof receiver === 'string') {
            receiver = {
                address: receiver,
            };
        }
        if (receiver && receiver.forwardedFrom) {
            baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.FORWARDED_NPDU, buffer.offset, receiver.forwardedFrom);
        }
        else if (receiver && receiver.address) {
            baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.ORIGINAL_UNICAST_NPDU, buffer.offset);
        }
        else {
            baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.ORIGINAL_BROADCAST_NPDU, buffer.offset);
        }
        this._transport.send(buffer.buffer, buffer.offset, (receiver && receiver.address) || null);
    }
    resultResponse(receiver, resultCode) {
        const buffer = this._getBuffer();
        baApdu.encodeResult(buffer, resultCode);
        baBvlc.encode(buffer.buffer, enum_1.BvlcResultPurpose.BVLC_RESULT, buffer.offset);
        this._transport.send(buffer.buffer, buffer.offset, receiver.address);
    }
    close() {
        this._transport.close();
    }
    static createBitstring(items) {
        let offset = 0;
        const bytes = [];
        let bitsUsed = 0;
        while (items.length) {
            let value = 0;
            items = items.filter((i) => {
                if (i >= offset + 8) {
                    return true;
                }
                value |= 1 << (i - offset);
                bitsUsed = Math.max(bitsUsed, i);
                return false;
            });
            bytes.push(value);
            offset += 8;
        }
        bitsUsed++;
        return {
            value: bytes,
            bitsUsed,
        };
    }
}
exports.default = BACnetClient;
//# sourceMappingURL=client.js.map