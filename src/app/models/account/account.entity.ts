import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm"
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
        select: false,
    })
    password: string

    @Column({
        length: 20,
        nullable: false,
        select: false,
    })
    passwordEncryption: "bcrypt"

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

    @CreateDateColumn({
        type: "timestamptz",
    })
    createdAt: Date

    @UpdateDateColumn({
        type: "timestamptz",
    })
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
        //delete this.password

        // Generating E-Tag
        this.etag = etag(JSON.stringify(this))

        // Generating the name
        this.name = [this.firstName, this.lastName].join(" ")
    }

    getPartial(): AccountPartial {
        return {
            kind: "accounts.account.partial",
            name: this.name,
            firstName: this.firstName,
            lastName: this.lastName,
            avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS34H69DfFSeutTyf7arnlbXxJ7Ezkx3J8rf7DUoDp6ocQZQrbNcQ",
        }
    }
}

type AccountPartial = {
    kind: "accounts.account.partial",
    name: string,
    firstName: string,
    lastName: string,
    avatarUrl: string,
}

export default Account
export { Account, AccountPartial }
