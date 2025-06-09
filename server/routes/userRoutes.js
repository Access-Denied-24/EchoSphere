import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { followUnfollowUser, getUserData, listUsers, userfollowersAndFollowing, } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/list', userAuth, listUsers);
userRouter.post('/follow-unfollow/:followUserId', userAuth, followUnfollowUser);
userRouter.get('/followData', userAuth, userfollowersAndFollowing);


export default userRouter;