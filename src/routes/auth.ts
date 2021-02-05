import { createUser, forgotPassword, login, logout, me, changePasswordEmail } from "../controllers/authController";

import {isLoggedIn} from "../middleware/isLoggedIn";

import { UserResponse } from "../interfaces/UserResponse";

import express, {NextFunction, Request, Response} from "express";


const router = express.Router();

// Register a user utilizing post request for security
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const {username, password, email} = req.body;
    try {
        const userResponse: UserResponse = await createUser({username, password, email}, req);
        res.status(200).json({success: true});
    }
    catch(err) {
        next(err);
    }
})

// Login a user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const {usernameOrEmail, password} = req.body;
    try {
        const userResponse: UserResponse = await login({usernameOrEmail, password}, req);
        res.status(200).json({success: true});
    }
    catch(err) {
        err.status = 401
        next(err);
    }
})

// Logout a user
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    const valid = await logout(req, res);
    res.status(valid ? 200: 400).json({success: valid ? true: false})
})

// Obtain information for the current user
router.get('/me', isLoggedIn, async (req: Request, res: Response) => {
    const user = await me(req);
    res.status(200).json(user);
})

// Email a link to reset password
router.post('/forgotPassword', async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;
    try{
        const userResponse = await forgotPassword(email);
        res.status(200).json({success: true})
    }
    catch(err){
        next(err);
    }
    
})

// Reset password with given token and password
router.post('/change-password', async (req: Request, res: Response, next: NextFunction) => {
    const {password, token} = req.body;
    try{
    const user = await changePasswordEmail(password, token);
        res.status(200).json({success: true, user});
    }
    catch(err){
        next(err)
    }
})

export default router;