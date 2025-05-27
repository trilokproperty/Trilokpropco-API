import mongoose from 'mongoose';
import { PropertyModel } from "../Models/PropertiesModel.js";
import { cloudinary } from '../utils/cloudinary.js';


export const addProperty = async (req, res) => {
    try {
        // Log the incoming request
        // console.log('Request Body:', req.body.planType, req.body.plans );
        // console.log('Uploaded Files:', req.files);

        // Destructure and check if name is present
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Property name is required." });
        }

        const existingProject = await PropertyModel.findOne({ name });
        if (existingProject) {
            return res.status(400).json({ message: "Project already exists." });
        }
        
        const galleryImages = [];
        const bankImages = [];
        const plans = [];

        // Handle gallery images
       if (req.files['galleryImages']) {
            const galleryUploadPromises = req.files['galleryImages'].map(file =>
                cloudinary.uploader.upload(file.path, {
                    public_id: `gallery/${file.originalname.split('.')[0]}`, // Use the original file name (without extension)
                    folder: 'gallery' // Organize uploads into a folder
                })
            );
            const galleryResults = await Promise.all(galleryUploadPromises);
            galleryResults.forEach(result => galleryImages.push(result.secure_url));
            // console.log('gallery worked',galleryResults);
            
        }

    // Handle bank images
    if (req.files['bankImages']) {
        const bankUploadPromises = req.files['bankImages'].map(file =>
            cloudinary.uploader.upload(file.path, {
                public_id: `bank/${file.originalname.split('.')[0]}`, // Use the original file name (without extension)
                folder: 'bank' // Organize uploads into a folder
            })
        );
        const bankResults = await Promise.all(bankUploadPromises);
        bankResults.forEach(result => bankImages.push(result.secure_url));
        // console.log('bank worked',bankResults);
    }


       // Handle plans
    // Ensure req.body.plans is parsed correctly if it's a JSON string
    let plansData;
    if (typeof req.body.plans === 'string') {
        try {
            plansData = JSON.parse(req.body.plans);
            console.log("Parsed plansData:", plansData); // Log to verify
        } catch (error) {
            console.error("Error parsing plans:", error);
            plansData = [];
        }
    } else {
        plansData = req.body.plans;  // In case it's already an object
    }
        // console.log('plan worked',plansData);

    // Log the uploaded files
    // console.log("req.files['plans']:", req.files['plans']);

    // Proceed if plans data exists and files are present
    if (plansData.length > 0 && req.files['plans']) {
        const planUploadPromises = req.files['plans'].map(async (file, index) => {
            try {
                const result = await cloudinary.uploader.upload(file.path); // Upload each file to Cloudinary
                return {
                    planType: plansData[index]?.planType || "", // Use the planType from the parsed plans array
                    image: result.secure_url, // Uploaded image URL
                    size: plansData[index]?.size || "", // Use the size from the parsed plans array
                    price: plansData[index]?.price || "" // Use the price from the parsed plans array
                };
            } catch (uploadError) {
                console.error("Error uploading file:", uploadError);
                return null;
            }
        });

        const planResults = await Promise.all(planUploadPromises);
        plans.push(...planResults.filter(plan => plan !== null)); // Filter out null results due to failed uploads
        // console.log('plan images worked',plans);
    }

        const amenitiesData = JSON.parse(req.body.amenities || '[]');
        const projectOverviewData  = JSON.parse(req.body.projectOverview || '{}');
        const priceDetailsData  = JSON.parse(req.body.priceDetails || '[]');
        // console.log('am worked',amenitiesData);
        // console.log('pr over worked',projectOverviewData);
        // console.log('price worked',priceDetailsData);
        const sanitizeObjectId = (value) => (value && value.trim() !== "" ? value : null);

        const {
        type,
        status,
        developer,
        specifications,
        ...restBody
        } = req.body;

        const propertyData = {
              ...restBody,
            type: sanitizeObjectId(type),
            status: sanitizeObjectId(status),
            developer: sanitizeObjectId(developer),
            amenities: amenitiesData,
            projectOverview: projectOverviewData,
            priceDetails: priceDetailsData,
            galleryImages,
            bankImages,
            plans
        };
        
        // console.log('pr data',propertyData);

        const property = new PropertyModel(propertyData);
        // console.log('pr data passs',property);
        const savedProperty = await property.save();
        // console.log('pr data save',savedProperty);
        res.status(200).json(savedProperty);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

  
// update Property
export const updateProperty = async (req, res) => {
    const id = req.params.id;
    try {
        // Find the existing property by ID
        const existingProperty = await PropertyModel.findById(id);
        if (!existingProperty) {
            return res.status(400).json({ message: "Project not found." });
        }

        // Arrays to store uploaded image URLs or keep existing data
        const galleryImages = [...(existingProperty.galleryImages || [])];
        const bankImages = [...(existingProperty.bankImages || [])];
        const plans = [...(existingProperty.plans || [])];

        // Handle gallery images (if new ones are uploaded)
       if (req.files['galleryImages']) {
    const galleryUploadPromises = req.files['galleryImages'].map(file =>
        cloudinary.uploader.upload(file.path, {
            public_id: `gallery/${file.originalname.split('.')[0]}`, // Use the original file name (without extension)
            folder: 'gallery' // Organize uploads into a folder
        })
    );
    const galleryResults = await Promise.all(galleryUploadPromises);
    galleryResults.forEach(result => galleryImages.push(result.secure_url));
}

// Handle bank images
if (req.files['bankImages']) {
    const bankUploadPromises = req.files['bankImages'].map(file =>
        cloudinary.uploader.upload(file.path, {
            public_id: `bank/${file.originalname.split('.')[0]}`, // Use the original file name (without extension)
            folder: 'bank' // Organize uploads into a folder
        })
    );
    const bankResults = await Promise.all(bankUploadPromises);
    bankResults.forEach(result => bankImages.push(result.secure_url));
}


        // Handle plans (if new ones are uploaded)
        let plansData;
        if (typeof req.body.plans === 'string') {
            try {
                plansData = JSON.parse(req.body.plans);
            } catch (error) {
                console.error("Error parsing plans:", error);
                plansData = [];
            }
        } else {
            plansData = req.body.plans || [];
        }

        if (plansData.length > 0 && req.files['plans']) {
            const planUploadPromises = req.files['plans'].map(async (file, index) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path); // Upload each file to Cloudinary
                    return {
                        planType: plansData[index]?.planType || "", // Use the planType from the parsed plans array
                        image: result.secure_url, // Uploaded image URL
                        size: plansData[index]?.size || "", // Use the size from the parsed plans array
                        price: plansData[index]?.price || "" // Use the price from the parsed plans array
                    };
                } catch (uploadError) {
                    console.error("Error uploading plan file:", uploadError);
                    return null;
                }
            });

            const planResults = await Promise.all(planUploadPromises);
            plans.push(...planResults.filter(plan => plan !== null)); // Append only successful uploads
        }

        // Parse JSON fields for amenities, projectOverview, priceDetails if provided, or use existing data
        const amenitiesData = req.body.amenities ? JSON.parse(req.body.amenities) : existingProperty.amenities;
        const projectOverviewData = req.body.projectOverview ? JSON.parse(req.body.projectOverview) : existingProperty.projectOverview;
        const priceDetailsData = req.body.priceDetails ? JSON.parse(req.body.priceDetails) : existingProperty.priceDetails;
        const sanitizeObjectId = (value) => (value && value.trim() !== "" ? value : null);

        const {
        type,
        status,
        developer,
        ...restBody
        } = req.body;

        // Prepare the updated property data, setting new fields or keeping the existing ones
        const updatedPropertyData = {
            ...existingProperty._doc, // Keep all existing fields by default
            ...restBody,
            type: sanitizeObjectId(type),
            status: sanitizeObjectId(status),
            developer: sanitizeObjectId(developer),           
            amenities: amenitiesData, // Use either new or existing
            projectOverview: projectOverviewData, // Use either new or existing
            priceDetails: priceDetailsData, // Use either new or existing
            galleryImages, // Updated gallery images (new + existing)
            bankImages, // Updated bank images (new + existing)
            plans // Updated plans (new + existing)
        };

        // Update property with new data
        const updatedProperty = await PropertyModel.findByIdAndUpdate(id, updatedPropertyData, { new: true });

        // Send the updated property back in the response
        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


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

// delete plans controller: 
export const deletePlan = async (req, res) => {
    try {
        const { id } = req.params; // Property ID
        const { planIds } = req.body; // Array of plan IDs to delete

        const property = await PropertyModel.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Filter out the plans to be deleted
        property.plans = property.plans.filter(plan => !planIds.includes(plan._id.toString()));

        await property.save();

        return res.status(200).json({ message: 'Plan(s) deleted successfully', property });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return res.status(500).json({ message: 'Server error' });
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
