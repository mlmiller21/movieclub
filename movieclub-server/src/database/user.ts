import { User } from "../entities/User";

import { UserProfileEdit } from "../interfaces/UserEdit";

import { getConnection } from "typeorm";
import { Request } from "express";

/**
 * @description Update a user's personal details
 * @param {UserProfileEdit} userEdit 
 * @param {Request} req 
 * @returns {Promise<User>} the updated user
 */
export const updateUserDetails: (userEdit: UserProfileEdit, req: Request) => Promise<User> = async function(userEdit: UserProfileEdit, req: Request): Promise<User> {
    return await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({...userEdit})
    .where('id = :id', {id: req.session.userId})
    .returning('*')
    .execute()
    .then(res => res.raw[0]);
}

/**
 * @description updates a user's password to a new hashed password
 * @param {string} password 
 * @param {Request} req 
 */
export const updatePassword: (password: string, req: Request) => Promise<void> = async function(password: string, req: Request): Promise<void> {
    await User.update({id: req.session.userId}, {password});
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