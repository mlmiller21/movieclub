import { User } from "../entities/User";
import { createPassword, comparePassword } from "../utils/password";
import { validateRegister } from "../utils/validateRegister";
import { UserNamePassword } from "../interfaces/UsernamePassword";
import { UserResponse } from "../interfaces/UserResponse";
import { UserLogin } from "../interfaces/UserLogin";
import { fieldError } from "../utils/fieldError";


export const createUser: (userCreation: UserNamePassword) => Promise<UserResponse | null> = async function(userCreation: UserNamePassword): Promise<UserResponse | null> {
    //Validate user, password, and email
    const errors = validateRegister(userCreation);
    if (errors){
        return errors;
    }
    //create hashed bcrypt password
    const password = await createPassword(userCreation.password);

    let user: User | undefined;
    try {
        user = await User.create({username: userCreation.username.toLowerCase(), password: password, email: userCreation.email}).save();
        console.log(user);
    } 
    catch (err){
        console.log(err);
        if (err.code === "23505"){
            if(err.detail.includes("username")){
                return {errors: [
                    fieldError("username", "username already exists")
                ]};
            }
            if(err.detail.includes("email")){
                return {errors: [
                    fieldError("email", "email already exists")
                ]};
            }
            console.log("23505");
        }
    }
    
    return { user };
    
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