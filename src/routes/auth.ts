import express, {Request, Response} from "express";
import {isLoggedIn} from "../middleware/isLoggedIn";
import { createUser, forgotPassword, login, logout, me, changePasswordEmail } from "../controllers/authController";


const router = express.Router();

// Register a user utilizing post request for security
router.post('/register', async (req: Request, res: Response) => {
    const {username, password, email} = req.body;
    const userResponse = await createUser({username, password, email}, req);

    if (userResponse.errors){
        res.status(400).json({success: false, userResponse});
    }
    res.status(201).json({success: true});
})

// Login a user
router.post('/login', async (req: Request, res: Response) => {
    const {usernameOrEmail, password} = req.body;
    const userResponse = await login({usernameOrEmail, password}, req);

    if (userResponse.errors){
        res.status(400).json({success: false, userResponse});
    }
    res.status(200).json({success: true});
})

// Logout a user
router.post('/logout', async (req: Request, res: Response) => {
    const valid = await logout(req, res);
    res.status(valid ? 200: 400).json({success: valid ? true: false})
})

// Obtain information for the current user
router.get('/me', isLoggedIn, async (req: Request, res: Response) => {
    const user = await me(req);
    res.status(200).json(user);
})

// Email a link to reset password
router.post('/forgotPassword', async (req: Request, res: Response) => {
    const {email} = req.body;
    const userResponse = await forgotPassword(email);
    if (userResponse){
        res.status(400).json({success: false, userResponse});
    }
    
    res.status(200).json({success: true});
})

// Reset password with given token and password
router.post('/change-password/:token', async (req: Request, res: Response) => {
    const {password} = req.body;
    const token: string = req.query.token as string;
    const user = await changePasswordEmail(password, token);
    if (user.errors){
        res.status(400).json({success: false, user});
    }

    res.status(200).json({success: true});
})

export default router;