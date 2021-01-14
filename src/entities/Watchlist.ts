import {Entity, CreateDateColumn, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity} from "typeorm";
import {User} from "./User";
import {Movie} from "./Movie";

@Entity("watchlist")
export class Watchlist extends BaseEntity {
    @PrimaryColumn()
    userId!: number;

    @PrimaryColumn()
    movieId!: number;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToOne(() => User, user => user.movieConnection, {
        primary: true
    })
    @JoinColumn({ name: "userId" })
    user: User

    @ManyToOne(() => Movie, movie => movie.userConnection, {
        primary: true
    })
    @JoinColumn({ name: "movieId" })
    movie: Movie
    

}