import express from "express";
import { upload } from "../MiddleWare/multer.js";
import { addType, deleteType, getTypes } from "../Controllers/TypesController.js";
import { verifyAdmin, verifyEditor } from "../MiddleWare/jwt.js";

export const typeRouter = express.Router();

// POST type api:
typeRouter.post('/', verifyEditor, upload.single('logo'), addType)

// GET type api:
typeRouter.get('/', getTypes)

// delete type api:
typeRouter.delete('/:id', verifyEditor, deleteType)