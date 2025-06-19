import { EncodeBuffer, BACNetAppData, WritePropertyRequest } from '../types';
import { BacnetService } from './AbstractServices';
export default class WriteProperty extends BacnetService {
    static encode(buffer: EncodeBuffer, objectType: number, objectInstance: number, propertyId: number, arrayIndex: number, priority: number, values: BACNetAppData[]): void;
    static decode(buffer: Buffer, offset: number, apduLen: number): WritePropertyRequest | undefined;
}
