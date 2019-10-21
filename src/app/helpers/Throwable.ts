class Throwable {
	constructor() {
		Error.apply(this, arguments)
	}
}

Throwable.prototype = new Error()

//const Throwable = Error

export { Throwable }
