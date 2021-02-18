import "reflect-metadata"
import express from "express";
import loader from "./loaders";

export const server = async () => {
    const app = express();
    try{
        await loader(app);
    }
    catch(err){
        return;
    }
    return app;
}