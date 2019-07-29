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
        type: "timestamp",
        nullable: false,
    })
    validUntil: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    @AfterRemove()
    AfterAll() {

    }
}

export default AuthSession
export { AuthSession }
