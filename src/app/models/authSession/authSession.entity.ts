import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove, UpdateDateColumn, CreateDateColumn } from "typeorm"
import { Step, StepEnum } from "@models/authSession/authSession.interface"

@Entity({
	name: "auth_sessions",
})
export class AuthSession {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({
		length: 100,
		nullable: true,
		default: null,
	})
	accountId: string

	@Column({
		type: "simple-json",
		nullable: true,
		default: null,
	})
	stepsCompleted: {
		[step in Step]?: string
	}

	@Column({
		length: 30,
		nullable: true,
		default: null,
	})
	flowType: null | "authorization_code"

	@Column({
		length: 100,
		nullable: true,
		default: null,
	})
	clientId: string

	@Column({
		type: "datetime",
		nullable: false,
	})
	validUntil: Date

	@Column({
		type: "datetime",
		nullable: true,
		default: null,
	})
	authenticatedAt: Date

	@CreateDateColumn({
		type: "datetime",
	})
	createdAt: Date

	@UpdateDateColumn({
		type: "datetime",
	})
	updatedAt: Date

	isAuthenticated: boolean = undefined

	@AfterLoad()
	@AfterInsert()
	@AfterUpdate()
	@AfterRemove()
	AfterAll() {
		// Is Authenticated
		this.isAuthenticated = this.authenticatedAt === undefined || this.authenticatedAt === null ? false : true
	}
}

export default AuthSession
