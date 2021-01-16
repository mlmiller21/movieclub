import bcrypt from "bcrypt";

interface Password {
    hashedPasswordSalt: string
}

export const createPassword: (userPassword: string) => Password = function (userPassword: string): Password {
    //generate the salt with a work factor of 12
    const workFactor = 12;
    

    //bcrypt encodes in base64
    //bcrypt prepends a cryptographically secure random salt to the hash

    //generate the hash of the password
        //salt should be at least 16 char long
        //Salt should be encoded as hexadecimal or base64
    //combine salt and password (concat)
    //hash the combined password with salt
    //hashedPasswordSalt: "pw", salt: "salt"
    //store the pw with hashedpasswoedsalt and store salt with salt
    
    
    

    
}

export const comparePassword: (userPassword: string, dbPassword: string) => boolean = function (userPassword: string, dbPassword: string): boolean {
    
    return true;
}