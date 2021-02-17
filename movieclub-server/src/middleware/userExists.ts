import { User } from "../entities/User";

import { findUser } from "../database/auth";

import { HttpError } from "../utils/CustomErrors";
import { fieldError } from "../utils/fieldError";

import { NextFunction, Request, Response } from "express";

/**
 * @description Middleware to validate if a user exists
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const userExists: (req: Request, res: Response, next: NextFunction) => void = async function (req: Request, res: Response, next: NextFunction) {
    const userid = req.params.userid;
    try {
        const user: User | undefined = await findUser(userid);
        if (!user){
            const error = new HttpError([fieldError("user", "User doesn't exist")], 404);
            next(error);
        }
        else{
            next();
        }
    }
    catch(err){
        const error = new HttpError([fieldError("userid", "Invalid user id")], 400);
        next(error);
    }
    
}