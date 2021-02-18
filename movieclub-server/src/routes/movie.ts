import express, {NextFunction, Request, Response} from "express";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { movieExists } from "../middleware/movieExists";
import { validateFilterQuery } from "../middleware/validateFilterQuery";
import { isParamNaN } from "../middleware/isParamNaN";

import { createReview, getMovieReviews } from "../controllers/movieController";

const router = express.Router();

// Could seed the database potentially?

/**
 * Obtain all reviews for a movie
 * filter by 
 *  date (asc, desc)
 *  score (asc, desc)
 * default to date newest
 * add pagination
 * ?filter=date&sort=asc&page=1
 * returns 200 if reviews found or returned empty, 400 if invalid id
 * could return a 404 if movie doesn't exist, but it may not be appropriate for my particular use case, just leave as is
 */
router.get('/:movieid/reviews', validateFilterQuery, isParamNaN("movieid"), async (req: Request, res: Response, next: NextFunction) => {
    const {filter, sort, page, take} = req.query as {[key: string]: string};
    const movieid = +req.params.movieid;
    try{
        const reviews = await getMovieReviews({ filter, sort, skip: +page, take: +take}, movieid);
        res.status(200).json({reviews});
    }
    catch(err){
        next(err);
    }    
})

/**
 * Create a new review for a movie
 * If the movie entry doesn't exist, create the movie
 *  - Movie entry needs to be matched to opendb to prevent randoms from adding id
 *  - call api from within this route, match id and make sure it exists, then match the title of movie
 * returns 201 if review created, 400 if invalid id, titles don't match, or user has already created a review and 404 if movie doesn't exist
 */
router.post('/:movieid/review', isLoggedIn, isParamNaN("movieid"), movieExists, async (req: Request, res: Response, next: NextFunction) => {
    const {score, title, body, spoilers} = req.body;
    //movieExists validated that movieid is a valid number, allowing unary 
    const movieid = +req.params.movieid;

    try{
        await createReview({score, title, body, spoilers}, movieid, req);
        res.status(201).end();
    }
    catch(err){
        next(err);
    }
    
})


export default router;