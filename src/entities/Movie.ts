import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Review } from "./Review";
import { Watchlist } from "./Watchlist";
import { Favourites } from "./Favourites";

@Entity()
export class Movie extends BaseEntity {
    @PrimaryColumn()
    id!: number;

    @Column()
    title!: string;

    //posterPath to reduce api calls to TMDB when needing to display movie posters in different order
    @Column()
    posterPath!: string;

    @Column({type: "smallint", default: 0})
    reviewCount: number;

    @Column({type: "real", nullable: true, default: 0})
    score: number;

    @OneToMany(() => Review, review => review.movie)
    reviews: Review[];

    @OneToMany(() => Watchlist, watchlist => watchlist.movie)
    watchlistConnection: Watchlist[];

    @OneToMany(() => Favourites, Favourites => Favourites.user)
    favouritesConnection: Favourites[];

}