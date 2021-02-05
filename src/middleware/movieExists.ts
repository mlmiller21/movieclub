import { NextFunction, Request, Response } from "express";
import { getMovie } from "../api/Movie";
import { AxiosResponse } from 'axios';
import { Movie } from "../entities/Movie";
import { fieldError } from "../utils/fieldError";

/**
 * @description Middleware to verify that a movie exists
 * 
 * If a movie exists then do nothing
 * 
 * If a movie doesn't exist then verify that it exists within TMDB and then create an entry, this prevents filling the database with invalid movies
 * @param {Request} req param contains movieid and body contains movie title
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const movieExists: (req: Request, res: Response, next: NextFunction) => void = async function (req: Request, res: Response, next: NextFunction) {

    const {title} = req.body;
    const movieid = req.params.movieid;
    // first check if it's in db
    const movie: Movie | undefined = await Movie.findOne({where: {id: movieid}});
    //Movie doesn't exist, so create an entry in database
    if (!movie){
        let response: AxiosResponse;
        try {
            //Get response from TMDB
            response = await getMovie(movieid);
        }
        catch(err){
            //Movie doesn't exist within TMDB under the given id
            return res.status(404).json({success: false, movieResponse: fieldError("movie", "movie doesn't exist")});
        }
        //Obtain the id and the title of the movie from the response
        const {data: {id: id, original_title: movieTitle }} = response!;
        //If the inputted title doesn't match the title in TMDB, error occurs
        if (movieTitle != title){
            res.status(404).json({sucess: false, movieResponse: fieldError("movie", "titles don't match")});
        }
        else{
            //No errors, create a movie entry in database
            await Movie.create({id: id, title: title}).save();
            next();
        }
    }
    //Movie exists, so compare titles (again to make sure review is created under appropriate movie)
    else{
        if (movie!.title !== title){
            res.status(404).json({success: false, movieResponse: fieldError("movie", "titles don't match")});
        }
        else{
            next();
        }
    }
}