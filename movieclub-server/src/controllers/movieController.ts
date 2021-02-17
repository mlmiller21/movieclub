import { Review } from "../entities/Review";

import { createUserReview } from "../database/review";
import { getPaginatedMovieReviews } from "../database/movie";

import { UserReview } from "../interfaces/UserReview";
import { ReviewFilter } from "../interfaces/ReviewFilter";

import { fieldError } from "../utils/fieldError";
import { HttpError } from "../utils/CustomErrors";

import { Request, Response } from "express";

/**
 * @description Post a review, users can only post one review per movie, once a review is posted the movie's score is updated to reflect the new review
 * 
 * TODO: allow replies for reviews
 * @param {UserReview} userReview score, title, body, spoilers
 * @param {number} movieId moviepk corresponding to TMDB
 * @param {Request} req containing user session
 * @returns {Promise<void>}
 */
export const createReview: (userReview: UserReview, movieId: number, req: Request) => Promise<void> = async function(userReview: UserReview, movieId: number, req: Request): Promise<void> {
    if (userReview.score < 1 || userReview.score > 10){
        throw new HttpError([fieldError("score", "Invalid score")]);
    }
    
    //user hasn't submitted a review yet for this movie
    try{
        await createUserReview(movieId, userReview, req);
    }
    catch(err){
        //User already submitted a review
        throw new HttpError([fieldError("review", "Already submitted review for this movie")]);
    }
}

/**
 * @description get paginated result of reviews for that movie
 * @param {ReviewFilter} reviewFilter 
 * @param {number} movieId 
 * @returns {Promise<Review[]>} array of reviews, if none returned then array is empty
 */
export const getMovieReviews: (reviewFilter: ReviewFilter, movieId: number) => Promise<Review[]> = async function(reviewFilter: ReviewFilter, movieId: number): Promise<Review[]> {
    try{
        const reviews: Review[] = await getPaginatedMovieReviews(reviewFilter, movieId);
        return reviews;
    }
    catch(err){
        throw new HttpError([fieldError("movieid", "Invalid movie id")])
    }
}

