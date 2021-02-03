import { User } from "../entities/User";

import { UserResponse } from "../interfaces/UserResponse";
import { UserProfileEdit } from "../interfaces/UserEdit";

import { createPassword } from "../utils/password";
import { fieldError } from "../utils/fieldError";
import { validatePassword } from "../utils/validatePassword";
import { validateEmail } from "../utils/validateEmail";
import { validateUsername } from "../utils/validateUsername";

import { COOKIE_NAME } from "../constants";

import { Request, Response } from "express";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

/**
 * @description Edit user properties such as firstname, last name, etc
 * @param {UserProfileEdit} res user properties to edit
 * @param {Request} req Cookie containing user id
 * @returns {Promise<UserResponse | null>} error if invalid, null otherwise
 */
export const editProfile: (userEdit: UserProfileEdit, req: Request) => Promise<UserResponse | null> = async function(userEdit: UserProfileEdit, req: Request): Promise<UserResponse | null> {
    
    const error: UserResponse = {errors: []};
    if (userEdit.firstName.length > 50 || userEdit.lastName.length > 50){
        error.errors!.push(fieldError("name", "name too long"));
    }

    if(error.errors!.length > 0){
        return error;
    }
    //no errors, update user 
    await User.update({id: req.session.userId}, {...userEdit});

    return null;
}

/**
 * @description Change password of user
 * @param {string} password new password
 * @param {Request} req Request object containing user id
 * @returns {Promise<UserResponse>} user if valid, error otherwise
 */
export const changePassword: (password: string, req: Request) => Promise<UserResponse> = async function(password: string, req: Request): Promise<UserResponse> {
    const error = validatePassword(password);
    if(error){
        return error;
    }
    //Obtain the user
    const user = await User.findOne({where: {id: req.session.userId}});

    if (!user){
        return {errors: [
            fieldError("token", "User no longer exists")
        ]};
    }
    const hashedPassword = await createPassword(password);
    await User.update({id: req.session.userId}, {password: hashedPassword});
    return {user};
}

/**
 * @description Change username of user
 * @param {string} username new username
 * @param {Request} req Request object containing user id
 * @returns {Promise<UserResponse>} user if valid, false otherwise
 */
export const changeUsername: (username: string, req: Request) => Promise<UserResponse> = async function(username: string, req: Request): Promise<UserResponse> {
    const error = validateUsername(username);
    if (error){
        return error;
    }
    //Obtain the user
    const user = await User.findOne({where: {id: req.session.userId}});

    if (!user){
        return {errors: [
            fieldError("token", "User no longer exists")
        ]};
    }
    await User.update({id: req.session.userId}, {username});
    return {user};
}

export const changeEmail: (email: string, req: Request) => Promise<UserResponse> = async function(email: string, req: Request): Promise<UserResponse> {
    const error = validateEmail(email);
    if (error){
        return error;
    }
    //Obtain the user
    const user = await User.findOne({where: {id: req.session.userId}});
    if (!user){
        return {errors: [
            fieldError("token", "User no longer exists")
        ]};
    }
    await User.update({id: req.session.userId}, {email});
    return {user};
}