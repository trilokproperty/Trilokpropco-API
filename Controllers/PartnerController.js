import { PartnerModel } from "../Models/PartnerModel.js";
import cloudinary from '../config/cloudinary.js'; // Import the Cloudinary config

// Add Partner controller:
export const addPartner = async (req, res) => {
    try {
        // Upload image to Cloudinary
        const imageUploadPromises = req.files.map(file => {
            return cloudinary.v2.uploader.upload(file.path, { folder: 'partners' });
        });

        const uploadedImages = await Promise.all(imageUploadPromises);
        
        const partner = new PartnerModel({
            name: req.body.name,
            images: uploadedImages.map(image => ({
                url: image.secure_url,
                deleteUrl: image.delete_token, // Use the delete token for later deletion
            })),
        });

        const savedPartner = await partner.save();
        res.status(200).json(savedPartner);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

// Get Partners controller:
export const getPartners = async (req, res) => {
    try {
        const partners = await PartnerModel.find();
        res.status(200).json(partners);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

// Delete Partner Controller
export const deletePartner = async (req, res) => {
    const { id } = req.params;
    try {
        const partner = await PartnerModel.findById(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        
        // Delete image from Cloudinary
        for (const image of partner.images) {
            await cloudinary.v2.uploader.destroy(image.deleteUrl);
        }

        // Delete partner from database
        await PartnerModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error });
    }
}
