import express from "express";
import { addPartner, deletePartner, getPartners } from "../Controllers/PartnerController.js";
import { verifyAdmin, verifyEditor } from "../MiddleWare/jwt.js";

export const partnerRouter = express.Router();

partnerRouter.post('/', verifyEditor, upload.array('images'), addPartner)
partnerRouter.get('/', getPartners)
partnerRouter.delete('/:id', verifyAdmin, deletePartner)