import { Movie } from "../entities/Movie";
import { Watchlist } from "../entities/Watchlist";

import { getConnection, InsertResult, getManager } from "typeorm";

/**
 * @description get a user's watchlist
 * @param {string} userId 
 * @returns {Promise<Movie[]>} return an array of all of the movies in a user's watchlist or empty if they don't exist
 */
export const getUserWatchlist: (userId: string) => Promise<Movie[]> = async function(userId: string): Promise<Movie[]> {
    return await getConnection()
    .getRepository(Movie)
    .createQueryBuilder("movie")
    .innerJoin("movie.watchlist", 'watchlist')
    .where('watchlist."userId" = :userId', {userId})
    .orderBy('watchlist."dateAdded"', "ASC")
    .getMany();
}

/**
 * @description create a new movie in a user's watchlist
 * @param {number} movieId 
 * @param {string} userId 
 * @returns {InsertResult} result of query which Contains inserted entity id. Has entity-like structure
 */
export const createWatchlistMovie: (movieId: number, userId: string) => Promise<InsertResult> = async function(movieId: number, userId: string): Promise<InsertResult> {
    return await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Watchlist)
        .values({movieId, userId})
        .execute();
}

/**
 * @description deletes a movie from a user's watchlist
 * @param {number} movieId 
 * @param {string} userId 
 * @returns {Promise<any>} contains affected object which describes number of rows affected (should be 1)
 */
export const deleteWatchlistMovie: (movieId: number, userId: string) => Promise<any> = async function(movieId: number, userId: string): Promise<any> {
    return await Watchlist.delete({userId, movieId});
}