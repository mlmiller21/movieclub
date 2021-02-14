export const validatePassword = function(password: string, password2: string): string{
    if (!password2){
        return "Password required";
    }
    if (password !== password2){
        return "Passwords do not match";
    }

}