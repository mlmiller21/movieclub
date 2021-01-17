import { User } from "../entities/User";
import { createPassword, comparePassword } from "../utils/password";
import { validateRegister } from "../utils/validateRegister";
import { fieldError } from "../utils/fieldError";
import { validateLogin } from "../utils/validateLogin";
import { UserRegister } from "../interfaces/UserRegister";
import { UserResponse } from "../interfaces/UserResponse";
import { UserLogin } from "../interfaces/UserLogin";
import {Request, Response} from "express";


//validate registration
export const createUser: (userCreation: UserRegister, req: Request) => Promise<UserResponse> = async function(userCreation: UserRegister, req: Request): Promise<UserResponse> {
    //Validate user - password, and email
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
    req.session.userId = user!.id;
    
    return { user };
    
}

//validate login
export const login: (userLogin: UserLogin, req: Request) => Promise<UserResponse> = async function(userLogin: UserLogin, req: Request): Promise<UserResponse> {

    //validate login - username or email, and password
    const errors = validateLogin(userLogin);
    if (errors){
        return errors;
    }
    //get user from db
    const user = await User.findOne({where: 
        userLogin.usernameOrEmail.includes("@") 
        ? {email: userLogin.usernameOrEmail} 
        : {username: userLogin.usernameOrEmail}}
        );
    //username or email already exist
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
    const success = await comparePassword(userLogin.password, user.password);
    if (!success){
        return {errors: [
            fieldError("password", "incorrect password")
        ]};
    }
    //set the cookie and login the user
    req.session.userId = user.id;
    
    return (user as UserResponse);
}

export const me: (req: Request) => Promise<UserResponse | null > = async function(req: Request): Promise<UserResponse | null> {
    if (!req.session.userId){
        return null;
    }
    const user: any = await User.findOne({where: {id: req.session.userId}})
    return user;
}