import express, {Request, Response} from "express";
import {isLoggedIn} from "../middleware/isLoggedIn";
import { changePassword, editProfile, changeUsername, changeEmail } from "../controllers/userController";

const router = express.Router();

router.patch(':userid/editProfile/', isLoggedIn, async (req: Request, res: Response) => {
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
        res.status(400).json(error);
    }
    res.status(200).end();
})

router.patch('/change-username', isLoggedIn, async (req: Request, res: Response) => {
    const {username} = req.body;
    const error = await changeUsername(username, req);
    if (error.errors){
        res.status(400).json(error);
    }
    res.status(204).end();
})

router.patch('/change-email', isLoggedIn, async (req: Request, res: Response) => {
    const {email} = req.body;
    const error = await changeEmail(email, req);
    if (error.errors){
        res.status(400).json(error);
    }
    res.status(204).end();
})

export default router;