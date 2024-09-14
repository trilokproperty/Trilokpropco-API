import express from "express";
import { addAbout, getAbout, updateAbout } from "../Controllers/AboutController.js";
import { upload } from "../MiddleWare/multer.js";
import { verifyAdmin } from "../MiddleWare/jwt.js";

export const aboutRouter = express.Router();

aboutRouter.post('/', verifyAdmin, upload.single('founderLogo'), addAbout);

aboutRouter.get('/', getAbout);

aboutRouter.put('/:id', verifyAdmin, upload.single('founderLogo'), updateAbout);