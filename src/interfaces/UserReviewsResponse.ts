import { Error } from "./Error";
import { PostedUserReview } from "./PostedUserReview";

export interface UserReviewsResponse {
    errors?: Error[],
    reviews?: PostedUserReview[]
}