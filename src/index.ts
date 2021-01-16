import { connection } from "./connection"
import express, {Request, Response} from "express";
import { User } from "./entities/User";
import { createUser } from "./controllers/userController";

const port = process.env.PORT || 3000;

const main: any = async () => {
    await connection;

    const app: express.Application = express();

    try {
        await User.create({username: "Martin", password: "Password", email: "email", salt: "salt"}).save();
    } catch (err) {
        console.log(err);
    }

    // support application/json type post data
    app.use(express.json());
    // support application/x-www-form-urlencoded post data
    app.use(express.urlencoded({extended: false}))

    // Hide use of express
    app.disable('x-powered-by');


    app.get('/', (req: Request, res: Response) => {
        res.send("hello world");
    })

    app.get('/register', (req: Request, res: Response) => {
        res.send("Nikita is dumb");
    })

    app.post('/register', async (req: Request, res: Response) => {
        let {username, password, email} = req.body;
        const user = createUser({username, password, email});
        console.log(user);
        

        res.json(req.body);
    })

    app.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);
    })
    
}


main();