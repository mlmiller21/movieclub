import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { UserReview } from "../interfaces/UserReview";
import { getConnection } from "typeorm";
import { Request } from "express";

/**
 * @description find review if user has already submitted 
 * @param {Request} req 
 * @param {number} movieid
 * @returns {Promise<Review| undefined>} reivew if found, undefined otherwise
 */
export const findExistingReview: (movieId: number, req: Request) => Promise<Review | undefined> = async function(movieId: number, req: Request): Promise<Review | undefined>{
    return await Review.findOne({where: {movieId, userId: req.session.userId}});
}

/**
 * @description Create user review and then update the movies user score
 * @param {number} movieid
 * @param {UserReview} userReview
 * @param {Request} req
 * @returns {Promise<Review| undefined>} reivew if found, undefined otherwise
 */
export const createUserReview: (movieId: number, userReview: UserReview, req: Request) => Promise<void> = async function(movieId: number, userReview: UserReview, req: Request): Promise<void>{
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