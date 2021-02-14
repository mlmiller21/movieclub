import { User } from "../entities/User";
import { ForgotPassword } from "../entities/ForgotPassword";

import {findEmail,updateUserPassword, findUser, findUserEmail, getExistingUserEmail} from "../database/auth";
import { createForgotPasswordToken, findForgotPasswordToken, deleteForgotPasswordToken, deleteExpiredForgotPasswordToken} from "../database/forgotPasswordToken";

import { UserRegister } from "../interfaces/UserRegister";
import { UserLogin } from "../interfaces/UserLogin";
import { CustomError } from "../interfaces/CustomError";

import { createPassword, comparePassword } from "../utils/password";
import { validateUserGeneral } from "../utils/validateUserGeneral";
import { fieldError } from "../utils/fieldError";
import { validatePassword } from "../utils/validatePassword";
import { validateEmail } from "../utils/validateEmail";
import { sendEmailForgotPassword } from "../utils/email";
import { HttpError } from "../utils/CustomErrors";

import { COOKIE_NAME } from "../constants";

import { Request, Response } from "express";
import { v4 } from "uuid";


/**
 * @description Create a new User, username is saved in lowercase but displayed based on how user inputs it
 * @param {UserRegister} userCreation username, password, and email inputted by user
 * @param {Request} req object to set user id in cookie, logging user in
 * @returns {Promise<User>} returns user if creation is successful, error otherwise
 */
export const createUser: (userCreation: UserRegister, req: Request) => Promise<any> = async function(userCreation: UserRegister, req: Request): Promise<any> {
    //Validate user - username, password, and email
    const errors = validateUserGeneral(userCreation);
    if (errors.length > 0){
        throw new HttpError(errors);
    }

    const userTest: User[] = await getExistingUserEmail(userCreation);
    
    //if a user is returned, the username or the password are already taken
    // Check if the user exists first, since hashing and salting a password is expensive
    if(userTest.length){
        const userErrors: CustomError[] = [];
        userTest.forEach((user) => {
            if (user.username == userCreation.username){
                userErrors.push(fieldError("username", "username already exists"));
            }
            if (user.email == userCreation.email){
                userErrors.push(fieldError("email", "email already exists"));
            }
        })
        throw new HttpError(userErrors);
    }

    //create hashed bcrypt password
    const password = await createPassword(userCreation.password);
    const user: User = await User.create({username: userCreation.username.toLowerCase(), password: password, email: userCreation.email}).save();

    // set the cookie and login the user
    // regenerate to change ssid and prevent session fixation
    return await new Promise((res) => req.session.regenerate((err) => {
        req.session.userId = user!.id;
        res({user});
    }));
}

/**
 * @description Validate user login, user can log in with either username or email
 * @param {UserLogin} userLogin (username or email) and password
 * @param {Request} req Request object to set user id in cookie, logging user in
 * @returns {Promise<User>} user if valid, error otherwise 
 */
export const login: (userLogin: UserLogin, req: Request) => Promise<User> = async function(userLogin: UserLogin, req: Request): Promise<User> {
    //get user from db
    const user: User | undefined = await findUserEmail(userLogin);
    //username or email don't exist
    if (!user){
        if (userLogin.usernameOrEmail.includes("@")){
            throw new HttpError([fieldError("usernameOrEmail", "email doesn't exist")]);
        }
        else {
            throw new HttpError([fieldError("usernameOrEmail", "username doesn't exist")]);
        }
    }
    //Compare the user password with the password in the db
    const success = await comparePassword(userLogin.password, user.password);
    if (!success){
        throw new HttpError([fieldError("password", "incorrect password")]);
    }
    //set the cookie and login the user
    //regenerate to change ssid and prevent session fixation
    return await new Promise((res) => req.session.regenerate((err) => {
        req.session.userId = user!.id;
        res(user);
    }));
}

/**
 * @description used for debugging
 * @param {Request} req Request object containing user id in cookie
 * @returns {Promise<User>} user
 */
export const me: (req: Request) => Promise<User> = async function(req: Request): Promise<User> {
    const user: User | undefined = await findUser(req.session.userId);
    if(!user){
        throw new HttpError([fieldError("user", "Not logged in")]);
    }
    return user;
}

/**
 * @description Logout the user by clearing the cookie from redis and from the response
 * @param {Request} req Request object to destroy cookie from Redis
 * @param {Response} res Response object to clear cookie from
 * @returns {boolean} true if successful, false otherwise
 */
export const logout: (req: Request, res: Response) => Promise<boolean> = async function(req: Request, res: Response): Promise<boolean> {
    //req.session.destroy utilizes a callback, wait for callback by making use of promise
    //clear cookie from redis 
    return await new Promise(resolve => req.session.destroy((err) => {
        //clear cookie from response
        res.clearCookie(COOKIE_NAME);
        if (err){
            resolve(false);
        }
        resolve(true);
    }));
}

/**
 * @description Email a link to user to reset password
 * @param {string} email user's email
 * @returns {Promise<void>} void if successful, error otherwise
 */
export const forgotPassword: (email: string) => Promise<void> = async function (email: string): Promise<void> {
    const error = validateEmail(email);
    if (error){
        throw new HttpError([error]);
    }
    //check if email exists
    const user = await findEmail(email);
    if (!user){
        throw new HttpError([fieldError("user", "User doesn't exist")]);
    }

    let entryCheck: ForgotPassword | undefined = await ForgotPassword.findOne({where: {userid: user.id}});
    if (entryCheck){
        throw new HttpError([fieldError("token", "A token has already been generated for that account")]);
    }

    //Generate uuid token
    const token = v4();

    await sendEmailForgotPassword(email, `<a href="http://localhost:3000/change-password-email?token=${token}">Click here to change your password</a>`);

    //expires after 2 hours
    let expire = new Date();
    expire.setHours(expire.getHours() + 2);

    await createForgotPasswordToken(token, user, expire)
}

/**
 * @description Route for a user that has reset the password using the emailed link
 * @param {string} password new password
 * @param {string} token uuid token that relates a user to a forgotten password generated link 
 * @returns {Promise<User>} user if valid, error otherwise
 */
export const changePasswordEmail: (password: string, token: string) => Promise<User> = async function (password: string, token: string): Promise<User> {
    const error = validatePassword(password);
    if (error){
        throw new HttpError([error]);
    }

    //First check if any tokens are expired within the database, and delete if they are
    //Tokens are expired if 2 hours have passed
    await deleteExpiredForgotPasswordToken();

    //Get row in table that contains the same token
    const entry = await findForgotPasswordToken(token);

    //Either token was never generated or the token expired
    if (!entry){
        throw new HttpError([fieldError("token", "Token expired")]);
    }

    //Obtain the user
    const user = await User.findOne({where: {id: entry.userid}});

    if (!user){
        throw new HttpError([fieldError("token", "User no longer exists")]);
    }
    let hashedPassword: string;
    try {
        hashedPassword = await createPassword(password);
    }
    catch(err){
        throw new HttpError([fieldError("password", "unknown error creating password")]);
    }
    //update to new password
    await updateUserPassword(user, hashedPassword)

    //delete token in database
    await deleteForgotPasswordToken(user);

    return user;
}