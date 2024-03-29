import { Review } from "../entities/Review";
import { Movie } from "../entities/Movie";
import { User } from "../entities/User";

import { ReviewFilter } from "../interfaces/ReviewFilter";

import { HttpError } from "../utils/CustomErrors";
import { fieldError } from "../utils/fieldError";

import { getConnection } from "typeorm";


/**
 * @description find a movie by its id
 * @param {number} movieid
 * @returns {Promise<Movie | undefined>} movie if found, undefined otherwise
 */
export const findMovie: (movieid: number) => Promise<Movie | undefined> = async function(movieid: number): Promise<Movie | undefined>{
    try{
        return await Movie.findOne({where: {id: movieid}});
    }
    catch(err){
        throw new HttpError([fieldError("movie", "Unknown error")]);
    }
}

/**
 * @description create a movie
 * @param {number} id 
 * @param {string} title
 * @param {string} posterPath
 * @returns {Promise<void>} void
 */
export const createMovie: (id: number, title: string, posterPath: string) => Promise<void> = async function(id: number, title: string, posterPath: string): Promise<void>{
    await Movie.create({id, title, posterPath}).save();
}


/**
 * @description returns the paginated results of a movie's reviews
 * @param {ReviewFilter} reviewFilter 
 * @param {number} movieId 
 * @returns {Promise<Review[]>} array of paginated reviews along with the username , or empty if they don't exist
 */
export const getPaginatedMovieReviews: (reviewFilter: ReviewFilter, movieId: number) => Promise<Review[]> = async function(reviewFilter: ReviewFilter, movieId: number): Promise<Review[]>{
    return await getConnection()
        .getRepository(Review)
        .createQueryBuilder("review")
        .addSelect('user.username')
        .innerJoin('review.user', 'user')
        .orderBy(reviewFilter.filter === "date" ? "review.createdAt" : "score", reviewFilter.sort === "asc" ? "ASC" : "DESC")
        .offset(reviewFilter.skip * reviewFilter.take)
        .limit(reviewFilter.take)
        .where("review.movieId = :movieId", {movieId})
        .getMany();
}