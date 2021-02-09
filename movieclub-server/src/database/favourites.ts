import { Movie } from "../entities/Movie";
import { Favourites } from "../entities/Favourites";

import { getConnection, InsertResult } from "typeorm";

/**
 * @description return all of a user's favourites
 * @param {string} userId id of user
 * @returns an array of movie, if no favourites found then the array is empty 
 */
export const getUserFavourites: (userId: string) => Promise<Movie[]> = async function(userId: string): Promise<Movie[]> {
    return await getConnection()
    .getRepository(Movie)
    .createQueryBuilder("movie")
    .select(["movie.id", "movie.title", "movie.posterPath", "movie.score"])
    .innerJoin(Favourites, "favourites", 'favourites."movieId" = movie.id')
    .where('favourites."userId" = :userId', {userId})
    .orderBy('favourites."dateAdded"', "ASC")
    .getMany();
}

/**
 * @description creates a new entry in the favourites list of a user
 * @param {number} movieId id of movie
 * @param {string} userId id of user
 * @returns {InsertResult} result of query which Contains inserted entity id. Has entity-like structure
 */
export const createFavouriteMovie: (movieId: number, userId: string) => Promise<InsertResult> = async function(movieId: number, userId: string): Promise<InsertResult> {
    return await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Favourites)
    .values({movieId, userId})
    .execute();
}

/**
 * @description delete a user's favourite movie from their list
 * @param {string} movieId id of movie
 * @param {string} userId id of user
 * @returns {Promise<any>} returns object which displays affected rows (should be 1)
 */
export const deleteFavouriteMovie: (movieId: number, userId: string) => Promise<any> = async function(movieId: number, userId: string): Promise<any> {
    return Favourites.delete({userId, movieId});
}