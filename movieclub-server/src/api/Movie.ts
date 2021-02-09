import axios, { AxiosResponse } from 'axios';
import { TMDB_KEY } from "../apikeys"

export const getMovie: (movieid: string) => Promise<AxiosResponse> = async function (movieid: string): Promise<AxiosResponse> {
    return await axios.get(`https://api.themoviedb.org/3/movie/${movieid}?api_key=${TMDB_KEY}`);
}