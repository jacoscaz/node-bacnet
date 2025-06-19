import { EncodeBuffer } from '../types';
import { BacnetAckService } from './AbstractServices';
export default class GetEnrollmentSummary extends BacnetAckService {
    static encode(buffer: EncodeBuffer, acknowledgmentFilter: number, enrollmentFilter?: any, eventStateFilter?: number, eventTypeFilter?: number, priorityFilter?: any, notificationClassFilter?: number): void;
    static decode(buffer: Buffer, offset: number): any;
    static encodeAcknowledge(buffer: EncodeBuffer, enrollmentSummaries: any[]): void;
    static decodeAcknowledge(buffer: Buffer, offset: number, apduLen: number): {
        enrollmentSummaries: any[];
        len: number;
    };
}
