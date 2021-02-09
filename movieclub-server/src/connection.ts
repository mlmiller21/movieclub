import "reflect-metadata"
import { Connection, createConnection } from "typeorm";
import { dbConfig } from "./typeormconfig";
import { Friends } from "./entities/Friends";
import { User } from "./entities/User";
import { Movie } from "./entities/Movie";
import { Review } from "./entities/Review";
import { Watchlist } from "./entities/Watchlist";
import { Favourites } from "./entities/Favourites";
import { ForgotPassword } from "./entities/ForgotPassword";

export const connection: Promise<Connection> = createConnection({
    type: "postgres",
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    logging: true,
    synchronize: true,
    entities: [User, Friends, Movie, Review, Watchlist, Favourites, ForgotPassword]
});