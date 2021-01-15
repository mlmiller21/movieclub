import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Review } from "./Review";
import { Watchlist } from "./Watchlist";
import { Favourites } from "./Favourites";

@Entity()
export class Movie extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    title!: string;

    @Column("real", {nullable: true})
    userScore: number;

    @OneToMany(() => Review, review => review.movie)
    reviews: Review[];

    @OneToMany(() => Watchlist, watchlist => watchlist.movie)
    watchlistConnection: Watchlist[];

    @OneToMany(() => Favourites, Favourites => Favourites.user)
    favouritesConnection: Favourites[];

}