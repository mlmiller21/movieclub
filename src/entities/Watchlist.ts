import {Entity, CreateDateColumn, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity} from "typeorm";
import {User} from "./User"

@Entity("watchlist")
export class Watchlist extends BaseEntity {
    @PrimaryColumn()
    userId!: number;

    @PrimaryColumn()
    movieId!: number;

    @CreateDateColumn()
    dateAdded: Date;
}