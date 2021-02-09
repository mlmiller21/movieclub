import { Request, Response, NextFunction } from "express";

import { HttpError } from "../utils/CustomErrors";
import { fieldError } from "../utils/fieldError";

export const isParamNaN: (param: string) => any = function(param: string): any {
    return function(req: Request, res: Response, next: NextFunction){
        if (isNaN(+(req.params[param]))){
            const error = new HttpError([fieldError(param, "invalid id")]);
            next(error);
        }
        next();
    }
}