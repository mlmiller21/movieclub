import { User } from "../entities/User";
import { ForgotPassword } from "../entities/ForgotPassword";
import { createPassword, comparePassword } from "../utils/password";
import { validateRegister } from "../utils/validateRegister";
import { fieldError } from "../utils/fieldError";
import { validatePassword } from "../utils/validatePassword";
import { UserRegister } from "../interfaces/UserRegister";
import { UserResponse } from "../interfaces/UserResponse";
import { UserLogin } from "../interfaces/UserLogin";
import {Request, Response} from "express";
import { COOKIE_NAME } from "../constants";
import { UserProfileEdit } from "../interfaces/UserEdit";
import { validateEmail } from "../utils/validateEmail";
import { sendEmailForgotPassword } from "../utils/email";
import { v4 } from "uuid";
import { getConnection } from "typeorm";
import { validateUsername } from "../utils/validateUsername";


/**
 * Create a new User, username is saved in lowercase but displayed based on how user inputs it
 * @param userCreation {UserRegister} username, password, and email inputted by user
 * @param {Request} req object to set user id in cookie, logging user in
 * @returns {Promise<UserResponse>} returns user if creation is successful, error otherwise
 */
export const createUser: (userCreation: UserRegister, req: Request) => Promise<UserResponse> = async function(userCreation: UserRegister, req: Request): Promise<UserResponse> {
    //Validate user - username, password, and email
    const errors = validateRegister(userCreation);
    if (errors){
        return errors;
    }
    //create hashed bcrypt password
    const password = await createPassword(userCreation.password);

    let user: User | undefined;
    try {
        user = await User.create({username: userCreation.username.toLowerCase(), password: password, email: userCreation.email}).save();
    } 
    catch (err){
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
    
    //set the cookie and login the user
    //regenerate to change ssid and prevent session fixation
    return await new Promise((res) => req.session.regenerate((err) => {
        req.session.userId = user!.id;
        res({user});
    }));
}

/**
 * Validate user login, user can log in with either username or email
 * @param {UserLogin} userLogin (username or email) and password
 * @param {Request} req Request object to set user id in cookie, logging user in
 * @returns {Promise<UserResponse>} user if valid, error otherwise 
 */
export const login: (userLogin: UserLogin, req: Request) => Promise<UserResponse> = async function(userLogin: UserLogin, req: Request): Promise<UserResponse> {
    //get user from db 
    const user = await User.findOne({where: 
        userLogin.usernameOrEmail.includes("@") 
        ? {email: userLogin.usernameOrEmail} 
        : {username: userLogin.usernameOrEmail}}
        );
    //username or email don't exist
    if (!user){
        if (userLogin.usernameOrEmail.includes("@")){
            return {errors: [
                fieldError("usernameOrEmail", "email doesn't exist")
            ]};
        }
        else {
            return {errors: [
                fieldError("usernameOrEmail", "username doesn't exist")
            ]};
        }
    }
    //Compare the user password with the password in the db
    const success = await comparePassword(userLogin.password, user.password);
    if (!success){
        return {errors: [
            fieldError("password", "incorrect password")
        ]};
    }
    //set the cookie and login the user
    //regenerate to change ssid and prevent session fixation
    return await new Promise((res) => req.session.regenerate((err) => {
        req.session.userId = user!.id;
        res({user: user});
    }));
}

/**
 * used for debugging
 * @param {Request} req Request object containing user id in cookie
 * @returns {UserResponse} user
 */
export const me: (req: Request) => Promise<UserResponse > = async function(req: Request): Promise<UserResponse> {
    const user: any = await User.findOne({where: {id: req.session.userId}})
    return {user};
}

/**
 * Logout the user by clearing the cookie from redis and from the response
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
 * Edit user properties such as firstname, last name, etc
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
    await User.update({id: req.session.userId}, {firstName: userEdit.firstName, lastName: userEdit.lastName});

    return null;
}

/**
 * Email a link to user to reset password
 * @param {string} email user's email
 * @returns {Promise<UserResponse>} user if valid, error otherwise
 */
export const forgotPassword: (email: string) => Promise<UserResponse> = async function (email: string): Promise<UserResponse> {
    const error = validateEmail(email);
    if (error){
        return error;
    }
    //check if email exists
    const user = await User.findOne({where: {email}});
    if (!user){
        return {errors: [
            fieldError("email", "email doesn't exist")
        ]};
    }

    //Generate uuid token
    const token = v4();

    //expires after 2 hours
    let expire = new Date();
    expire.setHours(expire.getHours() + 2);

    let entry: ForgotPassword;
    try {
        entry = await ForgotPassword.create({token: token, userid: user.id, expires: expire}).save();
    }
    catch (err){
        if (err.code === "23505"){
            if (err.detail.includes("userid")){
                return {errors: [
                    fieldError("token", "A token has already been generated for that account")
                ]};
            }
        }
    }

    await sendEmailForgotPassword(email, `<a href="http://localhost:3000/change-password-email?token=${token}">Click here to change your password</a>`);

    return {user};
}

/**
 * Route for a user that has reset the password using the emailed link
 * @param {string} password new password
 * @param {string} token uuid token that relates a user to a forgotten password generated link 
 * @returns {Promise<UserResponse>} user if valid, error otherwise
 */
export const changePasswordEmail: (password: string, token: string) => Promise<UserResponse> = async function (password: string, token: string): Promise<UserResponse> {
    const error = validatePassword(password);
    if (error){
        return error;
    }

    //First check if any tokens are expired within the database, and delete if they are
    //Tokens are expired if 2 hours have passed

    await getConnection().createQueryBuilder().delete().from(ForgotPassword).where('expires <= :currentDate', {currentDate: new Date()}).execute();

    //Get row in table that contains the same token
    const entry = await ForgotPassword.findOne({where: {token}});
    //Either token was never generated or the token expired
    if (!entry){
        return {errors: [
            fieldError("token", "Token expired")
        ]};
    }

    //Obtain the user
    const user = await User.findOne({where: {id: entry.userid}});

    if (!user){
        return {errors: [
            fieldError("token", "User no longer exists")
        ]};
    }
    let hashedPassword: string;
    try {
        hashedPassword = await createPassword(password);
    }
    catch(err){
        return {errors: [
            fieldError("password", "unknown error creating password")
        ]};
    }
    //update to new password
    await User.update({id: user!.id}, {password: hashedPassword});
    //delete token in database
    await ForgotPassword.delete({userid: user!.id})

    return {user};
}

/**
 * Change password of user
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
 * Change username of user
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
    await User.update({id: req.session.userId}, {username: username});
    return {user};
}