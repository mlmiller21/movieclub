import { usernameRe } from "../regex"
import { fieldError } from "../utils/fieldError";
import { CustomError } from "src/interfaces/CustomError";

/**
 * validate username
 * @param {string} username 
 * @returns {CustomError | null} return CustomError if error, null otherwise
 */
export const validateUsername: (username: string) => CustomError | null = function(username: string): CustomError | null {
    //validate user
    //username can't be empty
    if (username.length <= 2) {
        return fieldError("username", "username length must be greater than 2")
    }
    //user can't be greater than 50
    if (username.length > 50) {
        return fieldError("username", "length must be less than 51")
    }
    //Letters, numbers, dashes, and underscores only
    if (!usernameRe.test(username)){
        return fieldError("username", "Letters, numbers, dashes, and underscores only")
    }
    return null;
}