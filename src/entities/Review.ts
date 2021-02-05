import { Column, CreateDateColumn, Entity, UpdateDateColumn, ManyToOne, BaseEntity, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Movie } from "./Movie";

@Entity()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    userId!: number

    @Column()
    movieId!: number

    @Column({type: "varchar", length: "100", nullable: true})
    title: string;

    @Column({type: "text", nullable: true})
    body: string;

    @Column({type: "smallint"})
    score!: number;

    @Column({type: "boolean"})
    spoilers: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.reviews, {
        primary: true
    })
    @JoinColumn({name: "userId"})
    user: User;

    @ManyToOne(() => Movie, movie => movie.reviews, {
        primary: true
    })
    @JoinColumn({name: "movieId"})
    movie: User;

}