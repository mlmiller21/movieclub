"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const typeormconfig_1 = require("./typeormconfig");
const Friends_1 = require("./entities/Friends");
const User_1 = require("./entities/User");
const Movie_1 = require("./entities/Movie");
const Review_1 = require("./entities/Review");
const Watchlist_1 = require("./entities/Watchlist");
const Favourites_1 = require("./entities/Favourites");
exports.connection = typeorm_1.createConnection({
    type: "postgres",
    database: typeormconfig_1.dbConfig.database,
    username: typeormconfig_1.dbConfig.username,
    password: typeormconfig_1.dbConfig.password,
    logging: true,
    synchronize: true,
    entities: [User_1.User, Friends_1.Friends, Movie_1.Movie, Review_1.Review, Watchlist_1.Watchlist, Favourites_1.Favourites]
});
//# sourceMappingURL=connection.js.map