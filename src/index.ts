import { connection } from "./connection"
import express, {Request, Response} from "express";
import redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { COOKIE_NAME, __prod__ } from "./constants";
import user from "./routes/user";
import auth from "./routes/auth";

declare module "express-session" {
    interface Session {
      userId: number;
    }
  }

const port = process.env.PORT || 3000;

const main: any = async () => {
    await connection;

    const app: express.Application = express();

    // support application/json type post data
    app.use(express.json());
    // support application/x-www-form-urlencoded post data
    app.use(express.urlencoded({extended: false}))

    // Hide use of express
    app.disable('x-powered-by');

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

    app.use('/auth', auth);
    app.use('/user', user);
    
    

    
    /**
     * Search for a specific user
     * Return a list of users?
     * make use of debounce in frontend (maybe 400ms?)
     */
    app.get('/searchuser', async (req: Request, res: Response) => {

    })

    /**
     * Add a friend by pk
     */
    app.post('/addfriend/:userid', async (req: Request, res: Response) => {

    })

    app.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);
    })
    
}


main();