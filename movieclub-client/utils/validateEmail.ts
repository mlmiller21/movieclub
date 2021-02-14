export const validateEmail = function(email: string): string {
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
    return '';
}