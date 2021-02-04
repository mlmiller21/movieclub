import { NextFunction, Request, Response } from "express";

/**
 * Middleware to ensure that a user is editing their own profile and not someone else
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const isUser: (req: Request, res: Response, next: NextFunction) => void = function (req: Request, res: Response, next: NextFunction) {
    const userid: number = parseInt(req.query.userid as string);
    if (req.session.userId !== userid){
        res.status(401).send({isUser: false})
    }
    else{
        next();
    }
}