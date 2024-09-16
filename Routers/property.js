import express from "express";
import { addProperty, deleteProperty, getProperty, updateProperty, deleteGalleryImage, getSingleProperty, deleteBankImage, searchProperty, getPropertiesByLocation } from "../Controllers/PropertyController.js";
import { verifyAdmin, verifyEditor } from "../MiddleWare/jwt.js";

export const propertyRouter = express.Router();


// Search Property (this should have a different route to avoid conflict)
propertyRouter.get('/search', searchProperty);

// POST Property:
propertyRouter.post('/', verifyEditor, addProperty);
// GET Property:
propertyRouter.get('/', getProperty)
// GET sing Property:
propertyRouter.get('/:id', getSingleProperty)
// update Property:
propertyRouter.put('/:id', verifyEditor, updateProperty)
// delete Property:
propertyRouter.delete('/:id', verifyAdmin, deleteProperty)
// delete Gallery Image:
propertyRouter.delete('/:id/galleryImage', verifyEditor, deleteGalleryImage)
// delete Bank Image:
propertyRouter.delete('/:id/bankImage', verifyEditor, deleteBankImage)

// get property with location id api:
propertyRouter.get('/location/:locationId', getPropertiesByLocation)
