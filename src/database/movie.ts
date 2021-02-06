import { Movie } from "../entities/Movie";

/**
 * @description find a movie by its id
 * @param {string} movieid
 * @returns {Promise<Movie | undefined>} movie if found, undefined otherwise
 */
export const findMovie: (movieid: string) => Promise<Movie | undefined> = async function(movieid: string): Promise<Movie | undefined>{
    return await Movie.findOne({where: {id: movieid}});
}

/**
 * @description create a movie
 * @param {number} id 
 * @param {string} title
 * @returns {Promise<void>} void
 */
export const createMovie: (id: number, title: string) => Promise<void> = async function(id: number, title: string): Promise<void>{
    await Movie.create({id: id, title: title}).save();
}