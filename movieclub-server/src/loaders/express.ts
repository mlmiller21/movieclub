import { COOKIE_NAME, __prod__ } from "../constants";

import { searchUsers } from "../controllers/searchController";

import { HttpError } from "../utils/CustomErrors";

import user from "../routes/user";
import auth from "../routes/auth";
import movie from "../routes/movie";

import express, {NextFunction, Request, Response} from "express";
import redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";



declare module "express-session" {
    interface Session {
        userId: string;
    }
}

export const createExpressApp = (app: express.Application): void => {
    // support application/json type post data
    app.use(express.json());
    // support application/x-www-form-urlencoded post data
    app.use(express.urlencoded({extended: false}))

    // Hide use of express
    app.disable('x-powered-by');

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true
        })
    )

    //setting up redis to store user sessions
    const redisStore: connectRedis.RedisStore = connectRedis(session);
    const redisClient = new redis();    

    app.use(
        session({
            name: COOKIE_NAME,
            store: new redisStore({
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365, //10 years
                httpOnly: true, // Not accessible by Document.cookie
                secure: __prod__, // true for https
                sameSite: 'lax'
            },
            saveUninitialized: false,
            secret: 'seeeecret',
            resave: false,
        })
    )

    //Search for a user by username and return a list of users
    //return 200 if request is fine, 400 if unknown error
    app.get('/api/v1/searchuser/:username', async (req: Request, res: Response, next: NextFunction) => {
        try{
            const username = req.params.username;
            const users = await searchUsers(username);

            res.status(200).json({users})
        }
        catch(err){
            next(err);
        }
    })

    app.use('/api/v1/movie', movie);
    app.use('/api/v1/user', user);
    app.use('/api/v1/auth', auth);

    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status).json({err});
    });
    
}

/**
 * TODO:
 *  - Sockets for friends
 *  - Upload image for user. Store in either: disk, memory, or stream to some cloud service
 *  - Send emails
 *  - unit tests
 *  - integration tests
 */