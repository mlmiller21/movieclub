import { emailRe } from "../regex"
import { CustomError } from "../interfaces/CustomError";
import { fieldError } from "../utils/fieldError";

//validate email
/**
 * @description validate email using the following attributes:
 * 
 * 
 *  - total length, length of local part
 *  - tested against a loose regex, not fully compliant with RFC-822
 *    just checks if at exists with proper characters in local and domain
 * @param {string} email 
 * @returns {CustomError | null} return CustomError if error, null otherwise
 */
export const validateEmail: (email: string) => CustomError | null = function(email: string): CustomError | null {
    if (email.length === 0){
        return fieldError("email", "email can't be empty")
    }
    //The total length should be no more than 254 characters.
    if (email.length > 254){
        return fieldError("email", "email too long")
    }
    //The local part (before the @) should be no more than 63 characters.
    if (email.split("@")[0].length > 63){
        return fieldError("email", "local part must be less than 64")
    }
    if (!emailRe.test(email)){
        return fieldError("email", "invalid email, try again")
    }
    return null;
}