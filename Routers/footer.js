import express from "express";
import { upload } from "../MiddleWare/multer.js";
import { addFooter, getFooters, updateFooter } from "../Controllers/FooterController.js";
import { verifyAdmin } from "../MiddleWare/jwt.js";

export const footerRouter = express.Router();

footerRouter.post('/', verifyAdmin, upload.single('image'), addFooter);

footerRouter.get('/', getFooters);

footerRouter.put('/:id', verifyAdmin, upload.single('image'), updateFooter);