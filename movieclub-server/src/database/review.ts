import { Review } from "../entities/Review";

import { UserReview } from "../interfaces/UserReview";

import { getConnection } from "typeorm";
import { Request } from "express";

/**
 * @description find review using review id and user id (to validate that the user is deleting their correct review)
 * @param {Request} req 
 * @param {number} movieid
 * @returns {Promise<Review| undefined>} review if found, undefined otherwise
 */
export const findUserReview: (reviewId: number, userId: string) => Promise<Review | undefined> = async function (reviewId: number, userId: string): Promise<Review | undefined> {
    return await Review.findOne({where: {id: reviewId, userId}});
}

/**
 * @description Create user review and then update the movies user score
 * @param {number} movieid
 * @param {UserReview} userReview
 * @param {Request} req
 * @returns {Promise<Review| undefined>} review if found, undefined otherwise
 */
export const createUserReview: (movieId: number, userReview: UserReview, req: Request) => Promise<void> = async function(movieId: number, userReview: UserReview, req: Request): Promise<void>{
    await getConnection().transaction(async (tm) => {
        await tm.create(Review, {userId: req.session.userId, movieId, ...userReview}).save();
        await tm.query(`
            UPDATE movie 
            SET score = CASE WHEN "reviewCount" = 0 THEN $1 ELSE (("reviewCount" * score) + $1) / ("reviewCount" + 1) END, 
            "reviewCount" = "reviewCount" + 1 
            where id = $2
        `,
        [userReview.score, movieId]);
    })
}

/**
 * @description using a transaction, updates the review and then updates the movie's score accounting for the new updated score
 * @param {number} reviewId 
 * @param {number} movieId 
 * @param {UserReview} userReview 
 * @param {number} originalScore the review's score prior to update
 */
export const editUserReview: (reviewId: number, movieId: number, userReview: UserReview, originalScore: number) => Promise<void> = async function(reviewId: number, movieId: number, userReview: UserReview, originalScore: number): Promise<void> {
    await getConnection().transaction(async (tm) => {
        await tm.update(Review, {id: reviewId}, {...userReview});
        await tm.query(`
            UPDATE movie 
            SET score = (("reviewCount" * score) - $1 + $2) / ("reviewCount")
            where id = $3
        `,
        [originalScore, userReview.score, movieId]);
    })
}

/**
 * @description using a transaction, deletes a user's review and updates the movie accounting for the deleted review
 * @param {number} reviewId 
 * @param {number} movieId 
 * @param {number} score the review's score prior to deletion
 */
export const deleteUserReview: (reviewId: number, movieId: number, score: number) => Promise<void> = async function(reviewId: number, movieId: number, score: number): Promise<void>{
    await getConnection().transaction(async (tm) => {
        await tm.delete(Review, {id: reviewId});
        await tm.query(`
            UPDATE movie 
            SET score = CASE WHEN "reviewCount" = 1 THEN 0 ELSE (("reviewCount" * score) - $1) / ("reviewCount" - 1) END, 
            "reviewCount" = "reviewCount" - 1 
            where id = $2
        `,
        [score, movieId]);
    })
}