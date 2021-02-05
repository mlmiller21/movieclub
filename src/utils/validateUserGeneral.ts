import { UserGeneral } from "../interfaces/UserGeneral";
import {CustomError} from "../interfaces/CustomError";

import { validateUsername } from "./validateUsername";
import { validatePassword } from "./validatePassword";
import { validateEmail } from "./validateEmail";

/**
 * validate username, password, and email for a registration validation
 * @param {UserRegister} userCreation consists of username, password, and email
 * @returns {CustomError[]} array of errors if multiple fields invalid, null otherwise
 */
export const validateUserGeneral: (userCreation: UserGeneral) => CustomError[] = function(userCreation: UserGeneral): CustomError[] {
    let errors: CustomError[] = [];
    const errorUsername = validateUsername(userCreation.username);
    if (errorUsername){
        errors.push(errorUsername);
    }
    const errorPassword = validatePassword(userCreation.password);
    if (errorPassword){
        errors.push(errorPassword);
    }
    const errorEmail = validateEmail(userCreation.email);
    if (errorEmail){
        errors.push(errorEmail);
    }
    return errors;
}