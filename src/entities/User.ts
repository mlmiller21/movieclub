import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from "typeorm";
import { Friends } from "./Friends";
import { Review } from "./Review";
import { Watchlist } from "./Watchlist";
import { Favourites } from "./Favourites";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, type: "varchar", length: "50"})
    username!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    salt!: string;

    @Column({ nullable: true, type: "varchar", length: "50"})
    firstName: string;

    @Column({ nullable: true, type: "varchar", length: "50"})
    lastName: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Friends, friends => friends.user2)
    friends: Friends[];

    @OneToMany(() => Friends, friends => friends.user1)
    friendsInverse: Friends[];

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Watchlist, watchlist => watchlist.user)
    watchlistConnection: Watchlist[];

    @OneToMany(() => Favourites, Favourites => Favourites.user)
    favouritesConnection: Favourites[];

    

}