export class Deferred<T> {
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
