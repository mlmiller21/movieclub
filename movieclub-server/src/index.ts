import { connection } from "./connection"
import express, {NextFunction, Request, Response} from "express";
import redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { COOKIE_NAME, __prod__ } from "./constants";
import user from "./routes/user";
import auth from "./routes/auth";
import movie from "./routes/movie";
import { HttpError } from "./utils/CustomErrors";
import cors from "cors";
import { getConnection } from "typeorm";
import { User } from "./entities/User";

declare module "express-session" {
    interface Session {
      userId: string;
    }
  }

const port = process.env.PORT || 3080;

const main: any = async () => {
    await connection;

    const app: express.Application = express();

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

    //fix this
    app.get('/api/v1/searchuser/:username', async (req: Request, res: Response, next: NextFunction) => {
        const user = await getConnection()
        .getRepository(User)
        .createQueryBuilder('user')
        .where('"user".username LIKE :username', {username: `${req.params.username}%`}).getMany();
        res.status(200).json({user})
        
    })

    app.use('/api/v1/auth', auth);
    app.use('/api/v1/user', user);
    app.use('/api/v1/movie', movie);
    
    /**
     * Search for a specific user by username
     * Return a list of users?
     * make use of debounce in frontend (maybe 400ms?)
     */
    

    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status).json({err});
        // This is error handler
    });

    app.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);
    })
    
}

/**
 * TODO:
 *  - Sockets for friends
 *  - Upload image for user. Store in either: disk, memory, or stream to some cloud service
 *  - Send emails
 *  - unit tests
 *  - integration tests
 */


main();