export const validateUsername = function(username: string): string {
    const usernameRe = /^[a-zA-Z0-9\-_]+$/;

    if (username.length <= 2) {
        return "length must be greater than 2";
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