import express, {NextFunction, Request, Response} from "express";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { movieExists } from "../middleware/movieExists";

import { createReview } from "../controllers/movieController";

const router = express.Router();

// Could seed the database potentially?

/**
 * Create a new review for a movie
 * If the movie entry doesn't exist, create the movie
 *  - Movie entry needs to be matched to opendb to prevent randoms from adding id
 *  - call api from within this route, match id and make sure it exists, then match the title of movie
 */
router.post('/:movieid/review', isLoggedIn, movieExists, async (req: Request, res: Response, next: NextFunction) => {
    const {score, title, body, spoilers} = req.body;
    const movieid = parseInt(req.params.movieid);

    try{
        const review = await createReview({score, title, body, spoilers}, movieid, req);
        res.status(200).json({success: true, reviews: review.reviews});
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
router.get('/:movieid/reviews', async (req: Request, res: Response) => {
    
})

export default router;