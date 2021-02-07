import { User } from "../entities/User";
import { UserLogin } from "../interfaces/UserLogin";
import { UserRegister } from "../interfaces/UserRegister";
import { getConnection } from "typeorm";

import { Request } from "express";
    
/**
 * @description Check to see if both username and email are taken
 * @param {UserRegister} userCreation username and email
 * @returns {Promise<User[]>} user array, if no users found then array is empty
 */
export const getExistingUserEmail: (userCreation: UserRegister) => Promise<User[]> = async function(userCreation: UserRegister): Promise<User[]>{
    //Another way of doing it, probably better just wanted to try out repo
    // const userTest = await getConnection()
    //     .createQueryBuilder()
    //     .select("user")
    //     .from(User, "user")
    //     .where("user.username = :username", { username: userCreation.username })
    //     .orWhere("user.email = :email", {email: userCreation.email})
    //     .getMany();
    return await getConnection()
    .getRepository(User)
    .find({where: [{username: userCreation.username}, {email: userCreation.email}]});
}

/**
 * @description verify username or email of user
 * @param {UserLogin} userLogin usernameOrEmail
 * @returns {Promise<User | undefined>} user if found, undefined otherwise
 */
export const findUserEmail: (userLogin: UserLogin) => Promise<User | undefined> = async function(userLogin: UserLogin): Promise<User | undefined>{
    return await User.findOne({where: 
        userLogin.usernameOrEmail.includes("@") 
        ? {email: userLogin.usernameOrEmail} 
        : {username: userLogin.usernameOrEmail}}
        );
}

/**
 * @description verify username or email of user
 * @param {string} email usernameOrEmail
 * @returns {Promise<User | undefined>} user if found, undefined otherwise
 */
export const findEmail: (email: string) => Promise<User | undefined> = async function(email: string): Promise<User | undefined>{
    return await User.findOne({where: {email}});
}

/**
 * @description return user object from the session id
 * @param {Request} req
 * @returns {Promise<User | undefined>} user if found, undefined otherwise
 */
export const findUser: (userId: number) => Promise<User | undefined> = async function(userId: number): Promise<User | undefined>{
    return await User.findOne({where: {id: userId}})
}

/**
 * @description update user password with new hashes password
 * @param {Request} req
 * @returns {Promise<User | undefined>} user if found, undefined otherwise
 */
export const updateUserPassword: (user: User, hashedPassword: string) => Promise<void> = async function(user: User, hashedPassword: string): Promise<void>{
    await User.update({id: user!.id}, {password: hashedPassword});
}