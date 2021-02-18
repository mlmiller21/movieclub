import { User } from "../entities/User";
import { Review } from "../entities/Review";
import { Movie } from "../entities/Movie";

import { findUser } from "../database/auth"
import { deleteUserDB, getPaginatedUserReviews, updatePassword, updateUserDetails } from "../database/user";
import { getUserWatchlist, createWatchlistMovie, deleteWatchlistMovie } from "../database/watchlist";
import { getUserFavourites, createFavouriteMovie, deleteFavouriteMovie } from "../database/favourites";
import { deleteUserReview, editUserReview, findUserReview } from "../database/review";

import { UserProfileEdit } from "../interfaces/UserEdit";
import { UserGeneral } from "../interfaces/UserGeneral";
import { CustomError } from "../interfaces/CustomError";
import { ReviewFilter } from "../interfaces/ReviewFilter";
import { UserReview } from "../interfaces/UserReview";

import { createPassword, comparePassword } from "../utils/password";
import { fieldError } from "../utils/fieldError";
import { validatePassword } from "../utils/validatePassword";
import { validateUserGeneral } from "../utils/validateUserGeneral";
import { HttpError } from "../utils/CustomErrors";

import { Request, Response } from "express";
import { InsertResult } from "typeorm";


/**
 * @description Edit user properties such as firstname, last name, etc
 * @param {UserProfileEdit} userEdit user properties to edit
 * @param {string} userId
 * @returns {Promise<User>} error if invalid, user otherwise
 */
export const editProfile: (userEdit: UserProfileEdit, userId: string) => Promise<User> = async function(userEdit: UserProfileEdit, userId: string): Promise<User> {
    const errors: CustomError[] = [];
    if (userEdit.firstName.length > 50 || userEdit.lastName.length > 50){
        errors.push(fieldError("name", "Name too long"));
    }

    if(errors.length > 0){
        throw new HttpError(errors);
    }
    //no validation errors, update user 

    let user: User = await updateUserDetails(userEdit, userId);

    if (!user){
        throw new HttpError([fieldError("Error", "Unknown Error")]);
    }

    return user;
}

/**
 * @description Edit username and email, requires user to enter password to update
 * @param {UserGeneral} userGeneral username, email, and password
 * @param {string} userId
 * @returns {Promise<User>} error if invalid, user otherwise
 */
export const updateUserGeneral: (userGeneral: UserGeneral, userId: string) => Promise<User> = async function(userGeneral: UserGeneral, userId: string): Promise<User> {
    // validate input
    const errors = validateUserGeneral(userGeneral);
    if (errors.length > 0){
        throw new HttpError(errors);
    }
    //obtain the user
    const user: User | undefined = await User.findOne({where: {id: userId}})

    //Compare the user password with the password in the db
    const success = await comparePassword(userGeneral.password, user!.password);
    if (!success){
        throw new HttpError([fieldError("password", "Incorrect password")], 401);
    }
    //everything good, update user
    try {
        await User.update({id: userId}, {username: userGeneral.username, email: userGeneral.email})
    }
    catch(err) {
        if (err.code === "23505"){
            if (err.detail.includes("username")){
                throw new HttpError([fieldError("username", "Username already exists")])
            }
            if (err.detail.includes("email")){
                throw new HttpError([fieldError("email", "Email already exists")])
            }
        }
    }

    user!.username = userGeneral.username;
    user!.email = userGeneral.email;
    
    return user!;
}

/**
 * @description Change password of user, first make sure oldpassword is correct then update to new password
 * @param {string} password new password
 * @param {Request} req Request object containing user id
 * @returns {Promise<void>} void if valid, error otherwise
 */
export const changePassword: (oldPassword: string, newPassword: string, userId: string) => Promise<void> = async function(oldPassword: string, newPassword: string, userId: string): Promise<void> {
    //obtain the user
    const user: User | undefined = await findUser(userId);
    //user doesn't exist
    if (!user){
        throw new HttpError([fieldError("user", "User doesn't exist")], 404);
    }
    //validate the new password
    const error = validatePassword(newPassword);
    if(error){
        throw new HttpError([error])
    }

    //Compare the user password with the password in the db
    const success = await comparePassword(oldPassword, user.password);
    if (!success){
        throw new HttpError([fieldError("password", "Incorrect password")], 401)
    }
    const hashedPassword = await createPassword(newPassword);
    try {
        await updatePassword(hashedPassword, userId);
    }
    catch(err){
        throw new HttpError([fieldError("Error", "Unknown Error")])
    }
}

/**
 * @description return user by id
 * @param userid 
 */
export const getUser: (userid: string) => Promise<User> = async function(userid: string): Promise<User> {
    try{
        const user: User | undefined = await findUser(userid);
        return user!;
    }
    catch(err){
        throw new HttpError([fieldError("error", "Unknown Error")]);
    }
}

/**
 * @description get paginated result of reviews for that movie
 * @param {ReviewFilter} reviewFilter 
 * @param {number} movieId 
 * @returns {Promise<Review[]>} array of reviews, if none returned then array is empty
 */
export const getUserReviews: (reviewFilter: ReviewFilter, userId: string) => Promise<Review[]> = async function(reviewFilter: ReviewFilter, userId: string): Promise<Review[]> {
    try{
        const reviews: Review[] = await getPaginatedUserReviews(reviewFilter, userId);
        return reviews;
    }
    catch(err){
        throw new HttpError([fieldError("userid", "Invalid user id")])
    }
}

/**
 * @description return watchlist of user
 * @param {string} userId 
 * @returns {Promise<Watchlist[]>} array of watchlist, empty if none returned
 */
export const getWatchlist: (userId: string) => Promise<Movie[]> = async function(userId: string): Promise<Movie[]> {
    try{
        const watchlist: Movie[] = await getUserWatchlist(userId);
        return watchlist;
    }
    catch(err){
        throw new HttpError([fieldError("error", "Unknown Error")])
    }
    
}

/**
 * @description insert a movie into the user's watchlist
 * @param {number} movieId 
 * @param {string} userId 
 * @returns {Promise<Movie>} inserted movie, or error
 */
export const createWatchlistEntry: (movieId: number, userId: string) => Promise<Movie> = async function(movieId: number, userId: string): Promise<Movie> {
    let watchlist: InsertResult;
    try{
        watchlist = await createWatchlistMovie(movieId, userId);
    }
    catch(err){
        throw new HttpError([fieldError("watchlist", "Movie already added")]);
    }
    const movie: Movie | undefined = await Movie.findOne({where: {id: watchlist.identifiers[0].movieId}});
    return movie!;
}

/**
 * @description delete movie from watchlist
 * @param {number} movieId 
 * @param {string} userId 
 * @returns {Promise<boolean>} true if delete, false if content doesn't exist
 */
export const deleteWatchlistEntry: (movieId: number, userId: string) => Promise<boolean> = async function(movieId: number, userId: string): Promise<boolean> {
    try{
        const row = await deleteWatchlistMovie(movieId, userId);
        if (row.affected === 0){
            return false;
        }
        return true;
    }
    catch(err){
        throw new HttpError([fieldError("error", "Unknown error")]);
    }
}

/**
 * @description return watchlist of user
 * @param {string} userId 
 * @returns {Promise<Favourites[]>} array of favourites, empty if none returned
 */
export const getFavourites: (userId: string) => Promise<Movie[]> = async function(userId: string): Promise<Movie[]> {
    try{
        const watchlist: Movie[] = await getUserFavourites(userId);
        return watchlist;
    }
    catch(err){
        throw new HttpError([fieldError("error", "Unknown error")]);
    }
    
}

/**
 * @description insert a movie into the user's watchlist
 * @param {number} movieId 
 * @param {string} userId
 * @returns {Promise<Movie>} inserted movie, or error
 */
export const createFavouriteEntry: (movieId: number, userId: string) => Promise<Movie> = async function(movieId: number, userId: string): Promise<Movie> {
    let favourites: InsertResult;
    try{
        favourites = await createFavouriteMovie(movieId, userId);
    }
    catch(err){
        throw new HttpError([fieldError("favourites", "Movie already added")]);
    }
    const movie: Movie | undefined = await Movie.findOne({where: {id: favourites.identifiers[0].movieId}});
    return movie!;
}

/**
 * @description delete movie from watchlist
 * @param {number} movieId 
 * @param {string} userId 
 * @returns {Promise<boolean>} true if delete, false if content doesn't exist
 */
export const deleteFavouritesEntry: (movieId: number, userId: string) => Promise<boolean> = async function(movieId: number, userId: string): Promise<boolean> {
    try{
        const row = await deleteFavouriteMovie(movieId, userId);
    if (row.affected === 0){
        return false;
    }
    return true;
    }
    catch(err){
        throw new HttpError([fieldError("watchlist", "Invalid movie id")]);
    }
}

/**
 * @description delete a review and update the movie's score 
 * @param {number} reviewId 
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const deleteReview: (reviewId: number, userId: string) => Promise<void> = async function(reviewId: number, userId: string): Promise<void> {
    const review: Review | undefined = await findUserReview(reviewId, userId);
    if(!review){
        throw new HttpError([fieldError('review', 'Review not found')])
    }
    try{
        await deleteUserReview(reviewId, review!.movieId, review!.score);
    }catch(err){
        throw new HttpError([fieldError("error", "Unknown error")]);
    }
}

/**
 * @description Edit a review and update the movie's score 
 * @param {UserReview} userReview 
 * @param {number} reviewId 
 * @param {string} userId
 * @returns {Promise<Review>} return the review that was edited, throws error if review doesn't exist
 */
export const editReview: (userReview: UserReview, reviewId: number, userId: string) => Promise<Review> = async function(userReview: UserReview, reviewId: number, userId: string): Promise<Review> {
    const review: Review | undefined = await findUserReview(reviewId, userId);
    if(!review){
        throw new HttpError([fieldError("review", "Review doesn't exist")], 404);
    }
    try{
        await editUserReview(reviewId, review.movieId, userReview, review.score);
        review.body = userReview.body;
        review.title = userReview.title; 
        review.score = userReview.score;
        review.spoilers = userReview.spoilers;
        return review;
    }
    catch(err){
        throw new HttpError([fieldError("error", "Unknown error")]);
    }
}

/**
 * @description delete a user and update each movie per review deleted
 * @param {Request} req containing user id
 * @returns {Promise<void>}
 */
export const deleteUser: (userId: string) => Promise<void> = async function(userId: string): Promise<void> {
    try{
        await deleteUserDB(userId);
    }
    catch(err){
        throw new HttpError([fieldError("error", "Unknown error")]);
    }
}
