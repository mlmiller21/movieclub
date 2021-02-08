import express, {NextFunction, Request, Response} from "express";

import { changePassword, editProfile, getUser, getUserReviews,
    updateUserGeneral, getFavourites, getWatchlist, createWatchlistEntry,
    createFavouriteEntry, deleteWatchlistEntry, deleteFavouritesEntry, deleteReview, editReview, deleteUser } from "../controllers/userController";

import {isLoggedIn} from "../middleware/isLoggedIn";
import { validateFilterQuery } from "../middleware/validateFilterQuery";
import {isUser} from "../middleware/isUser";
import { movieExists } from "../middleware/movieExists";
import { isParamNaN } from "../middleware/isParamNaN";

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
        const watchlist = await getWatchlist(userid);
        res.status(200).json({success: true, watchlist})
    }
    catch(err){
        next(err);
    }
})

/**
 * Add a movie to a user's watchlist
 * Only accessible by that same user
 * req.body conatins movieTitle and movieid
 */
router.post('/:userid/watchlist', userAuth, movieExists, async (req: Request, res: Response, next: NextFunction) => {
    const {movieTitle, movieid}: {movieTitle: string, movieid: number} = req.body;

    try{
        const movie = await createWatchlistEntry(movieid, req);
        res.status(200).json({success: true, movie});
    }
    catch(err){
        next(err);
    }
})

/**
 * Delete a movie from a user's watchlist
 * user must be logged in, and movie must belong to them
 */
router.delete('/:userid/watchlist/:movieid', userAuth, isParamNaN("movieid"), async (req: Request, res: Response, next: NextFunction) => {
    const movieid = +req.params.movieid;
    try{
    const success = await deleteWatchlistEntry(movieid, req)
    res.status(success? 200 : 204).json({success});
    }
    catch(err){
        next(err);
    }
})

/**
 * Get a specific user's favourites
 * TODO: Only accessed by user or user's friends if permissions set to private
 */
router.get('/:userid/favourites', async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        const favourites = await getFavourites(userid);
        res.status(200).json({success: true, favourites})
    }
    catch(err){
        next(err);
    }
})

/**
 * Add a movie to a user's favourites
 * Only accessible by that same user
 */
router.post('/:userid/favourites', userAuth, movieExists, async (req: Request, res: Response, next: NextFunction) => {
    const {movieTitle, movieid}: {movieTitle: string, movieid: number} = req.body;
    try{
        const movie = await createFavouriteEntry(movieid, req);
        res.status(200).json({success: true, movie});
    }
    catch(err){
        next(err);
    }
})

/**
 * Delete a movie from a user's favourites list
 * Only accessile by that same user
 */
router.delete('/:userid/favourites/:movieid', userAuth, isParamNaN("movieid"), async (req: Request, res: Response, next: NextFunction) => {
    const movieid = +req.params.movieid;
    try{
        const success = await deleteFavouritesEntry(movieid, req)
        res.status(success ? 200 : 204).json({success});
    }
    catch(err){
        next(err);
    }
})

/**
 * Delete a user's review
 * user must be logged in, and review must belong to them
 */
router.delete('/:userid/review/:reviewid', userAuth, isParamNaN("reviewid"), async (req: Request, res: Response, next: NextFunction) => {
    const reviewid = +req.params.reviewid;
    try{
        const success = await deleteReview(reviewid, req);
        res.status(success ? 200: 204).json({success});
    }
    catch(err){
        next(err);
    }
})

//edit a review
router.patch('/:userid/review/:reviewid', userAuth, isParamNaN("reviewid"), async (req: Request, res: Response, next: NextFunction) => {
    const {score, title, body, spoilers} = req.body;
    const reviewid = +req.params.reviewid;
    console.log(reviewid);
    try{
        const review = await editReview({score, title, body, spoilers}, reviewid, req);
        res.status(200).json({success: true, review});
    }
    catch(err){
        next(err);
    }
})

//delete a user
router.delete('/:userid', userAuth, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const review = await deleteUser(req);
        res.status(200).json({success: true, review});
    }
    catch(err){
        next(err);
    }
})

//add a friend

//delete a friend

export default router;