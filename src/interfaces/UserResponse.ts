import { User } from "../entities/User";
import { Error } from "./Error";

export interface UserResponse {
    errors?: Error[],
    user?: User
}