import { Column, CreateDateColumn, Entity, UpdateDateColumn, Check, ManyToOne, BaseEntity, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Movie } from "./Movie";

@Entity()
@Check(`"score" >= 0 AND "score" <= 10`)
export class Review extends BaseEntity {
    @PrimaryColumn()
    userId!: number

    @PrimaryColumn()
    movieId!: number

    @Column({type: "varchar", length: "100", nullable: true})
    title: string;

    @Column({type: "text", nullable: true})
    body: string;

    @Column({type: "smallint"})
    score!: number;

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