import { type EnumType, type StatusFlags, type ObjectTypesSupported, type ServicesSupported } from './enum';
import { type BACNetBitString } from './types';
export type Bit = 1 | 0;
export declare abstract class AbstractBitString<E extends EnumType<E>> implements BACNetBitString {
    readonly bitsUsed: number;
    readonly value: Bit[];
    constructor(bitsUsed: number, trueBits: E[keyof E][]);
}
export declare class StatusFlagsBitString extends AbstractBitString<typeof StatusFlags> {
    constructor(...trueBits: StatusFlags[]);
}
export declare class ObjectTypesSupportedBitString extends AbstractBitString<typeof ObjectTypesSupported> {
    constructor(...trueBits: ObjectTypesSupported[]);
}
export declare class ServicesSupportedBitString extends AbstractBitString<typeof ServicesSupported> {
    constructor(...trueBits: ServicesSupported[]);
}
