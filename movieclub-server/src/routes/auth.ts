import { createUser, forgotPassword, login, logout, me, changePasswordEmail } from "../controllers/authController";

import {isLoggedIn} from "../middleware/isLoggedIn";

import { User } from "../entities/User";

import express, {NextFunction, Request, Response} from "express";


const router = express.Router();

// Register a user utilizing post request for security
// Returns 201 if the user is created or 400 if a validation error occurs or the username/email already exist
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const {username, password, email} = req.body;
    try {
        const user: User = await createUser({username, password, email}, req);
        res.status(201).end();
    }
    catch(err) {
        next(err);
    }
})

// Login a user
// Returns 200 if successful, 400 if the username/email doesn't exist, 401 if incorrect password
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const {usernameOrEmail, password} = req.body;
    try {
        const user: User = await login({usernameOrEmail, password}, req);
        res.status(200).end();
    }
    catch(err) {
        next(err);
    }
})

// Logout a user
// 200 if successful, 400 if an error occurs with deleting the cookie
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    const valid = await logout(req, res);
    res.status(valid ? 200: 400).end();
})

// Obtain information for the current user
// returns 200 if the user is found, 401 if not logged in
router.get('/me', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await me(req);
        res.status(200).json({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        })
    }
    catch(err){
        err.status = 401;
        next(err);
    }
})

// Email a link to reset password
// returns 201 if a token is generated, 404 if user doesn't exist, 400 otherwise (if an invalid email, token has already been generated, or error generating email)
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;
    try{
        const User = await forgotPassword(email);
        res.status(201).end();
    }
    catch(err){
        next(err);
    }
})

// Reset password with given token and password
// returns 200 if password changed, 404 if token doesn't exist or user doesn't exist, and 400 if error creating new password
router.post('/change-password', async (req: Request, res: Response, next: NextFunction) => {
    const {password, token} = req.body;
    try{
        const user = await changePasswordEmail(password, token);
        res.status(200).end();
    }
    catch(err){
        next(err)
    }
})

export default router;