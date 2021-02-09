import { Movie } from "../entities/Movie";

import { HttpError } from "../utils/CustomErrors";
import { fieldError } from "../utils/fieldError";


/**
 * @description find a movie by its id
 * @param {string} movieid
 * @returns {Promise<Movie | undefined>} movie if found, undefined otherwise
 */
export const findMovie: (movieid: string) => Promise<Movie | undefined> = async function(movieid: string): Promise<Movie | undefined>{
    try{
    return await Movie.findOne({where: {id: movieid}});
    }
    catch(err){
        throw new HttpError([fieldError("movie", "Unknown error")]);
    }
}

/**
 * @description create a movie
 * @param {number} id 
 * @param {string} title
 * @param {string} posterPath
 * @returns {Promise<void>} void
 */
export const createMovie: (id: number, title: string, posterPath: string) => Promise<void> = async function(id: number, title: string, posterPath: string): Promise<void>{
    await Movie.create({id, title, posterPath}).save();
}