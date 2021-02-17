import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/CustomErrors";

/**
 * @description Middleware to validate if a user is logged in 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const isLoggedIn: (req: Request, res: Response, next: NextFunction) => void = function (req: Request, res: Response, next: NextFunction) {
    if (!req.session.userId){
        let error = new HttpError([{field: "Unauthorized", message: "Must be logged in to access"}], 401)
        next(error);
    }
    else{
        next();
    }
}