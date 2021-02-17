import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/CustomErrors";

/**
 * @description Middleware to ensure that a user is editing <br>their own profile and not someone else
 * @param {Request} req contains userid within params
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const isUser: (req: Request, res: Response, next: NextFunction) => void = function (req: Request, res: Response, next: NextFunction) {
    const userid: string = req.params.userid;
    if (req.session.userId !== userid){
        let error = new HttpError([{field: "Forbidden", message: "Unauthorized Attempt"}], 403)
        next(error);
    }
    else{
        next();
    }
}