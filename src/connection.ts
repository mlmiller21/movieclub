import "reflect-metadata"
import { createConnection } from "typeorm";
import { dbConfig } from "./typeormconfig";
import { Friends } from "./entities/Friends";
import { User } from "./entities/User";
import { Movie } from "./entities/Movie";
import { Review } from "./entities/Review";
import { Watchlist } from "./entities/Watchlist";

export const connection = createConnection({
    type: "postgres",
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    logging: true,
    synchronize: true,
    entities: [User, Friends, Movie, Review, Watchlist]
});