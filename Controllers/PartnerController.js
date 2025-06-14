import { PartnerModel } from "../Models/PartnerModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// Add Partner controller:
export const addPartner = async (req, res) => {
    try {
        let imageResult;
        if (req.file) {
            imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${encodeURIComponent(req.file.originalname.split('.')[0])}`, // Use the original file name (without extension)
            });
        } else {
            return res.status(400).json({ message: "Image is required." });
        }

        const partner = new PartnerModel({
            name: req.body.name,
            image: imageResult.secure_url,
            deleteUrl: imageResult.public_id,
        });

        const savedPartner = await partner.save();
        res.status(200).json(savedPartner);
    } catch (e) {
        console.error("Error in addPartner:", e); // Log the full error
        res.status(500).json({ message: "Internal Server Error.", error: e.message });
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
        if (partner.deleteUrl) {
            await cloudinary.uploader.destroy(partner.deleteUrl);
        }

        // Delete partner from database
        await PartnerModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error });
    }
}
