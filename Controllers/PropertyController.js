import mongoose from 'mongoose'
import { PropertyModel } from "../Models/PropertiesModel.js";


// post property controller:
export const addProperty = async (req, res) => {
    try {
        const { name } = req.body;
        const existingProject = await PropertyModel.findOne({ name });

        if (existingProject) {
            return res.status(400).json({ message: "Project already exists." });
        }
        
        
        const propertyData = req.body;

        const property = new PropertyModel(propertyData);
        const savedProperty = await property.save();
        res.status(200).json(savedProperty);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
// update Property
export const updateProperty = async (req, res) => {
    const id =req.params.id;
    try{
    const findProperty = await PropertyModel.findById(id);
    if (!findProperty) {
        return res.status(400).json({ message: "Project not found." });
    }
    const propertyData = req.body;
    const updatedProperty = await PropertyModel.findByIdAndUpdate(id, propertyData, {new: true});
    res.status(200).json(updatedProperty);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

// get properties controller:
export const getProperty = async (req, res) =>{
    try{
      const propeties = await PropertyModel.find();
      res.status(200).json(propeties)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// get properties controller:
export const getSingleProperty = async (req, res) =>{
    const id = req.params.id;
    try{
      const property= await PropertyModel.findById(id);
      if(!property){
        return res.status(404).json({message: "property not found."})
      }
      res.status(200).json(property)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// delete Property controller:
export const deleteProperty = async(req, res) =>{
    const id = req.params.id;
    try{
        const property = await PropertyModel.findById(id);
        if(!property){
            return res.status(404).json({ message: "Property not found."})
        }
        await PropertyModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Property successfully deleted."})
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}

// Delete gallery image controller
export const deleteGalleryImage = async (req, res) => {
    const { id } = req.params;
    const { imageUrl } = req.query; // Use query parameter for imageUrl

    try {
        // Find the property by id
        const property = await PropertyModel.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }

        // Check if the image exists in the galleryImages array
        const imageIndex = property.galleryImages.indexOf(imageUrl);
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Image not found in gallery." });
        }

        // Remove the image from the array
        property.galleryImages.splice(imageIndex, 1);

        // Save the updated property
        const updatedProperty = await property.save();
        res.status(200).json({ message: "Image successfully deleted.", updatedProperty });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// Delete Bank image controller
export const deleteBankImage = async (req, res) => {
    const { id } = req.params;
    const { imageUrl } = req.query; // Use query parameter for imageUrl

    try {
        // Find the property by id
        const property = await PropertyModel.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }

        // Check if the image exists in the galleryImages array
        const imageIndex = property.bankImages.indexOf(imageUrl);
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Image not found in bank." });
        }

        // Remove the image from the array
        property.bankImages.splice(imageIndex, 1);

        // Save the updated property
        const updatedProperty = await property.save();
        res.status(200).json({ message: "Image successfully deleted.", updatedProperty });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// 

export const searchProperty = async (req, res) => {
    const { type, city, status } = req.query;


    try {
        const filters = {};

        if (type) filters.type = type;
        if (city) filters.location = city; // 'location' refers to 'city' model
        if (status) filters.status = status;

        const properties = await PropertyModel.find(filters)
            .populate('type')
            .populate('location') 
            .populate('status')   

        console.log("Properties found:", properties);

        res.status(200).json(properties);
    } catch (e) {
        console.error("Error in searchProperty:", e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
