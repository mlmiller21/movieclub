import express, {Request, Response} from "express";
import {isLoggedIn} from "../middleware/isLoggedIn";
import {isUser} from "../middleware/isUser";
import { changePassword, editProfile, updateUserGeneral } from "../controllers/userController";

const router = express.Router();

const userAuth = [isLoggedIn, isUser];

//update user details
router.patch(':userid/editProfile', userAuth, async (req: Request, res: Response) => {
    const {firstName, lastName} = req.body;
    const error = await editProfile({firstName, lastName}, req)
    if (error){
        res.status(400).json({success: false, error});
    }
    res.status(204).end();
})

//update username and email, must enter password 
router.post(':userid/general', userAuth, async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    const error = await updateUserGeneral({username, email, password}, req);
    if (error){
        res.status(400).json({success: false, error});
    }
    res.status(200).json({success: true});
})

router.post(':userid/change-password', userAuth, async (req: Request, res: Response) => {
    const {password} = req.body;
    const error = await changePassword(password, req);
    if (error){
        res.status(400).json({success: false, error});
    }
    res.status(200).json({success: true});
})

export default router;