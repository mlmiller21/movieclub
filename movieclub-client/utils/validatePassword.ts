export const validatePassword = function(password: string): string{
    if (password.length < 8){
        return "password must be at least 8 characters";
    }
}

