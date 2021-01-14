import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./Review";
import { Watchlist } from "./Watchlist";

@Entity()
export class Movie extends BaseEntity {
    //Change to normal column
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title!: string;

    @Column("real", {nullable: true})
    userScore: number;

    @OneToMany(() => Review, review => review.movie)
    reviews: Review[];

    @OneToMany(() => Watchlist, watchlist => watchlist.movie)
    userConnection: Watchlist[];

}