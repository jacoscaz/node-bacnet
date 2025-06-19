import { EncodeBuffer } from '../types';
import { BacnetService } from './AbstractServices';
export default class EventNotifyData extends BacnetService {
    static encode(buffer: EncodeBuffer, data: any): void;
    static decode(buffer: Buffer, offset: number): any;
}
