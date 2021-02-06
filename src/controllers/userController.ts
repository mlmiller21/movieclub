import { User } from "../entities/User";

import { UserResponse } from "../interfaces/UserResponse";
import { UserProfileEdit } from "../interfaces/UserEdit";
import { UserGeneral } from "../interfaces/UserGeneral";
import { CustomError } from "../interfaces/CustomError";

import { createPassword, comparePassword } from "../utils/password";
import { fieldError } from "../utils/fieldError";
import { validatePassword } from "../utils/validatePassword";
import { validateUserGeneral } from "../utils/validateUserGeneral";
import { HttpError } from "../utils/CustomErrors";

import { Request, Response } from "express";
import { v4 } from "uuid";
import { getConnection } from "typeorm";


/**
 * @description Edit user properties such as firstname, last name, etc
 * @param {UserProfileEdit} res user properties to edit
 * @param {Request} req Cookie containing user id
 * @returns {Promise<UserResponse>} error if invalid, user otherwise
 */
export const editProfile: (userEdit: UserProfileEdit, req: Request) => Promise<UserResponse> = async function(userEdit: UserProfileEdit, req: Request): Promise<UserResponse> {
    const errors: CustomError[] = [];
    if (userEdit.firstName.length > 50 || userEdit.lastName.length > 50){
        errors.push(fieldError("name", "name too long"));
    }

    if(errors.length > 0){
        throw new HttpError(errors);
    }
    //no validation errors, update user 

    let user: User = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({...userEdit})
    .where('id = :id', {id: req.session.userId})
    .returning('*')
    .execute()
    .then(res => res.raw[0]);

    if (!user){
        throw new HttpError([fieldError("user", "User doesn't exist")]);
    }

    return {user}
}

/**
 * @description Edit username and email, requires user to enter password to update
 * @param {UserGeneral} userGeneral username, email, and password
 * @param {Request} req Cookie containing user id
 * @returns {Promise<UserResponse>} error if invalid, user otherwise
 */
export const updateUserGeneral: (userGeneral: UserGeneral, req: Request) => Promise<UserResponse> = async function(userGeneral: UserGeneral, req: Request): Promise<UserResponse> {
    // validate input
    const errors = validateUserGeneral(userGeneral);
    if (errors.length > 0){
        throw new HttpError(errors);
    }
    //obtain the user
    const user: User | undefined = await User.findOne({where: {id: req.session.userId}})
    //user doesn't exist
    if (!user){
        throw new HttpError([fieldError("user", "user doesn't exist")]);
    }
    //Compare the user password with the password in the db
    const success = await comparePassword(userGeneral.password, user.password);
    if (!success){
        throw new HttpError([fieldError("user", "user doesn't exist")]);
    }
    //everything good, update user
    try {
        await User.update({id: req.session.userId}, {username: userGeneral.username, email: userGeneral.email})
    }
    catch(err) {
        if (err.code === "23505"){
            if (err.detail.includes("username")){
                throw new HttpError([fieldError("username", "username already exists")])
            }
            if (err.detail.includes("email")){
                throw new HttpError([fieldError("email", "email already exists")])
            }
        }
    }

    user.username = userGeneral.username;
    user.email = userGeneral.email;
    
    return {user}
}

/**
 * @description Change password of user, first make sure oldpassword is correct then update to new password
 * @param {string} password new password
 * @param {Request} req Request object containing user id
 * @returns {Promise<void>} void if valid, error otherwise
 */
export const changePassword: (oldPassword: string, newPassword: string, req: Request) => Promise<void> = async function(oldPassword: string, newPassword: string, req: Request): Promise<void> {
    //obtain the user
    const user: any = await User.findOne({where: {id: req.session.userId}})
    //user doesn't exist
    if (!user){
        throw new HttpError([fieldError("user", "user doesn't exist")]);
    }
    //validate the new password
    const error = validatePassword(newPassword);
    if(error){
        throw new HttpError([error])
    }

    //Compare the user password with the password in the db
    const success = await comparePassword(oldPassword, user.password);
    if (!success){
        throw new HttpError([fieldError("password", "incorrect password")])
    }
    const hashedPassword = await createPassword(newPassword);
    console.log(hashedPassword);
    try {
        await User.update({id: req.session.userId}, {password: hashedPassword});
    }
    catch(err){
        throw new HttpError([fieldError("Error", "Unknown Error")])
    }
}

/**
 * @description return user by id
 * @param userid 
 */
export const getUser: (userid: string) => Promise<UserResponse> = async function(userid: string): Promise<UserResponse> {
    const user: User | undefined = await User.findOne({where: {id: userid}});
    if (!user){
        throw new HttpError([fieldError("user", "user not found")]);
    }
    return {user};
}