import { EventEmitter } from 'events';
import BACnetClient from '../../src/lib/client';
export declare const BacnetClient: typeof BACnetClient;
export declare class TransportStub extends EventEmitter {
    constructor();
    getBroadcastAddress(): string;
    getMaxPayload(): number;
    send(): void;
    open(): void;
    close(): void;
}
export declare const propertyFormater: (object: any[]) => {
    [name: number]: any;
};
