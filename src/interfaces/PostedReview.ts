import { User } from "../entities/User";

export interface PostedReview {
    score: number,
    title: string,
    body: string,
    user: User
}