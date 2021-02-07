import { User } from "../entities/User";

import { UserProfileEdit } from "../interfaces/UserEdit";

import { getConnection } from "typeorm";
import { Request } from "express";


export const updateUserDetails: (userEdit: UserProfileEdit, req: Request) => Promise<User> = async function(userEdit: UserProfileEdit, req: Request): Promise<User> {
    return await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({...userEdit})
    .where('id = :id', {id: req.session.userId})
    .returning('*')
    .execute()
    .then(res => res.raw[0]);
}

export const updatePassword: (password: string, req: Request) => Promise<void> = async function(password: string, req: Request): Promise<void> {
    await User.update({id: req.session.userId}, {password});
}