import mongoose from 'mongoose';
import { PropertyModel } from "../Models/PropertiesModel.js";
import { cloudinary } from '../utils/cloudinary.js';


export const addProperty = async (req, res) => {
    try {
      const { name } = req.body;
      const existingProject = await PropertyModel.findOne({ name });
  
      if (existingProject) {
        return res.status(400).json({ message: "Project already exists." });
      }
  
      const galleryImages = [];
      const bankImages = [];
      const plans = [];
  
      // Upload galleryImages to Cloudinary
      if (req.files['galleryImages']) {
        const galleryUploadPromises = req.files['galleryImages'].map(file =>
          cloudinary.uploader.upload(file.path)
        );
        const galleryResults = await Promise.all(galleryUploadPromises);
        galleryResults.forEach(result => galleryImages.push(result.secure_url));
      }
  
      // Upload bankImages to Cloudinary
      if (req.files['bankImages']) {
        const bankUploadPromises = req.files['bankImages'].map(file =>
          cloudinary.uploader.upload(file.path)
        );
        const bankResults = await Promise.all(bankUploadPromises);
        bankResults.forEach(result => bankImages.push(result.secure_url));
      }
  
      // Upload plans (if applicable)
      if (req.files['plans']) {
        const planUploadPromises = req.files['plans'].map(async (file, index) => {
          const result = await cloudinary.uploader.upload(file.path);
          return {
            planType: req.body.planType[index],
            image: result.secure_url,
            size: req.body.planSize[index],
            price: req.body.planPrice[index]
          };
        });
        const planResults = await Promise.all(planUploadPromises);
        plans.push(...planResults);
      }
  
      const propertyData = {
        ...req.body,
        galleryImages,
        bankImages,
        plans
      };
  
      const property = new PropertyModel(propertyData);
      const savedProperty = await property.save();
      res.status(200).json(savedProperty);
    } catch (error) {
      console.error(error.message);
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

// get property controller with id:
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

// get property controller with property name:
export const getSinglePropertyByName = async (req, res) => {
    const name = req.params.name;
    console.log(name)
    try {
        // Case-insensitive and removing unnecessary spaces
        const property = await PropertyModel.findOne({ name: name });
        
        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }
        
        res.status(200).json(property);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

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
// find property by location id:
export const getPropertiesByLocation = async (req, res) => {
    const { locationId } = req.params;
    try {
      const properties = await PropertyModel.find({location: locationId})
            .populate('location')  
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching properties", error });
    }
  };
  
// find property by type id:
export const getPropertiesByType = async (req, res) => {
    const { typeId } = req.params;
    try {
      const properties = await PropertyModel.find({type: typeId})
            .populate('type')  
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching properties", error });
    }
  };