import { Request, Response, NextFunction } from "express";

/**
 * @description middleware to validate that query params are passed in, and fix any invalid inputs
 * @param req contains query objects filter, sort, page, and take
 * @param res 
 * @param next 
 */
export const validateFilterQuery: (req: Request, res: Response, next: NextFunction) => void = function (req: Request, res: Response, next: NextFunction) {
    //if not date or score, then set to date by default
    req.query.filter = req.query.filter === 'date' || req.query.filter == 'score' ? req.query.filter : 'date';
    //if not asc or desc, then set to desc by default
    req.query.sort = req.query.sort === ('asc' || 'desc') ? req.query.sort : 'desc';
    //if undefined or invalid input, default to 0
    req.query.page = req.query.page !== undefined ? (isNaN(+req.query.page) ? '0' : req.query.page) : '0';
    //if undefined or invalid, default to 10
    req.query.take = req.query.take !== undefined ? (isNaN(+req.query.take) ? '10' : req.query.take) : '10';
    next();
}