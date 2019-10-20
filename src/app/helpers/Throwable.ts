class Throwable {
	constructor() {
		Error.apply(this, arguments)
	}
}

Throwable.prototype = new Error()

export { Throwable }
