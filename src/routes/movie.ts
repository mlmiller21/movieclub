import express, {Request, Response} from "express";
import {isLoggedIn} from "../middleware/isLoggedIn";
import {isUser} from "../middleware/isUser";
import { changePassword, editProfile, updateUserGeneral } from "../controllers/userController";

const router = express.Router();

/**
 * Create a new movie entry
 */
router.post('/', isLoggedIn, async (req: Request, res: Response) => {

})

/**
 * Create a new review for a movie
 * If the movie entry doesn't exist, create the movie
 *  - Movie entry needs to be matched to opendb to prevent randoms from adding id
 *  - call api from within this route, match id and make sure it exists, then match the title of movie
 * Could seed the database potentially?
 */
router.post('/:movieid/review', isLoggedIn, async (req: Request, res: Response) => {

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

    /**
     * Create new review for a movie
     */
    // app.post('/review/:movieid', async (req: Request, res: Response) => {

    // })

    /**
     * paginate
     * get reviews for a movie
     * filter by 
     *  date (newest, oldest)
     *  score (highest, lowest)
     * default to date newest
     */
    // app.get('/reviews/:movieid', async (req: Request, res: Response) => {

    // })