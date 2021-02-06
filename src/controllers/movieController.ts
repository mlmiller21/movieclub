import { Review } from "../entities/Review";
import { Movie } from "../entities/Movie";

import { UserReview } from "../interfaces/UserReview";
import { ReviewFilter } from "../interfaces/ReviewFilter";
import { UserReviewsResponse } from "src/interfaces/UserReviewsResponse";

import { fieldError } from "../utils/fieldError";
import { HttpError } from "../utils/CustomErrors";

import { Request, Response } from "express";

import { getConnection } from "typeorm";

export const createReview: (userReview: UserReview, movieId: number, req: Request) => Promise<UserReviewsResponse> = async function(userReview: UserReview, movieId: number, req: Request): Promise<UserReviewsResponse> {
    if (userReview.score < 0 || userReview.score > 10){
        throw new HttpError([fieldError("score", "Invalid score")]);
    }
    console.log(userReview);
     const review = await Review.create({userId: req.session.userId, movieId, ...userReview, }).save();
    // console.log(review);
     return {reviews: [review]};
}