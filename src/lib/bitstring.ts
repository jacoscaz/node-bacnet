import {
	type EnumType,
	type StatusFlags,
	type ObjectTypesSupported,
	type ServicesSupported,
	ASN1_MAX_BITSTRING_BYTES,
} from './enum'

import { type BACNetBitString } from './types'

export const MAX_BITSTRING_BITS = ASN1_MAX_BITSTRING_BYTES * 8

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
	 * The array of byte values (0 - 255)
	 */
	readonly value: number[]

	/**
	 * Creates a new bitstring with the specified bits set to 1
	 *
	 * @param bitsUsed - The total number of bits in this bitstring
	 * @param trueBits - Array of enum values representing the positions of bits to set to 1
	 */
	constructor(bitsUsed: number, trueBits: E[keyof E][]) {
		if (bitsUsed > MAX_BITSTRING_BITS) {
			throw new Error(
				`Bitstring too large; a bitstring cannot exceed ${MAX_BITSTRING_BITS}`,
			)
		}
		this.bitsUsed = bitsUsed
		this.value = new Array(Math.ceil(bitsUsed / 8)).fill(0)
		for (const bitIndex of trueBits) {
			if (typeof bitIndex === 'number') {
				if (bitIndex >= bitsUsed) {
					throw new Error(
						`Bit index ${bitIndex} is out of range for a bitstring of length ${bitsUsed}`,
					)
				}
				this.value[Math.floor(bitIndex / 8)] |= 1 << bitIndex % 8
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
		super(80, trueBits)
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
		super(40, trueBits)
	}
}
