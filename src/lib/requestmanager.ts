import assert from 'node:assert'
import debugLib from 'debug'

import { type NetworkOpResult } from './types'

const debug = debugLib('bacnet:client:requestmanager:debug')
const trace = debugLib('bacnet:client:requestmanager:trace')

class Deferred<T> {
	resolve!: (value: T) => void
	reject!: (err: Error) => void
	promise: Promise<T>
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
	}
}

interface RequestEntry {
	invokeId: number
	deferred: Deferred<NetworkOpResult>
	expiresAt: number
}

/**
 * In order to keep O(n) operations outside of hot code paths, the values
 * within the `#invokeIds` array are only guaranteed to match the keys of
 * the `#entries` index right after each call to `clear()`. At any other
 * time, the `#invokeIds` array may contain ids of requests that have already
 * been expired or resolved.
 */
export class RequestManager {
	/** Index of pending requests by invokeId */
	#requestsById: Map<number, RequestEntry>

	/** Array of requests ordered by creation time */
	#requestsByTime: RequestEntry[]

	#timeout: number
	#clearTimeout: NodeJS.Timeout | null

	constructor(timeout: number) {
		this.#requestsById = new Map()
		this.#requestsByTime = []
		this.#timeout = timeout
		this.#clearTimeout = null
	}

	add(invokeId: number): Promise<NetworkOpResult> {
		const deferred = new Deferred<NetworkOpResult>()
		const request = {
			invokeId,
			deferred,
			expiresAt: Date.now() + this.#timeout,
		}
		this.#requestsById.set(invokeId, request)
		this.#requestsByTime.push(request)
		this.#scheduleClear()
		trace(
			`InvokeId ${invokeId} callback added -> timeout set to ${this.#timeout}.`, // Stack: ${new Error().stack}`,
		)
		return deferred.promise.finally(() => {
			debug(`InvokeId ${invokeId} deferred called`)
			this.#requestsById.delete(invokeId)
		})
	}

	resolve(id: number, err: Error, result?: undefined): void
	resolve(id: number, err: null | undefined, result: NetworkOpResult): void
	resolve(
		id: number,
		err: Error | null | undefined,
		result?: NetworkOpResult,
	) {
		const request = this.#requestsById.get(id)
		if (request) {
			trace(`InvokeId ${id} found -> call callback`)
			this.#requestsById.delete(id)
			if (err) {
				request.deferred.reject(err)
			} else {
				request.deferred.resolve(result)
			}
		} else {
			debug('InvokeId', id, 'not found -> drop package')
			trace(`Stored invokeId: ${Array.from(this.#requestsById.keys())}`)
		}
	}

	clear = (force?: boolean) => {
		if (this.#clearTimeout !== null) {
			clearTimeout(this.#clearTimeout)
			this.#clearTimeout = null
		}
		const now = Date.now()
		const qty = this.#requestsByTime.length
		// filter() is usually faster than splice() for small-ish arrays
		this.#requestsByTime = this.#requestsByTime.filter((request) => {
			if (!this.#requestsById.has(request.invokeId)) {
				// Request has already been resolved or expired
				return false
			}
			if (force || request.expiresAt <= now) {
				// Request has timed out or we forcefully time it out
				request.deferred.reject(new Error('ERR_TIMEOUT'))
				this.#requestsById.delete(request.invokeId)
				return false
			}
			// Request is still pending
			return true
		})
		assert(
			this.#requestsById.size === this.#requestsByTime.length,
			`Index size mismatch  ${this.#requestsById.size} !== ${this.#requestsByTime.length}`,
		)
		debug(`Cleared ${qty - this.#requestsByTime.length} entries.`)
		debug(`There are ${this.#requestsByTime.length} entries pending.`)
		if (!force) {
			this.#scheduleClear()
		}
	}

	#scheduleClear() {
		if (this.#clearTimeout === null && this.#requestsByTime.length > 0) {
			// setTimeout() effectively becomes like setImmediate() if the delay value is 0 or negative
			this.#clearTimeout = setTimeout(
				this.clear,
				// We add 100 milliseconds to ensure that we can never schedule more than
				// 10 timeouts per second even in worst-case bursts scenarios
				this.#requestsByTime[0].expiresAt - Date.now() + 100,
			)
		}
	}
}
