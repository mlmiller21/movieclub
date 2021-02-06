import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/CustomErrors";

/**
 * @description Middleware to ensure that a user is editing <br>their own profile and not someone else
 * @param {Request} req contains userid within params
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const isUser: (req: Request, res: Response, next: NextFunction) => void = function (req: Request, res: Response, next: NextFunction) {
    const userid: number = +(req.params.userid as string);
    if (req.session.userId !== userid){
        let error = new HttpError([{field: "Unauthorized", message: "Unauthorized Attempt"}])
        error.status = 404;
        next(error);
    }
    else{
        next();
    }
}