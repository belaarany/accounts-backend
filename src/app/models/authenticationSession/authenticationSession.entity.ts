import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove, UpdateDateColumn, CreateDateColumn } from "typeorm"

@Entity({
    name: "authenticationSessions",
})
class AuthenticationSession {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        length: 100,
        nullable: false,
    })
    identifier: string

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    @AfterRemove()
    AfterAll() {

    }
}

export default AuthenticationSession
export { AuthenticationSession }
