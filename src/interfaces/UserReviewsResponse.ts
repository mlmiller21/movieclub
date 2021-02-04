import { Error } from "./Error";
import { PostedReview } from "./PostedReview";

export interface UserReviewsResponse {
    errors?: Error[],
    reviews?: PostedReview[]
}