import express from "express";
import { upload } from "../MiddleWare/multer.js"; // Assuming you are using multer for file uploads
import { addService, addServiceText, deleteService, getServices, getServiceTexts, updateService, updateServiceText } from "../Controllers/ServicesController.js";
import { verifyAdmin } from "../MiddleWare/jwt.js";

export const servicesRouter = express.Router();

// Add a new Service
servicesRouter.post('/', verifyAdmin, upload.single('logo'), addService);
servicesRouter.post('/text', verifyAdmin, addServiceText);
servicesRouter.put('/text/:id', verifyAdmin, updateServiceText);
servicesRouter.get('/text', getServiceTexts);

// Get all Services
servicesRouter.get('/', getServices);

// Update a specific Service by ID
servicesRouter.put('/:id', verifyAdmin, upload.single('logo'), updateService);

// Delete a specific Service by ID
servicesRouter.delete('/:id', verifyAdmin, deleteService);
