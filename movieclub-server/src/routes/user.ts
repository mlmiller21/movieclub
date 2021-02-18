import express, {NextFunction, Request, Response} from "express";

import { changePassword, editProfile, getUser, getUserReviews,
    updateUserGeneral, getFavourites, getWatchlist, createWatchlistEntry,
    createFavouriteEntry, deleteWatchlistEntry, deleteFavouritesEntry, deleteReview, editReview, deleteUser } from "../controllers/userController";

import {isLoggedIn} from "../middleware/isLoggedIn";
import { validateFilterQuery } from "../middleware/validateFilterQuery";
import {isUser} from "../middleware/isUser";
import { movieExists } from "../middleware/movieExists";
import { isParamNaN } from "../middleware/isParamNaN";
import { userExists } from "../middleware/userExists";

const router = express.Router();

// return 401 if not logged in and 403 if not authorized to access endpoint
const userAuth = [isLoggedIn, isUser];

//update user details
//returns 200 if successfully updated, 400 if validation error or unknown error, and 404 if user not found
router.patch('/:userid/edit-profile', userExists, userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName} = req.body;
    const userid = req.params.userid;
    try{
        const user = await editProfile({firstName, lastName}, userid)
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName
        });
    }
    catch(err){
        next(err);
    }
})

//update username and email, must enter password 
//return 200 if updated, 401 if password incorrect, 404 if user doesn't exist
router.patch('/:userid/general', userExists, userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;
    const userid = req.params.userid;
    try {
        const user = await updateUserGeneral({username, email, password}, userid);
        res.status(200).json({
            username: user.username,
            email: user.email
        });
    }
    catch(err){
        next(err);
    }
    
})

//change a user's password, 200 if password changed, 400 if password validation error or unknown error, 401 if incorrect password, 404 if user doesn't exist
router.post('/:userid/change-password', userExists, userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {oldPassword, newPassword} = req.body;
    const userid = req.params.userid;
    try{
        await changePassword(oldPassword, newPassword, userid);
        res.status(200).end();
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
 * return 200 if reviews found or empty reviews, 400 if invalid user id, 404 if user doesn't exist
 */
router.get('/:userid/reviews', userExists, validateFilterQuery, async (req: Request, res: Response, next: NextFunction) => {
    const {filter, sort, page, take} = req.query as {[key: string]: string}
    const userid = req.params.userid;
    try{
        const reviews = await getUserReviews({ filter, sort, skip: +page, take: +take}, userid);
        res.status(200).json({reviews});
    }
    catch(err){
        next(err);
    }
})

/**
 * Get a user by their id
 * return 200 if user found, 400 if invalid user id or unknown error, 404 if user doesn't exist
 */
router.get('/:userid', userExists, async (req: Request, res: Response, next: NextFunction) => {
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
 * TODO: Only accessed by user or user's friends if permissions set to private?
 * returns 200 if watchlist found, may be empty, 400 if invalid user id or unknown error, 404 if user not found
 */
router.get('/:userid/watchlist', userExists, async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        const watchlist = await getWatchlist(userid);
        res.status(200).json({watchlist})
    }
    catch(err){
        next(err);
    }
})

/**
 * Add a movie to a user's watchlist
 * Only accessible by that same user
 * req.body contains movieTitle and movieid
 * return 201 if movie added to watchlist, 400 if invalid user or movie already added, 404 if user not found or movie not found
 */
router.post('/:userid/watchlist', userExists, userAuth, movieExists, async (req: Request, res: Response, next: NextFunction) => {
    const {movieTitle, movieid}: {movieTitle: string, movieid: number} = req.body;
    const userid = req.params.userid;

    try{
        const movie = await createWatchlistEntry(movieid, userid);
        res.status(201).end();
    }
    catch(err){
        next(err);
    }
})

/**
 * Delete a movie from a user's watchlist
 * user must be logged in, and movie must belong to them
 * returns 200 if successful, 400 if invalid user id or unknwon error, 404 if user doesn't exist or watchlist entry doesn't exist
 */
router.delete('/:userid/watchlist/:movieid', userExists, userAuth, isParamNaN("movieid"), async (req: Request, res: Response, next: NextFunction) => {
    const movieid = +req.params.movieid;
    const userid = req.params.userid;
    try{
    const success = await deleteWatchlistEntry(movieid, userid)
    res.status(success? 200 : 404).end();
    }
    catch(err){
        next(err);
    }
})

/**
 * Get a specific user's favourites
 * TODO: Only accessed by user or user's friends if permissions set to private
 * returns 200 if successful, 400 if unknown error or invalid user id, 404 if user doesn't exist, 
 */
router.get('/:userid/favourites', userExists, async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        const favourites = await getFavourites(userid);
        res.status(200).json({favourites})
    }
    catch(err){
        next(err);
    }
})

/**
 * Add a movie to a user's favourites
 * Only accessible by that same user
 * returns 201 if successful, 400 if unknown error or movie already exists, 404 if user doesn't exist
 */
router.post('/:userid/favourites', userExists, movieExists, userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const {movieTitle, movieid}: {movieTitle: string, movieid: number} = req.body;
    const userid = req.params.userid;
    try{
        const movie = await createFavouriteEntry(movieid, userid);
        res.status(201).end();
    }
    catch(err){
        next(err);
    }
})

/**
 * Delete a movie from a user's favourites list
 * Only accessile by that same user
 * 200 if successful, 204 if not affected, 400 if invalid user id or invalid movieid, 404 if user doesn't exist or favourites entry doesn't exist
 */
router.delete('/:userid/favourites/:movieid', userExists, userAuth, isParamNaN("movieid"), async (req: Request, res: Response, next: NextFunction) => {
    const movieid = +req.params.movieid;
    const userid = req.params.userid;
    try{
        const success = await deleteFavouritesEntry(movieid, userid)
        res.status(success ? 200 : 404).end();
    }
    catch(err){
        next(err);
    }
})

/**
 * Delete a user's review
 * user must be logged in, and review must belong to them
 * Returns 200 if successul, 400 if invalid reviewid or invalid user id, 404 if user or review don't exist
 */
router.delete('/:userid/review/:reviewid', userExists, userAuth, isParamNaN("reviewid"), async (req: Request, res: Response, next: NextFunction) => {
    const reviewid = +req.params.reviewid;
    const userid = req.params.userid;
    try{
        await deleteReview(reviewid, userid);
        res.status(200).end();
    }
    catch(err){
        next(err);
    }
})

//edit a review
//200 if updated, 400 if invalid review id, user id or unknown error, 404 if user or review doesn't exist
router.patch('/:userid/review/:reviewid', userExists, userAuth, isParamNaN("reviewid"), async (req: Request, res: Response, next: NextFunction) => {
    const {score, title, body, spoilers} = req.body;
    const reviewid = +req.params.reviewid;
    const userid = req.params.userid;
    try{
        const review = await editReview({score, title, body, spoilers}, reviewid, userid);
        res.status(200).json({review});
    }
    catch(err){
        next(err);
    }
})

//delete a user
//200 if deleted, 400 if invalid user id or unknown error, 404 if user doesn't exist
router.delete('/:userid', userExists, userAuth, async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try{
        await deleteUser(userid);
        res.status(200).end();
    }
    catch(err){
        next(err);
    }
})

export default router;