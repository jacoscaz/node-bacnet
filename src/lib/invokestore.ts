import debugLib from 'debug'

import { type NetworkOpResult } from './types'
import { Deferred } from './utils'

const debug = debugLib('bacnet:client:debug')
const trace = debugLib('bacnet:client:trace')

export class InvokeStore {
	#entries: Map<
		number,
		{ deferred: Deferred<NetworkOpResult>; createdAt: number }
	>
	#timeout: number
	#clearTimeout: NodeJS.Timeout | null

	constructor(timeout: number) {
		this.#entries = new Map()
		this.#timeout = timeout
		this.#clearTimeout = null
	}

	add(id: number): Promise<NetworkOpResult> {
		const deferred = new Deferred<NetworkOpResult>()
		this.#entries.set(id, { deferred, createdAt: Date.now() })
		this.#scheduleClear()
		trace(
			`InvokeId ${id} callback added -> timeout set to ${this.#timeout}.`, // Stack: ${new Error().stack}`,
		)
		return deferred.promise.finally(() => {
			debug(`InvokeId ${id} deferred called`)
			this.#entries.delete(id)
		})
	}

	resolve(id: number, err: Error, result?: undefined): void
	resolve(id: number, err: null | undefined, result: NetworkOpResult): void
	resolve(
		id: number,
		err: Error | null | undefined,
		result?: NetworkOpResult,
	) {
		const entry = this.#entries.get(id)
		if (entry) {
			trace(`InvokeId ${id} found -> call callback`)
			this.#entries.delete(id)
			if (err) {
				entry.deferred.reject(err)
			} else {
				entry.deferred.resolve(result)
			}
		} else {
			debug('InvokeId', id, 'not found -> drop package')
			trace(`Stored invokeId: ${Array.from(this.#entries.keys())}`)
		}
	}

	#clear = () => {
		this.#clearTimeout = null
		const now = Date.now()
		this.#entries.forEach(({ deferred, createdAt }, id) => {
			if (now - createdAt > this.#timeout) {
				deferred.reject(new Error('ERR_TIMEOUT'))
				this.#entries.delete(id)
			}
		})
		if (this.#entries.size > 0) {
			this.#scheduleClear()
		}
	}

	#scheduleClear() {
		if (this.#clearTimeout === null) {
			this.#clearTimeout = setTimeout(this.#clear, this.#timeout)
		}
	}
}
