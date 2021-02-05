import express, {Request, Response} from "express";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { movieExists } from "../middleware/movieExists";
import { changePassword, editProfile, updateUserGeneral } from "../controllers/userController";

const router = express.Router();

// Could seed the database potentially?

/**
 * Create a new review for a movie
 * If the movie entry doesn't exist, create the movie
 *  - Movie entry needs to be matched to opendb to prevent randoms from adding id
 *  - call api from within this route, match id and make sure it exists, then match the title of movie
 */
router.post('/:movieid/review', isLoggedIn, movieExists, async (req: Request, res: Response) => {
    const {score, title, body, spoiler} = req.body;

    res.json({...req.body})
    
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