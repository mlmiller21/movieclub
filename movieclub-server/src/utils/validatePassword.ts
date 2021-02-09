import { fieldError } from "../utils/fieldError";
import { CustomError } from "../interfaces/CustomError"

/**
 * Validate password by length
 * @param {string} password 
 * @returns {CustomError | null} return CustomError if error, null otherwise 
 */
export const validatePassword: (password: string) => CustomError | null = function(password: string): CustomError | null {
    //can't be empty, must be at least 8 characters
    if (password.length < 8){
        return fieldError("password", "password must be at least 8 characters")
    }
    return null;
}