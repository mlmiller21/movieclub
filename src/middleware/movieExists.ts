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
 * @param {Request} req param contains movieid and body contains movie title
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const movieExists: (req: Request, res: Response, next: NextFunction) => void = async function (req: Request, res: Response, next: NextFunction) {

    const {title} = req.body;
    const movieid = req.params.movieid;
    // first check if it's in db
    const movie: Movie | undefined = await findMovie(movieid);
    //Movie doesn't exist, so create an entry in database
    if (!movie){
        let response: AxiosResponse;
        try {
            //Get response from TMDB
            response = await getMovie(movieid);
        }
        catch(err){
            //Movie doesn't exist within TMDB under the given id
            const error = new HttpError([fieldError("movie", "Movie doesn't exist")]);
            next(error);
        }
        //Obtain the id and the title of the movie from the response
        const {data: {id: id, original_title: movieTitle }}: {data: {id: number, original_title: string}} = response!;
        //If the inputted title doesn't match the title in TMDB, error occurs
        if (movieTitle != title){
            const error = new HttpError([fieldError("movie", "Titles don't match")]);
            next(error);
        }
        else{
            //No errors, create a movie entry in database
            await createMovie(id, title);
            next();
        }
    }
    //Movie exists, so compare titles (again to make sure review is created under appropriate movie)
    else{
        if (movie!.title !== title){
            const error = new HttpError([fieldError("movie", "Titles don't match")]);
            next(error);
        }
        else{
            next();
        }
    }
}