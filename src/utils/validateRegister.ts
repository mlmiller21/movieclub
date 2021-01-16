import { UserNamePassword } from "src/types/UsernamePassword";
import { UserResponse } from "src/types/UserResponse";
import { usernameRe } from "../regex";

const fieldError: (field: string, message: string) => { field: string, message: string } = function(field: string, message: string): { field: string, message: string } {
     return {field: field, message: message};
}

export const validateRegister: (userCreation: UserNamePassword) => UserResponse | null = function(userCreation: UserNamePassword): UserResponse | null {

    //validate user
    //must be unique (just check upon insertion)
    //username can't be empty
    //user can't be greater than 50
    if (userCreation.username.length <= 2) {
        return {errors: [
            fieldError("username", "username length must be greater than 2")
            ]
        }
    }
    if (userCreation.username.length > 50) {
        return {
            errors: [
                fieldError("username", "length must be less than 51")
            ]
        }
    }
    //Letters, numbers, dashes, and underscores only
    if (!usernameRe.test(userCreation.username)){
        return {
            errors: [
                fieldError("username", "Letters, numbers, dashes, and underscores only")
            ]
        }
    }
    //validate password
        //can't be empty
        //must be greater than 6?
    if (userCreation.password.length < 8){
        return {
            errors: [
                fieldError("password", "password must be at least 8 characters")
            ]
        }
    }
    //validate email
        //Could just do this in the front end
    //The email address contains two parts, separated with an @ symbol.

    //The email address does not contain dangerous characters (such as backticks, single or double quotes, or null bytes).

    //Exactly which characters are dangerous will depend on how the address is going to be used (echoed in page, inserted into database, etc).

    //The domain part contains only letters, numbers, hyphens (-) and periods (.).        

    //best way to validate email addresses is to perform some basic initial validation, and then pass the address to the mail server and catch the exception if it rejects it.
    let emailRe = /[^`'"@\s]++@[a-zA-Z0-9\-\.]++.[^`'"@\s]++/;
    if (userCreation.email){
        let email = userCreation.email;
        if (email.length < 3){
            return {
                errors: [
                    fieldError("email", "email too short")
                ]
            }
        }
        //The total length should be no more than 254 characters.
        if (email.length > 254){
            return {
                errors: [
                    fieldError("email", "email too long")
                ]
            }
        }
        //The local part (before the @) should be no more than 63 characters.
        if (email.split("@")[0].length > 63){
            return {
                errors: [
                    fieldError("email", "local part must be less than 64")
                ]
            }
        }
        if (!emailRe.test(email)){
            return {
                errors: [
                    fieldError("email", "invalid email, try again")
                ]
            }
        }
    }
    return null;

    /**
     * 
    The email address is correct.
    The application can successfully send emails to it.
    The user has access to the mailbox.

The links that are sent to users to prove ownership should contain a token that is:

    At least 32 characters long.
    Generated using a secure source of randomness.
    Single use.
    Time limited (e.g, expiring after eight hours).

     */
}