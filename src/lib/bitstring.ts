import {
	type EnumType,
	type StatusFlags,
	type ObjectTypesSupported,
	type ServicesSupported,
} from './enum'

import { type BACNetBitString } from './types'

/**
 * Represents a single bit value (0 or 1) in a BACnet bitstring
 */
export type Bit = 1 | 0

/**
 * Generic implementation of a BACnet bitstring
 *
 * This class provides a strongly-typed representation of BACnet bitstrings,
 * which are used to represent collections of boolean flags in BACnet properties.
 * The class is generic over an enum type that defines the bit positions.
 *
 * @typeParam E - An enum type that defines the bit positions
 */
export abstract class AbstractBitString<E extends EnumType<E>>
	implements BACNetBitString
{
	/**
	 * The number of bits in this bitstring
	 */
	readonly bitsUsed: number

	/**
	 * The array of bit values (0 or 1)
	 */
	readonly value: Bit[]

	/**
	 * Creates a new bitstring with the specified bits set to 1
	 *
	 * @param bitsUsed - The total number of bits in this bitstring
	 * @param trueBits - Array of enum values representing the positions of bits to set to 1
	 */
	constructor(bitsUsed: number, trueBits: E[keyof E][]) {
		this.bitsUsed = bitsUsed
		this.value = new Array(bitsUsed).fill(0)
		for (const index of trueBits) {
			if (typeof index === 'number') {
				this.value[index] = 1
			}
		}
	}
}

/**
 * Implementation of the StatusFlags bitstring
 *
 * The StatusFlags bitstring is a standard BACnet construct that indicates
 * the general status of a BACnet object. It contains four bits that provide
 * a summary of the object's alarm state, fault state, override state, and
 * out-of-service state.
 *
 * This implementation extends the generic BitString class with the
 * StatusFlagsBit enumeration.
 */
export class StatusFlagsBitString extends AbstractBitString<
	typeof StatusFlags
> {
	constructor(...trueBits: StatusFlags[]) {
		super(4, trueBits)
	}
}

/**
 * Implementation of the Protocol_Object_Types_Supported bitstring
 *
 * This bitstring represents the object types supported by a BACnet device,
 * as defined in the BACnet standard. It is used in the Protocol_Object_Types_Supported
 * property of the Device object.
 *
 * The BACnet standard defines a large number of possible object types. This implementation
 * allocates 112 bits to accommodate all standard object types, even though the current
 * highest-numbered object type is 59 (LIFT).
 */
export class ObjectTypesSupportedBitString extends AbstractBitString<
	typeof ObjectTypesSupported
> {
	constructor(...trueBits: ObjectTypesSupported[]) {
		super(112, trueBits)
	}
}

/**
 * Implementation of the Protocol_Services_Supported bitstring
 *
 * This bitstring represents the services supported by a BACnet device,
 * as defined in the BACnet standard. It is used in the Protocol_Services_Supported
 * property of the Device object.
 *
 * The BACnet standard defines a large number of possible services. This implementation
 * allocates 112 bits to accommodate all standard services, including those that might
 * be added in future versions of the standard.
 */
export class ServicesSupportedBitString extends AbstractBitString<
	typeof ServicesSupported
> {
	constructor(...trueBits: ServicesSupported[]) {
		super(112, trueBits)
	}
}
