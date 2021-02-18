import "reflect-metadata"
import express from "express";
import loader from "./loaders";

export const server: () => Promise<express.Application> = async function(): Promise<express.Application> {
    const app = express();
    try{
        await loader(app);
    }
    catch(err){
        throw(err);
    }
    return app;
}