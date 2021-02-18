import { User } from "../entities/User";

import { getUserList } from "../database/user";
import { HttpError } from "../utils/CustomErrors";
import { fieldError } from "../utils/fieldError";

export const searchUsers: (user: string) => Promise<User[]> = async function(user: string): Promise<User[]> {
    try{
        const users = await getUserList(user);
        return users;
    }
    catch(err){
        throw new HttpError([fieldError('Error', 'Unknown error')]);
    }
}