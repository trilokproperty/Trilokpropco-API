import { PartnerModel } from "../Models/PartnerModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// Add Partner controller:
export const addPartner = async (req, res) => {
    try {
        if (req.file) {
            imageResult = await cloudinary.uploader.upload(req.file.path);
        }

        const partner = new PartnerModel({
            name: req.body.name,
            image: imageResult ? imageResult.secure_url : undefined,
            deleteUrl: imageResult ? imageResult.public_id : undefined,
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
