import express from "express";
import { addFormData, deleteFormData, getFormData } from "../Controllers/FormDataController.js";
import { verifyAdmin, verifyToken } from "../MiddleWare/jwt.js";

export const formRouter = express.Router();

formRouter.post('/', addFormData)
formRouter.get('/', verifyToken, getFormData)
formRouter.delete('/:id', verifyAdmin, deleteFormData)
