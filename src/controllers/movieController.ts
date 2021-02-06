import { Review } from "../entities/Review";

import { createUserReview, findExistingReview, getPaginatedMovieReviews } from "../database/review";

import { UserReview } from "../interfaces/UserReview";
import { ReviewFilter } from "../interfaces/ReviewFilter";

import { fieldError } from "../utils/fieldError";
import { HttpError } from "../utils/CustomErrors";

import { Request, Response } from "express";

import { getConnection } from "typeorm";


/**
 * @description Post a review, users can only post one review per movie, once a review is posted the movie's score is updated to reflect the new review
 * 
 * TODO: allow replies for reviews
 * @param {UserReview} userReview score, title, body, spoilers
 * @param {number} movieId moviepk corresponding to TMDB
 * @param {Request} req containing user session
 * @returns {Promise<UserReviewsResponse>} posted review
 */
export const createReview: (userReview: UserReview, movieId: number, req: Request) => Promise<Review[]> = async function(userReview: UserReview, movieId: number, req: Request): Promise<Review[]> {
    if (userReview.score < 1 || userReview.score > 10){
        throw new HttpError([fieldError("score", "Invalid score")]);
    }
    console.log(userReview);

    const review: Review | undefined = await findExistingReview(movieId, req);

    //user hasn't submitted a review yet for this movie
    if (!review){
        await createUserReview(movieId, userReview, req);
    }
    else{
        //User already submitted a review
        throw new HttpError([fieldError("review", "Already submitted review for this movie")]);
    }

    //FOR TESTING
    const newReview: Review | undefined = await Review.findOne({where: {movieId, userId: req.session.userId}, order: {id: 'DESC'}});
    
    return [newReview!]
}

/**
 * @description get paginated result of reviews for that movie
 * @param {ReviewFilter} reviewFilter 
 * @param {number} movieId 
 * @returns {Promise<Review[]>} array of reviews, if none returned then array is empty
 */
export const getMovieReviews: (reviewFilter: ReviewFilter, movieId: number) => Promise<Review[]> = async function(reviewFilter: ReviewFilter, movieId: number): Promise<Review[]> {
    const reviews: Review[] = await getPaginatedMovieReviews(reviewFilter, movieId);
    return reviews;
}

