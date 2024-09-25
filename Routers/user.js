import express from "express";
import { deleteUser, getCurrentUser, getUsers, login, signup, updateUser } from "../Controllers/UserController.js";
import { verifyAdmin, verifyToken } from "../MiddleWare/jwt.js";


export const userRouter = express.Router();

userRouter.post('/signup', verifyAdmin, signup)
userRouter.post('/login', login)
// Get current user route (protected)
userRouter.get('/me', verifyToken, getCurrentUser);
userRouter.get('/', getUsers)
userRouter.delete('/:id', verifyAdmin, deleteUser)
userRouter.put('/:id', updateUser)