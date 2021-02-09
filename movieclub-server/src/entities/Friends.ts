import {Entity, CreateDateColumn, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity, Column} from "typeorm";
import {User} from "./User"

@Entity("friends")
export class Friends extends BaseEntity {
    @PrimaryColumn()
    friendOne!: string;

    @PrimaryColumn()
    friendTwo!: string;

    @CreateDateColumn()
    dateAdded: Date;

    //One of the following: ['PENDING', 'BLOCKED', 'FRIEND']
    @Column()
    status: string;

    @ManyToOne(() => User, user => user.friends, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "friendOne" })
    user1: User;

    @ManyToOne(() => User, user => user.friendsInverse, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "friendTwo" })
    user2: User;

}