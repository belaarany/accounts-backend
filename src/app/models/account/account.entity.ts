import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove } from "typeorm"
import etag from "etag"

@Entity()
export default class Account {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        length: 100,
        nullable: false,
    })
    identifier: string

    @Column({
        length: 100,
        nullable: false,
    })
    password: string

    @Column({
        length: 100,
        nullable: false,
    })
    profile_name: string

    kind: string = "account@accounts"

    etag: string = undefined

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    @AfterRemove()
    AfterAll() {
        // Removing private columns
        delete this.password

        // Generating E-Tag
        this.etag = etag(JSON.stringify(this))
    }
}
