import express from "express";
import { addProperty, deleteProperty, getProperty, updateProperty, deleteGalleryImage, getSingleProperty, deleteBankImage, searchProperty, getPropertiesByLocation, getPropertiesByType, getSinglePropertyByName } from "../Controllers/PropertyController.js";
import { verifyAdmin, verifyEditor } from "../MiddleWare/jwt.js";
import {upload} from '../MiddleWare/multer.js'
export const propertyRouter = express.Router();

// Define multiple fields to upload
// Middleware to handle multiple file fields
export const uploadFields = upload.fields([
  { name: 'plans', maxCount: 1 }, 
  { name: 'galleryImages', maxCount: 20 },
  { name: 'bankImages', maxCount: 20 }
]);
// Search Property (this should have a different route to avoid conflict)
propertyRouter.get('/search', searchProperty);

// POST Property:
propertyRouter.post(
  '/',uploadFields, addProperty
);


// GET Property:
propertyRouter.get('/', getProperty)
// GET single Property with id:
propertyRouter.get('/:id', getSingleProperty)

// GET single Property by name (changed to a more explicit route):
propertyRouter.get('/name/:name', getSinglePropertyByName);
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


// get property with type id api:
propertyRouter.get('/type/:typeId', getPropertiesByType)
