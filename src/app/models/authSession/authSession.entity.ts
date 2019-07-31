import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove, UpdateDateColumn, CreateDateColumn } from "typeorm"

@Entity({
    name: "authSessions",
})
class AuthSession {

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
        [datetime: string]: number
    }

    @Column({
        type: "timestamptz",
        nullable: false,
    })
    validUntil: Date

    @Column({
        type: "timestamptz",
        nullable: true,
        default: null,
    })
    authenticatedAt: Date

    @CreateDateColumn({
        type: "timestamptz",
    })
    createdAt: Date

    @UpdateDateColumn({
        type: "timestamptz",
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
export { AuthSession }
