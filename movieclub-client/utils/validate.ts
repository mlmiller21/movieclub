export const validateEmail = function(email: string): string | undefined {
    const emailRe = /^[^`'"@]+@[a-zA-Z0-9\-\.]+\.[a-zA-Z0-9\-\.]+$/;
    if (email.length < 3){
        return "email too short";
    }
    //The total length should be no more than 254 characters.
    if (email.length > 254){
        return "email too long";
    }
    //The local part (before the @) should be no more than 63 characters.
    if (email.split("@")[0].length > 63){
        return "Email is invalid";
    }
    if (!emailRe.test(email)){
        return "Email is invalid";
    }
    return null;
}

export const validatePassword = function(password: string): string | undefined{
    if (password.length < 8){
        return "password must be at least 8 characters";
    }
    return null;
}

export const validatePasswords = function(password: string, password2: string): string | undefined {
    if (!password2){
        return "Password required";
    }
    if (password !== password2){
        return "Passwords do not match";
    }
    return null;

}

export const validateUsername: (username: string) => string = function(username: string): string | undefined {
    const usernameRe = /^[a-zA-Z0-9\-_]+$/;

    if (username.length <= 2) {
        return "length must be 3 or more";
    }
    //user can't be greater than 50
    if (username.length > 50) {
        return "length must be 50 or less";
    }
    //Letters, numbers, dashes, and underscores only
    if (!usernameRe.test(username)){
        return "Letters, numbers, dashes, and underscores only";
    }
    return null;
}
