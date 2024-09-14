import express from "express";
import { upload } from "../MiddleWare/multer.js";
import { addDeveloper, deleteDeveloper, getDeveloper } from "../Controllers/DeveloperController.js";
import { verifyAdmin, verifyEditor } from "../MiddleWare/jwt.js";

export const developerRouter = express.Router();

// POST developer API:
developerRouter.post('/', verifyEditor, upload.single('image'), addDeveloper)

// GET developer API:
developerRouter.get('/', getDeveloper)
// delete developer API:
developerRouter.delete('/:id', verifyEditor, deleteDeveloper)
