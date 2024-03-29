import { NextFunction, Request, Response } from "express";
import { getMovie } from "../api/Movie";
import { AxiosResponse } from 'axios';
import { Movie } from "../entities/Movie";
import { fieldError } from "../utils/fieldError";
import { HttpError } from "../utils/CustomErrors";
import { createMovie, findMovie } from "../database/movie";
import { __prod__ } from "src/constants";

/**
 * @description Middleware to verify that a movie exists
 * 
 * If a movie exists then check the titles match up, if they don't then throw an error
 * 
 * If a movie doesn't exist then verify that it exists within TMDB and then create an entry
 * 
 * This prevents filling the database with invalid movies. If the titles don't match or the movie doesn't exist, throw an error
 * 
 * 
 * @param {Request} req param contains movieid and body contains movie title and possibly the moveid if it's a post request
 * @param {Response} res 
 * @param {NextFunction} next 
 */

export const movieExists: (req: Request, res: Response, next: NextFunction) => void = async function (req: Request, res: Response, next: NextFunction) {
    const {movieTitle} = req.body;
    const movieid = !req.params.movieid ? req.body.movieid : req.params.movieid;
    //validate movieid
    if (isNaN(+movieid)){
        const error = new HttpError([fieldError("movie", "invalid id")]);
        return next(error);
    }
    // first check if it's in db
    let movie: Movie | undefined;
    try{
        movie = await findMovie(+movieid);
    }
    catch(err){
        return next(err);
    }
    //Movie doesn't exist, so create an entry in database
    if (!movie){
        let response: AxiosResponse;
        try {
            //Get response from TMDB
            response = await getMovie(movieid);
        }
        catch(err){
            //Movie doesn't exist within TMDB under the given id
            const error = new HttpError([fieldError("movie", "Movie doesn't exist")], 404);
            return next(error);
        }
        //Obtain the id and the title of the movie from the response
        const {data: {id: id, title: title, poster_path: poster_path }}: {data: {id: number, title: string, poster_path: string}} = response!;
        //If the inputted title doesn't match the title in TMDB, error occurs
        if (title != movieTitle){
            const error = new HttpError([fieldError("movie", "Titles don't match")]);
            next(error);
        }
        else{
            //No errors, create a movie entry in database
            await createMovie(id, movieTitle, poster_path);
            next();
        }
    }
    //Movie exists, so compare titles (again to make sure review is created under appropriate movie)
    else{
        if (movie!.title !== movieTitle){
            const error = new HttpError([fieldError("movie", "Titles don't match")]);
            next(error);
        }
        else{
            next();
        }
    }
}