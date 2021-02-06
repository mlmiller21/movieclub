import { Review } from "../entities/Review";

import { ReviewFilter } from "../interfaces/ReviewFilter";
import { UserReviewsResponse } from "src/interfaces/UserReviewsResponse";

import { fieldError } from "../utils/fieldError";

import { Request, Response } from "express";

import { getConnection } from "typeorm";


/**
 * get reviews by a user
 * filter by 
 *  date (asc, desc)
 *  score (asc, desc)
 * default to date newest
 * add pagination
 * ?filter=date&sort=asc&page=1
 */
// export const getUserReviews: (reviewFilter: ReviewFilter, req: Request) => Promise<UserReviewsResponse> = async function(reviewFilter: ReviewFilter, req: Request): Promise<UserReviewsResponse> {
//     //You basically just want to make sure you return the reviews here
//     //maybe set permissions? -> has to be done in db, set permission onto user itself
//     //just do a query in typeorm
//     //getrepository 
//     //const reviews = await getConnection().getRepository(Review).findAndCount({where: })
//     return {reviews: [{movieid: 1, score: 1, title: "", body: "", date: ""}]}
// }