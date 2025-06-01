import { FooterModel } from "../Models/FooterModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// Add Footer controller
export const addFooter = async (req, res) => {
    try {
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${req.file.originalname.split('.')[0]}`, // Use the original file name (without extension)
            });
        const footerData = {
            description: req.body.description,
            regis: req.body.regis,
            image: imageResult.secure_url,
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            linkedin: req.body.linkedin,
            whatsapp: req.body.whatsapp,
            twitter: req.body.twitter,
            email: req.body.email,
            contact: req.body.contact,
            location: req.body.location,
        };
        const footer = new FooterModel(footerData);
        const savedFooter = await footer.save();
        res.status(200).json(savedFooter);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// Get Footers controller
export const getFooters = async (req, res) => {
    try {
        const footers = await FooterModel.find();
        res.status(200).json(footers);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// Update Footer controller
export const updateFooter = async (req, res) => {
    
    try {
        const { id } = req.params;
        const existingFooter = await FooterModel.findById(id);
        if (!existingFooter) {
            return res.status(404).json({ message: "Footer not found" });
        }

        const updatedData = {
            description: req.body.description || existingFooter.description,
            regis: req.body.regis || existingFooter.regis,
            facebook: req.body.facebook || existingFooter.facebook,
            instagram: req.body.instagram || existingFooter.instagram,
            youtube: req.body.youtube || existingFooter.youtube,
            linkedin: req.body.linkedin || existingFooter.linkedin,
            whatsapp: req.body.whatsapp || existingFooter.whatsapp,
            twitter: req.body.twitter || existingFooter.twitter,
            email: req.body.email || existingFooter.email,
            contact: req.body.contact || existingFooter.contact,
            location: req.body.location || existingFooter.location,
        };

        if (req.file) {
            const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${req.file.originalname.split('.')[0]}`, // Use the original file name (without extension)
            });
            updatedData.image = imageResult.secure_url;
        } else {
            updatedData.image = existingFooter.image;
        }

        const updatedFooter = await FooterModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedFooter);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
