import { connection } from "./connection"
import express, {Request, Response} from "express";
import redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { COOKIE_NAME, __prod__ } from "./constants";
import user from "./routes/user";

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

    app.use('/user', user);
    
    /**
     * paginate
     * get reviews for a movie
     * filter by 
     *  date (newest, oldest)
     *  score (highest, lowest)
     * default to date newest
     */
    app.get('/reviews/:movieid', async (req: Request, res: Response) => {

    })

    /**
     * get reviews by a user
     * filter by 
     *  date (newest, oldest)
     *  score (highest, lowest)
     * default to date newest
     */
    app.get('/userreviews/:userid', async (req: Request, res: Response) => {

    })

    /**
     * Search for a specific user
     * make use of debounce in frontend (maybe 400ms?)
     */
    app.get('/searchuser', async (req: Request, res: Response) => {

    })

    /**
     * Create new review for a movie
     */
    app.post('/review/:movieid', async (req: Request, res: Response) => {

    })

    /**
     * Get a specific user's watchlist
     * TODO: Only accessed by user or user's friends if permissions set to private
     */
    app.get('/watchlist/:userid', async (req: Request, res: Response) => {

    })

    /**
     * Add a movie to a user's watchlist
     * Only accessible by that same user
     */
    app.post('/watchlist/:userid', async (req: Request, res: Response) => {

    })
    
    /**
     * Get a specific user's favourites
     * TODO: Only accessed by user or user's friends if permissions set to private
     */
    app.get('/favourites/:userid', async (req: Request, res: Response) => {

    })

    /**
     * Add a movie to a user's favourites
     * Only accessible by that same user
     */
    app.post('/favourites/:userid', async (req: Request, res: Response) => {

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