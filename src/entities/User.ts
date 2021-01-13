import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Friends } from "./Friends";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, type: "varchar", length: "100"})
    username!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    salt!: string;

    @Column({type: "varchar", length: "50"})
    firstName: string;

    @Column({type: "varchar", length: "50"})
    lastName: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Friends, friends => friends.user2)
    user1ToUser2: Friends[];

    @OneToMany(() => Friends, friends => friends.user1)
    user2ToUser1: Friends[];
}