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
		type: "datetime",
	})
	createdAt: Date

	@UpdateDateColumn({
		type: "datetime",
	})
	updatedAt: Date

	kind: string = "applications.application"

	etag: string = undefined

	@AfterLoad()
	@AfterInsert()
	@AfterUpdate()
	@AfterRemove()
	AfterAll() {
		// Generating E-Tag
		this.etag = etag(JSON.stringify(this))
	}

	@BeforeInsert()
	BeforeInsert() {
		// Client ID
		this.clientId = md5([Date.now(), Math.floor(10000 + Math.random() * 89998)].join(":"))
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
