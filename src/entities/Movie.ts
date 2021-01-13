import { Column, Entity } from "typeorm";

@Entity()
export class Movie {
    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    score: number;
}