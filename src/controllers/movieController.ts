import { Review } from "../entities/Review";
import { Movie } from "../entities/Movie";

import { UserReview } from "../interfaces/UserReview";
import { ReviewFilter } from "../interfaces/ReviewFilter";
import { UserReviewsResponse } from "src/interfaces/UserReviewsResponse";

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
 */
export const createReview: (userReview: UserReview, movieId: number, req: Request) => Promise<UserReviewsResponse> = async function(userReview: UserReview, movieId: number, req: Request): Promise<UserReviewsResponse> {
    if (userReview.score < 1 || userReview.score > 10){
        throw new HttpError([fieldError("score", "Invalid score")]);
    }
    console.log(userReview);

    const review: Review | undefined = await Review.findOne({where: {movieId, userId: req.session.userId}});

    //user hasn't submitted a review yet for this movie
    if (!review){
        await getConnection().transaction(async (tm) => {
            await tm.create(Review, {userId: req.session.userId, movieId, ...userReview}).save();
            await tm.query(`
                UPDATE movie 
                SET "userScore" = CASE WHEN "reviewCount" = 0 THEN $1 ELSE (("reviewCount" * "userScore") + $1) / ("reviewCount" + 1) END, 
                "reviewCount" = "reviewCount" + 1 
                where id = $2
            `,
            [userReview.score, movieId]);
        })
    }
    else{
        //User already submitted a review
        throw new HttpError([fieldError("review", "Already submitted review for this movie")]);
    }

    const newReview: Review | undefined = await Review.findOne({where: {movieId, userId: req.session.userId}, order: {id: 'DESC'}});
    
    return {reviews: [newReview!]};
}