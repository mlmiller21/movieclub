import express, {Request, Response} from "express";
import {isLoggedIn} from "../middleware/isLoggedIn";
import {isUser} from "../middleware/isUser";
import { changePassword, editProfile, updateUserGeneral } from "../controllers/userController";

const router = express.Router();

const userAuth = [isLoggedIn, isUser];

//update user details
router.patch('/:userid/editProfile', userAuth, async (req: Request, res: Response) => {
    const {firstName, lastName} = req.body;
    const error = await editProfile({firstName, lastName}, req)
    if (error){
        res.status(400).json({success: false, error});
    }
    res.status(200).json({success: true});
})

//update username and email, must enter password 
router.post('/:userid/general', userAuth, async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    const error = await updateUserGeneral({username, email, password}, req);
    if (error){
        res.status(400).json({success: false, error});
    }
    res.status(200).json({success: true});
})

router.post('/:userid/change-password', userAuth, async (req: Request, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    const error = await changePassword(oldPassword, newPassword, req);
    if (error){
        res.status(400).json({success: false, error});
    }
    res.status(200).json({success: true});
})

/**
 * get reviews by a user
 * filter by 
 *  date (asc, desc)
 *  score (asc, desc)
 * default to date newest
 * add pagination
 * ?filter=date&sort=asc&page=1
 */
router.get('/:userid/reviews', userAuth, async (req: Request, res: Response) => {
    const reviews = await getUserReviews()
    console.log(req.query);
    res.end();
})

/**
 * Get a specific user's watchlist
 * TODO: Only accessed by user or user's friends if permissions set to private
 */
router.get('/:userid/watchlist', async (req: Request, res: Response) => {
    console.log(req.query);
    res.end();
})

/**
 * Add a movie to a user's watchlist
 * Only accessible by that same user
 */
router.post('/:userid/watchlist', async (req: Request, res: Response) => {
    console.log(req.query);
    res.end();0
})

/**
 * Get a specific user's favourites
 * TODO: Only accessed by user or user's friends if permissions set to private
 */
router.get('/:userid/favourites', async (req: Request, res: Response) => {
    console.log(req.query);
    res.end();
})

/**
 * Add a movie to a user's favourites
 * Only accessible by that same user
 */
router.post('/:userid/favourites', async (req: Request, res: Response) => {
    console.log(req.query);
    res.end();
})

/**
 * Delete a user's review
 * user must be logged in, and review must belong to them
 */
router.delete('/:userid/review/:reviewid', async (req: Request, res: Response) => {
    console.log(req.query);
    res.end();
})

export default router;