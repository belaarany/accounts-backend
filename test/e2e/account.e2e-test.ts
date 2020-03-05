import { Server } from "~app/server"
import { App } from "~app/app"
import Axios from "axios"
import Faker from "faker"

describe("Accounts REST", () => {
	let port: number = 8426
	let app: App
	let server: Server | null

	let fakeAccount = {
		identifier: `e2e_${Date.now()}`,
		password: Faker.internet.password(),
		email: Faker.internet.email(),
		first_name: Faker.name.firstName(),
		last_name: Faker.name.lastName(),
	}
	let lastCreatedAccountId: string

	beforeAll(done => {
		app = new App()
		server = null

		app.bootstrap().then(() => {
			server = new Server(app)
			server.listen(port)
			done()
		})
	})

	afterAll(done => {
		server.shutdown().then(() => {
			done()
		})
	})

	test("Create an account", done => {
		Axios({
			url: `http://localhost:${port}/accounts`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: fakeAccount,
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(10)

			expect(data).toHaveProperty("id")
			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("etag")
			expect(data).toHaveProperty("name")
			expect(data).toHaveProperty("identifier")
			expect(data).toHaveProperty("email")
			expect(data).toHaveProperty("first_name")
			expect(data).toHaveProperty("last_name")
			expect(data).toHaveProperty("created_at")
			expect(data).toHaveProperty("updated_at")

			expect(data.kind).toStrictEqual("accounts.account")
			expect(data.identifier).toStrictEqual(fakeAccount.identifier)
			expect(data.email).toStrictEqual(fakeAccount.email)
			expect(data.first_name).toStrictEqual(fakeAccount.first_name)
			expect(data.last_name).toStrictEqual(fakeAccount.last_name)

			lastCreatedAccountId = data.id

			done()
		})
	})

	test("Fetch the previously created account", done => {
		Axios({
			url: `http://localhost:${port}/accounts/${lastCreatedAccountId}`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(10)

			expect(data).toHaveProperty("id")
			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("etag")
			expect(data).toHaveProperty("name")
			expect(data).toHaveProperty("identifier")
			expect(data).toHaveProperty("email")
			expect(data).toHaveProperty("first_name")
			expect(data).toHaveProperty("last_name")
			expect(data).toHaveProperty("created_at")
			expect(data).toHaveProperty("updated_at")

			expect(data.kind).toStrictEqual("accounts.account")
			expect(data.identifier).toStrictEqual(fakeAccount.identifier)
			expect(data.email).toStrictEqual(fakeAccount.email)
			expect(data.first_name).toStrictEqual(fakeAccount.first_name)
			expect(data.last_name).toStrictEqual(fakeAccount.last_name)

			done()
		})
	})

	test("Fetch all the accounts and find the previously created one", done => {
		Axios({
			url: `http://localhost:${port}/accounts`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(3)

			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("etag")
			expect(data).toHaveProperty("collection")

			expect(data.kind).toStrictEqual("accounts.accountList")

			let collection = data.collection

			expect(Array.isArray(collection)).toBeTruthy()
			expect(collection.length).toBeGreaterThanOrEqual(1)
			
			let account = collection.find(_account => _account.id === lastCreatedAccountId)

			expect(account).not.toEqual(undefined)
			expect(Object.keys(account)).toHaveLength(10)

			expect(account).toHaveProperty("id")
			expect(account).toHaveProperty("kind")
			expect(account).toHaveProperty("etag")
			expect(account).toHaveProperty("name")
			expect(account).toHaveProperty("identifier")
			expect(account).toHaveProperty("email")
			expect(account).toHaveProperty("first_name")
			expect(account).toHaveProperty("last_name")
			expect(account).toHaveProperty("created_at")
			expect(account).toHaveProperty("updated_at")

			expect(account.kind).toStrictEqual("accounts.account")
			expect(account.identifier).toStrictEqual(fakeAccount.identifier)
			expect(account.email).toStrictEqual(fakeAccount.email)
			expect(account.first_name).toStrictEqual(fakeAccount.first_name)
			expect(account.last_name).toStrictEqual(fakeAccount.last_name)

			done()
		})
	})
})
