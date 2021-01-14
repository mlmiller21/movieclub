import {Entity, CreateDateColumn, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity} from "typeorm";
import {User} from "./User"

@Entity("friends")
export class Friends extends BaseEntity {
    @PrimaryColumn()
    friendOne!: number;

    @PrimaryColumn()
    friendTwo!: number;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToOne(() => User, user => user.friends)
    @JoinColumn({ name: "friendOne" })
    user1: User;

    @ManyToOne(() => User, user => user.friendsInverse)
    @JoinColumn({ name: "friendTwo" })
    user2: User;

}