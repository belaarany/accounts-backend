import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	AfterLoad,
	AfterInsert,
	AfterUpdate,
	AfterRemove,
	UpdateDateColumn,
	CreateDateColumn,
	BeforeInsert,
} from "typeorm"
import md5 from "md5"
import etag from "etag"

@Entity({
	name: "applications",
})
export class Application {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({
		length: 300,
		nullable: false,
	})
	name: string

	@Column({
		length: 300,
		nullable: false,
	})
	clientId: string

	@Column({
		length: 100,
		nullable: false,
	})
	clientSecret: string

	@Column({
		length: 300,
		nullable: false,
	})
	homeUrl: string

	@Column({
		length: 300,
		nullable: false,
	})
	callbackUrl: string

	@CreateDateColumn({
		type: "timestamptz",
	})
	createdAt: Date

	@UpdateDateColumn({
		type: "timestamptz",
	})
	updatedAt: Date

	kind: string = "applications.application"

	etag: string = undefined

	@AfterLoad()
	@AfterInsert()
	@AfterUpdate()
	@AfterRemove()
	AfterAll() {}

	@BeforeInsert()
	BeforeInsert() {
		// Client ID
		this.clientId = md5(Date.now())

		// Generating E-Tag
		this.etag = etag(JSON.stringify(this))
	}

	getPartial(): ApplicationPartial {
		return {
			kind: "applications.application.partial",
			name: this.name,
			homeUrl: this.homeUrl,
			callbackUrl: this.callbackUrl,
		}
	}
}

export interface ApplicationPartial {
	kind: "applications.application.partial"
	name: string
	homeUrl: string
	callbackUrl: string
}

export default Application
