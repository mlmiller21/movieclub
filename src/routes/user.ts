import express, {Request, Response} from "express";
import {isLoggedIn} from "../middleware/isLoggedIn";
import { changePassword, createUser, editProfile, forgotPassword, login, logout, me, changePasswordEmail, changeUsername } from "../controllers/userController";

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    const {username, password, email} = req.body;
    const user = await createUser({username, password, email}, req);6

    if (user.errors){
        res.status(400).json({user});
    }
    res.status(201);
})

router.post('/login', async (req: Request, res: Response) => {
    const {usernameOrEmail, password} = req.body;
    const user = await login({usernameOrEmail, password}, req);

    if (user.errors){
        res.status(400).json({user});
    }
    res.status(200).end();
})

router.post('/logout', async (req: Request, res: Response) => {
    const valid = await logout(req, res);
    res.status(valid ? 200: 400).end();
})

router.put('/editProfile', isLoggedIn, async (req: Request, res: Response) => {
    const {firstName, lastName} = req.body;
    const error = await editProfile({firstName, lastName}, req)
    if (error){
        res.status(400).json(error);
    }
    res.status(204).end();
})

router.post('/change-password', isLoggedIn, async (req: Request, res: Response) => {
    const {password} = req.body;
    const error = await changePassword(password, req);
    if (error.errors){
        res.json(error);
    }
    res.json({passChanged: true})
})

router.post('/change-username', isLoggedIn, async (req: Request, res: Response) => {
    const {username} = req.body;
    const error = await changeUsername(username, req);
    if (error.errors){
        res.json(error);
    }
    res.json({userChanged: true})
})


router.get('/me', isLoggedIn, async (req: Request, res: Response) => {
    const user = await me(req);
    res.json(user);
})

router.post('/forgotPassword', async (req: Request, res: Response) => {
    const {email} = req.body;
    const user = await forgotPassword(email);
    if (user.errors){
        res.json(user.errors);
    }
    
    res.json({sent: true});
})

router.post('/change-password-email', async (req: Request, res: Response) => {
    const {password} = req.body;
    const token: string = req.query.token as string;
    const error = await changePasswordEmail(password, token);
    if (error.errors){
        res.json(error.errors);
    }

    res.json({email: true});
})

export default router;