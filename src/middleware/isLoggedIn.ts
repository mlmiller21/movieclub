import { NextFunction, Request, Response } from "express";

/**
 * Middleware to validate if a user is logged in 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const isLoggedIn: (req: Request, res: Response, next: NextFunction) => void = function (req: Request, res: Response, next: NextFunction) {
    if (!req.session.userId){
        //res.status(401).send();
        res.status(401).send({isLoggedIn: false})
    }
    else{
        next();
    }
}