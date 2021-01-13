import { Column, CreateDateColumn, Entity, UpdateDateColumn, Check } from "typeorm";

@Entity()
@Check(`"score" >= 0 AND "score" <= 10`)
export class Review {
    @Column({type: "varchar", length: "100"})
    title: string;

    @Column({type: "text"})
    body: string;

    @Column({type: "smallint"})
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}