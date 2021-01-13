import {Entity, CreateDateColumn, ManyToOne, PrimaryColumn, JoinColumn} from "typeorm";
import {User} from "./User"

@Entity("friends")
export class Friends {
    @PrimaryColumn()
    friendOne: number;

    @PrimaryColumn()
    friendTwo: number;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToOne(() => User, user => user.user1ToUser2, { primary: true })
    @JoinColumn({ name: "friendone" })
    user1: User;

    @ManyToOne(() => User, user => user.user2ToUser1, { primary: true })
    @JoinColumn({ name: "friendtwo" })
    user2: User;

}