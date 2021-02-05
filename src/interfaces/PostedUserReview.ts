export interface PostedUserReview {
    //movieid: the pk of the movie according to TMDB api
    movieid: number,
    //score: review score given by user
    score: number,
    //title: title of review given by user
    title: string,
    body: string,
    date: string
}