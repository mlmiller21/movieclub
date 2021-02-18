import express from "express";
import { createTypeOrmConnection } from "./database";
import { createExpressApp } from "./express"


export default async (app: express.Application): Promise<void> => {
    try{
        await createTypeOrmConnection();
    }
    catch(err){
        throw err;
    }
    createExpressApp(app);
}