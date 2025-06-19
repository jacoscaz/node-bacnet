import { BACnetClientEvents, TypedEventEmitter } from './EventTypes';
import { AddressParameter, BACNetObjectID, BACNetPropertyID, BACNetAppData, BACNetTimestamp, ClientOptions, WhoIsOptions, ServiceOptions, ReadPropertyOptions, WritePropertyOptions, ErrorCallback, DataCallback, DecodeAcknowledgeSingleResult, DecodeAcknowledgeMultipleResult, BACNetReadAccessSpecification, DeviceCommunicationOptions, ReinitializeDeviceOptions, EncodeBuffer, BACNetEventInformation, BACNetReadAccess, BACNetAlarm, BACNetBitString, PropertyReference, TypedValue, WritePropertyMultipleObject, DecodeAtomicWriteFileResult, DecodeAtomicReadFileResult } from './types';
export default class BACnetClient extends TypedEventEmitter<BACnetClientEvents> {
    private _settings;
    private _transport;
    private _invokeCounter;
    private _invokeStore;
    private _lastSequenceNumber;
    private _segmentStore;
    constructor(options?: ClientOptions);
    private _getInvokeId;
    private _invokeCallback;
    private _addCallback;
    private _getBuffer;
    private _processError;
    private _processAbort;
    private _segmentAckResponse;
    private _performDefaultSegmentHandling;
    private _processSegment;
    private _processServiceRequest;
    private _handlePdu;
    private _handleNpdu;
    private _receiveData;
    private _receiveError;
    whoIs(receiver?: {
        address?: string;
        forwardedFrom?: string;
        lowLimit?: number;
        highLimit?: number;
    } | string, options?: WhoIsOptions): void;
    timeSync(receiver: AddressParameter, dateTime: Date): void;
    timeSyncUTC(receiver: AddressParameter, dateTime: Date): void;
    readProperty(address: string, objectId: BACNetObjectID, propertyId: number, callback: DataCallback<DecodeAcknowledgeSingleResult>): void;
    readProperty(address: string, objectId: BACNetObjectID, propertyId: number, options: ReadPropertyOptions, callback: DataCallback<DecodeAcknowledgeSingleResult>): void;
    writeProperty(address: string, objectId: BACNetObjectID, propertyId: number, values: BACNetAppData[], options: WritePropertyOptions, callback: ErrorCallback): void;
    readPropertyMultiple(address: string, propertiesArray: BACNetReadAccessSpecification[], callback: DataCallback<DecodeAcknowledgeMultipleResult>): void;
    readPropertyMultiple(address: string, propertiesArray: BACNetReadAccessSpecification[], options: ServiceOptions, callback: DataCallback<DecodeAcknowledgeMultipleResult>): void;
    writePropertyMultiple(address: string, values: WritePropertyMultipleObject[], callback: ErrorCallback): void;
    writePropertyMultiple(address: string, values: WritePropertyMultipleObject[], options: ServiceOptions, callback: ErrorCallback): void;
    confirmedCOVNotification(receiver: AddressParameter, monitoredObject: BACNetObjectID, subscribeId: number, initiatingDeviceId: number, lifetime: number, values: Array<{
        property: PropertyReference;
        value: TypedValue[];
    }>, options: ServiceOptions | ErrorCallback, next?: ErrorCallback): void;
    deviceCommunicationControl(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, timeDuration: number, enableDisable: number, options: DeviceCommunicationOptions | ErrorCallback, next?: ErrorCallback): void;
    reinitializeDevice(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, state: number, options: ReinitializeDeviceOptions | ErrorCallback, next?: ErrorCallback): void;
    writeFile(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, position: number, fileBuffer: number[][], options: ServiceOptions | DataCallback<DecodeAtomicWriteFileResult>, next?: DataCallback<DecodeAtomicWriteFileResult>): void;
    readFile(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, position: number, count: number, options: ServiceOptions | DataCallback<DecodeAtomicReadFileResult>, next?: DataCallback<DecodeAtomicReadFileResult>): void;
    readRange(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, idxBegin: number, quantity: number, options: ServiceOptions | DataCallback<any>, next?: DataCallback<any>): void;
    subscribeCov(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, subscribeId: number, cancel: boolean, issueConfirmedNotifications: boolean, lifetime: number, options: ServiceOptions, next?: ErrorCallback): void;
    subscribeProperty(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, monitoredProperty: BACNetPropertyID, subscribeId: number, cancel: boolean, issueConfirmedNotifications: boolean, options: ServiceOptions, next?: ErrorCallback): void;
    unconfirmedCOVNotification(receiver: string | {
        address: string;
    }, subscriberProcessId: number, initiatingDeviceId: number, monitoredObjectId: BACNetObjectID, timeRemaining: number, values: Array<{
        property: {
            id: number;
            index?: number;
        };
        value: BACNetAppData[];
    }>): void;
    createObject(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, values: Array<{
        property: {
            id: number;
            index?: number;
        };
        value: BACNetAppData[];
    }>, options: ServiceOptions, next?: ErrorCallback): void;
    deleteObject(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, options: ServiceOptions, next?: ErrorCallback): void;
    removeListElement(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, reference: {
        id: number;
        index: number;
    }, values: BACNetAppData[], options: ServiceOptions, next?: ErrorCallback): void;
    addListElement(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, reference: {
        id: number;
        index: number;
    }, values: BACNetAppData[], options: ServiceOptions, next?: ErrorCallback): void;
    getAlarmSummary(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, options: ServiceOptions | DataCallback<BACNetAlarm[]>, next?: DataCallback<BACNetAlarm[]>): void;
    getEventInformation(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, options: ServiceOptions | DataCallback<BACNetEventInformation[]>, next?: DataCallback<BACNetEventInformation[]>): void;
    acknowledgeAlarm(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, objectId: BACNetObjectID, eventState: number, ackText: string, evTimeStamp: BACNetTimestamp, ackTimeStamp: BACNetTimestamp, options: ServiceOptions | ErrorCallback, next?: ErrorCallback): void;
    confirmedPrivateTransfer(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, vendorId: number, serviceNumber: number, data: any, options: ServiceOptions | ErrorCallback, next?: ErrorCallback): void;
    unconfirmedPrivateTransfer(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, vendorId: number, serviceNumber: number, data: any): void;
    getEnrollmentSummary(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, acknowledgmentFilter: number, options: (ServiceOptions & {
        enrollmentFilter?: any;
        eventStateFilter?: any;
        eventTypeFilter?: any;
        priorityFilter?: any;
        notificationClassFilter?: any;
    }) | DataCallback<any>, next?: DataCallback<any>): void;
    unconfirmedEventNotification(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, eventNotification: any): void;
    confirmedEventNotification(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, eventNotification: any, options: ServiceOptions | ErrorCallback, next?: ErrorCallback): void;
    readPropertyResponse(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, invokeId: number, objectId: BACNetObjectID, property: BACNetPropertyID, value: BACNetAppData[] | BACNetAppData, options?: {
        forwardedFrom?: string;
    }): void;
    readPropertyMultipleResponse(receiver: string | {
        address: string;
        forwardedFrom?: string;
    }, invokeId: number, values: BACNetReadAccess[]): void;
    iAmResponse(receiver: {
        address?: string;
        forwardedFrom?: string;
    } | null, deviceId: number, segmentation: number, vendorId: number): void;
    iHaveResponse(receiver: {
        address?: string;
        forwardedFrom?: string;
    } | null, deviceId: BACNetObjectID, objectId: BACNetObjectID, objectName: string): void;
    simpleAckResponse(receiver: {
        address?: string;
        forwardedFrom?: string;
    } | string, service: number, invokeId: number): void;
    errorResponse(receiver: {
        address?: string;
        forwardedFrom?: string;
    } | string, service: number, invokeId: number, errorClass: number, errorCode: number): void;
    sendBvlc(receiver: {
        address?: string;
        forwardedFrom?: string;
    } | string | null, buffer: EncodeBuffer): void;
    resultResponse(receiver: {
        address: string;
    }, resultCode: number): void;
    close(): void;
    static createBitstring(items: number[]): BACNetBitString;
}
