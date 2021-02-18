import { User } from "../entities/User";
import { Review } from "../entities/Review";

import { UserProfileEdit } from "../interfaces/UserEdit";
import { ReviewFilter } from "../interfaces/ReviewFilter";

import { getConnection } from "typeorm";
import { Request } from "express";


/**
 * @description Update a user's personal details
 * @param {UserProfileEdit} userEdit 
 * @param {Request} req 
 * @returns {Promise<User>} the updated user
 */
export const updateUserDetails: (userEdit: UserProfileEdit, userId: string) => Promise<User> = async function(userEdit: UserProfileEdit, userId: string): Promise<User> {
    return await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({...userEdit})
    .where('id = :id', {id: userId})
    .returning('*')
    .execute()
    .then(res => res.raw[0]);
}

/**
 * @description updates a user's password to a new hashed password
 * @param {string} password 
 * @param {string} userId
 */
export const updatePassword: (password: string, userId: string) => Promise<void> = async function(password: string, userId: string): Promise<void> {
    await User.update({id: userId}, {password});
}

/**
 * @description using a transaction, delete's a user from the database and for each review they've posted the appropriate movie is updated to account for the lost review
 * @param {string} userId 
 */
export const deleteUserDB: (userId: string) => Promise<void> = async function(userId: string): Promise<void> {
    await getConnection().transaction(async (tm) => {
        await tm.query(`UPDATE movie 
        SET score = CASE WHEN m."reviewCount" = 1 THEN 0 ELSE ((m.score * m."reviewCount") - r.score) / (m."reviewCount" - 1) END,
        "reviewCount" = m."reviewCount" - 1 
        FROM movie AS m INNER JOIN (SELECT "userId", "movieId", score
        FROM review) r 
        ON m.id = r."movieId" 
        WHERE movie.id = r."movieId" AND r."userId" = $1;
        `, [userId]);
        await tm.delete(User, {id: userId});
    });
}


/**
 * @description returns the paginated results of a movie's reviews
 * @param {ReviewFilter} reviewFilter 
 * @param {string} userId 
 * @returns {Promise<Review[]>} array of paginated reviews along with the username , or empty if they don't exist
 */
export const getPaginatedUserReviews: (reviewFilter: ReviewFilter, userId: string) => Promise<Review[]> = async function(reviewFilter: ReviewFilter, userId: string): Promise<Review[]> {
    return getConnection()
    .getRepository(Review)
    .createQueryBuilder("review")
    .addSelect('movie.title')
    .innerJoin('review.movie', 'movie')
    .orderBy(reviewFilter.filter === "date" ? "review.createdAt" : "review.score", reviewFilter.sort === "asc" ? "ASC" : "DESC")
    .offset(reviewFilter.skip * reviewFilter.take)
    .limit(reviewFilter.take)
    .where("review.userId = :userId", {userId})
    .getMany();
}

export const getUserList: (user: string) => Promise<User[]> = async function(user: string): Promise<User[]> {
    return await getConnection()
    .getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id', 'user.username', 'user.firstName', 'user.lastName', 'user.email'])
    .where('"user".username LIKE :username', {username: `${user}%`})
    .limit(10)
    .getMany();

}