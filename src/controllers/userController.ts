import { User } from "../entities/User";

import { UserResponse } from "../interfaces/UserResponse";
import { UserProfileEdit } from "../interfaces/UserEdit";
import { UserGeneral } from "src/interfaces/UserGeneral";

import { createPassword, comparePassword } from "../utils/password";
import { fieldError } from "../utils/fieldError";
import { validatePassword } from "../utils/validatePassword";
import { validateUserGeneral } from "../utils/validateUserGeneral";

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
    //no validation errors, update user 
    try {
        await User.update({id: req.session.userId}, {...userEdit});
    }
    catch (err){
        return {errors: [
            fieldError("user", "User doesn't exist")
        ]}
    }

    return null;
}

/**
 * @description Edit username and email, requires user to enter password to update
 * @param {UserGeneral} userGeneral username, email, and password
 * @param {Request} req Cookie containing user id
 * @returns {Promise<UserResponse | null>} error if invalid, null otherwise
 */
export const updateUserGeneral: (userGeneral: UserGeneral, req: Request) => Promise<UserResponse | null> = async function(userGeneral: UserGeneral, req: Request): Promise<UserResponse | null> {
    // validate input
    const error = validateUserGeneral(userGeneral);
    if (error){
        return error;
    }
    //obtain the user
    const user: any = await User.findOne({where: {id: req.session.userId}})
    //user doesn't exist
    if (!user){
        return {errors: [
            fieldError("user", "user doesn't exist")
        ]};
    }
    //Compare the user password with the password in the db
    const success = await comparePassword(userGeneral.password, user.password);
    if (!success){
        return {errors: [
            fieldError("password", "incorrect password")
        ]};
    }
    //everything good, update user
    try {
        await User.update({id: user.id}, {username: userGeneral.username, email: userGeneral.email});
    }
    catch(err) {
        if (err.code === "23505"){
            if (err.detail.includes("username")){
                return {errors: [
                    fieldError("username", "username already exists")
                ]};
            }
            if (err.detail.includes("email")){
                return {errors: [
                    fieldError("email", "email already exists")
                ]};
            }
        }
    }

    return null;
}

/**
 * @description Change password of user, first make sure oldpassword is correct then update to new password
 * @param {string} password new password
 * @param {Request} req Request object containing user id
 * @returns {Promise<UserResponse>} user if valid, error otherwise
 */
export const changePassword: (oldPassword: string, newPassword: string, req: Request) => Promise<UserResponse | null> = async function(oldPassword: string, newPassword: string, req: Request): Promise<UserResponse | null> {
    //obtain the user
    const user: any = await User.findOne({where: {id: req.session.userId}})
    //user doesn't exist
    if (!user){
        return {errors: [
            fieldError("user", "user doesn't exist")
        ]};
    }
    //Compare the user password with the password in the db
    const success = await comparePassword(oldPassword, user.password);
    if (!success){
        return {errors: [
            fieldError("password", "incorrect password")
        ]};
    }
    //validate the new password
    const error = validatePassword(newPassword);
    if(error){
        return error;
    }
    const hashedPassword = await createPassword(newPassword);
    try {
        await User.update({id: req.session.userId}, {password: hashedPassword});
    }
    catch(err){
        return {errors: [
            fieldError("user", "user doesn't exist")
        ]};
    }
    return null;
}