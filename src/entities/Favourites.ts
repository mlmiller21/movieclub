import {Entity, CreateDateColumn, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity} from "typeorm";
import {User} from "./User";
import {Movie} from "./Movie";

@Entity("favourites")
export class Favourites extends BaseEntity {
    @PrimaryColumn()
    userId!: number;

    @PrimaryColumn()
    movieId!: number;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToOne(() => User, user => user.favouritesConnection, {
        primary: true
    })
    @JoinColumn({ name: "userId" })
    user: User

    @ManyToOne(() => Movie, movie => movie.favouritesConnection, {
        primary: true
    })
    @JoinColumn({ name: "movieId" })
    movie: Movie
    

}