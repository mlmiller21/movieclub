import express, {NextFunction, Request, Response} from "express";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { movieExists } from "../middleware/movieExists";
import { validateFilterQuery } from "../middleware/validateFilterQuery";
import { isParamNaN } from "../middleware/isParamNaN";

import { createReview, getMovieReviews } from "../controllers/movieController";

import { HttpError } from "../utils/CustomErrors";
import { fieldError } from "../utils/fieldError";

const router = express.Router();

// Could seed the database potentially?

/**
 * Create a new review for a movie
 * If the movie entry doesn't exist, create the movie
 *  - Movie entry needs to be matched to opendb to prevent randoms from adding id
 *  - call api from within this route, match id and make sure it exists, then match the title of movie
 */
router.post('/:movieid/review', isLoggedIn, isParamNaN("movieid"), movieExists, async (req: Request, res: Response, next: NextFunction) => {
    const {score, title, body, spoilers} = req.body;
    //movieExists validated that movieid is a valid number, allowing unary 
    const movieid = +req.params.movieid;

    try{
        const review = await createReview({score, title, body, spoilers}, movieid, req);
        res.status(200).json({success: true, review});
    }
    catch(err){
        next(err);
    }
    
})

/**
 * Obtain all reviews for a movie
 * filter by 
 *  date (asc, desc)
 *  score (asc, desc)
 * default to date newest
 * add pagination
 * ?filter=date&sort=asc&page=1
 */
router.get('/:movieid/reviews', validateFilterQuery, isParamNaN("movieid"), async (req: Request, res: Response, next: NextFunction) => {
    const {filter, sort, page} = req.query as {[key: string]: string}
    const take = 5;
    const movieid = +req.params.movieid;
    try{
        const reviews = await getMovieReviews({ filter, sort, skip: +page, take}, movieid);
        res.status(200).json({success: true, reviews});
    }
    catch(err){
        next(err);
    }    
})

export default router;