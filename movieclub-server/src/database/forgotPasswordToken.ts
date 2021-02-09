import { User } from "../entities/User";
import { ForgotPassword } from "../entities/ForgotPassword";

import { getConnection } from "typeorm";

/**
 * @description delete token belonging to user
 * @param {Request} req
 */
export const deleteForgotPasswordToken: (user: User) => Promise<void> = async function(user: User): Promise<void>{
    await ForgotPassword.delete({userid: user!.id})
}


/**
 * @description delete all expired generated tokens
 * @param {Request} req
 */
export const deleteExpiredForgotPasswordToken: () => Promise<void> = async function(): Promise<void>{
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(ForgotPassword)
    .where('expires <= :currentDate', {currentDate: new Date()})
    .execute();
}

/**
 * @description generate uuid token in ForgotPassword table corresponding to user
 * @param {string} token uuid token
 * @param {User} user
 * @param {Date} expires expiry date
 * @returns {Promise<ForgotPassword | undefined>} ForgotPassword entity if found, undefined otherwise
 */
export const createForgotPasswordToken: (token: string, user: User, expires: Date) => Promise<ForgotPassword | undefined> = async function(token: string, user: User, expires: Date): Promise<ForgotPassword | undefined>{
    return await ForgotPassword.create({token: token, userid: user.id, expires: expires}).save();
}

/**
 * @description find uuid token in ForgotPassword table corresponding to user
 * @param {string} token uuid token
 * @returns {Promise<ForgotPassword | undefined>} ForgotPassword entity if found, undefined otherwise
 */
export const findForgotPasswordToken: (token: string) => Promise<ForgotPassword | undefined> = async function(token: string): Promise<ForgotPassword | undefined> {
    return await ForgotPassword.findOne({where: {token}});
}
