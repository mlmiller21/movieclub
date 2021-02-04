import { UserResponse } from "../interfaces/UserResponse";
import { validateUsername } from "./validateUsername";
import { validatePassword } from "./validatePassword";
import { validateEmail } from "./validateEmail";
import { UserGeneral } from "../interfaces/UserGeneral";

/**
 * validate username, password, and email for a registration validation
 * @param {UserRegister} userCreation consists of username, password, and email
 * @returns {UserResponse} error if invalid, null otherwise
 */
export const validateUserGeneral: (userCreation: UserGeneral) => UserResponse | null = function(userCreation: UserGeneral): UserResponse | null {
    const errorUsername = validateUsername(userCreation.username);
    if (errorUsername){
        return errorUsername;
    }
    const errorPassword = validatePassword(userCreation.password);
    if (errorPassword){
        return errorPassword
    }
    const errorEmail = validateEmail(userCreation.email);
    if (errorEmail){
        return errorEmail;
    }
    return null;
}