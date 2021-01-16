import { User } from "src/entities/User";
import { createPassword, comparePassword } from "../utils/password";
import { validateRegister } from "../utils/validateRegister";
import { UserNamePassword } from "../types/UsernamePassword";
import { UserResponse } from "../types/UserResponse";
import { UserLogin } from "src/types/UserLogin";


export const createUser: (userCreation: UserNamePassword) => Promise<UserResponse | null> = async function(userCreation: UserNamePassword): Promise<UserResponse | null> {
    //Validate user, password, and email
    const errors = validateRegister(userCreation);
    if (errors){
        return errors;
    }
    
    const password = createPassword(userCreation.password);

    let user: User = User.create({username: userCreation.username, password: password.hashedPasswordSalt, salt:password.salt});



    //insert username into db in lower case
    return null;
    
}

export const login: (userLogin: UserLogin) => Promise<UserResponse | null> = async function(userLogin: UserLogin): Promise<UserResponse | null> {
    //validate login
    //After validation, try to log user in
    //Check if it's a username or email being passed in, just check if there's an @ in it
    //Check if the user exists (email or password), if it doesn't return an appropriate error
    //If the user exists but it fails, the password is incorrect
    //If the login succeeds, then you're gucci, set the cookie

    return null;
}