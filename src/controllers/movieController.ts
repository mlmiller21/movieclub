import { Review } from "../entities/Review";
import { Movie } from "../entities/Movie";

import { PostedUserReview } from "../interfaces/PostedUserReview";
import { ReviewFilter } from "../interfaces/ReviewFilter";
import { UserReviewsResponse } from "src/interfaces/UserReviewsResponse";

import { fieldError } from "../utils/fieldError";

import { Request, Response } from "express";

import { getConnection } from "typeorm";