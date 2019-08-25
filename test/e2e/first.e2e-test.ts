import { App } from "~app/app"

describe("My first test block", () => {
	beforeAll(() => {
		console.log("before all")
	})

	it("okay1", done => {
		console.log("test 1")
		done()
	})

	it("okay2", done => {
		console.log("test 2")
		done()
	})
})
