import express, {NextFunction, Request, Response} from "express";

import { changePassword, editProfile, getUser, getUserReviews, updateUserGeneral, getFavourites, getWatchlist } from "../controllers/userController";

import {isLoggedIn} from "../middleware/isLoggedIn";
import { validateFilterQuery } from "../middleware/validateFilterQuery";
import {isUser} from "../middleware/isUser";

const router = express.Router();

const userAuth = [isLoggedIn, isUser];

//update user details
router.patch('/:userid/editProfile', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName} = req.body;
    try{
        const user = await editProfile({firstName, lastName}, req)
        res.status(200).json({success: true, user: user});
    }
    catch(err){
        next(err);
    }
})

//update username and email, must enter password 
router.post('/:userid/general', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;
    try {
        const user = await updateUserGeneral({username, email, password}, req);
        console.log(user);
        res.status(200).json({success: true, user: user});
    }
    catch(err){
        next(err);
    }
    
})

router.post('/:userid/change-password', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {oldPassword, newPassword} = req.body;
    try{
        await changePassword(oldPassword, newPassword, req);
        res.status(200).json({success: true});
    }
    catch(err){
        next(err);
    }
    
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
router.get('/:userid/reviews', validateFilterQuery, async (req: Request, res: Response, next: NextFunction) => {
    const {filter, sort, page} = req.query as {[key: string]: string}
    
    const take = 5;
    const userid = req.params.userid;

    try{
        const reviews = await getUserReviews({ filter, sort, skip: +page, take}, userid);
        res.status(200).json({success: true, reviews});
    }
    catch(err){
        next(err);
    }
})

/**
 * Get a user by their id
 */
router.get('/:userid', async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        const user = await getUser(userid);
        res.status(200).json({success: true, user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }
        });
    }
    catch(err){
        next(err);
    }
})


/**
 * Get a specific user's watchlist
 * TODO: Only accessed by user or user's friends if permissions set to private
 */
router.get('/:userid/watchlist', async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        const watchList = await getWatchlist(userid);
    }
    catch(err){
        next(err);
    }
})

/**
 * Add a movie to a user's watchlist
 * Only accessible by that same user
 */
router.post('/:userid/watchlist', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    
    console.log(req.query);
    res.end();0
})

/**
 * Get a specific user's favourites
 * TODO: Only accessed by user or user's friends if permissions set to private
 */
router.get('/:userid/favourites', async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        const watchList = await getFavourites(userid);
    }
    catch(err){
        next(err);
    }
})

/**
 * Add a movie to a user's favourites
 * Only accessible by that same user
 */
router.post('/:userid/favourites', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    res.end();
})

/**
 * Delete a user's review
 * user must be logged in, and review must belong to them
 */
router.delete('/:userid/review/:reviewid', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    res.end();
})

export default router;