import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove, UpdateDateColumn, CreateDateColumn } from "typeorm"
import etag from "etag"

@Entity({
    name: "accounts",
})
class Account {

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
    email: string

    @Column({
        length: 100,
        nullable: false,
    })
    firstName: string

    @Column({
        length: 100,
        nullable: false,
    })
    lastName: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    kind: string = "accounts.account"

    etag: string = undefined

    name: string = undefined

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    @AfterRemove()
    AfterAll() {
        // Removing private columns
        delete this.password

        // Generating E-Tag
        this.etag = etag(JSON.stringify(this))

        // Generating the name
        this.name = [this.firstName, this.lastName].join(" ")
    }
}

export default Account
export { Account }
