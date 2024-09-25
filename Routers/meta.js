import express from "express";
import { upload } from "../MiddleWare/multer";
import { addMeta, getAllMeta, updateMeta } from "../Controllers/MetaController";
import { verifyEditor } from "../MiddleWare/jwt";


export const metaRouter = express.Router();

// Route to add new footer meta
metaRouter.post("/add", verifyEditor(), upload.single("FeaturedImage"), addMeta);

// Route to update footer meta by ID
metaRouter.put("/update/:id", verifyEditor(), upload.single("FeaturedImage"), updateMeta);

// Route to get all footer meta
metaRouter.get("/", getAllMeta);