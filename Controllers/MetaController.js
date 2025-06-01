
import { MetaModel } from "../Models/MetaData.js";
import { cloudinary } from "../utils/cloudinary.js";

// Add Footer controller
export const addMeta = async (req, res) => {
    try {
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${req.file.originalname.split('.')[0]}`, // Use the original file name (without extension)
            });
        const metaData = {
            metaTitle: req.body.metaTitle,
            FeaturedImage: imageResult.secure_url,
            metaDescription: req.body.metaDescription,
        };
        const meta = new MetaModel(metaData);
        const savedMeta = await meta.save();
        res.status(200).json(savedMeta);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


// Update Footer Meta controller
export const updateMeta = async (req, res) => {
    try {
        const metaId = req.params.id;
        const meta = await MetaModel.findById(metaId);

        if (!meta) {
            return res.status(404).json({ message: "Meta not found." });
        }

        let updatedData = {
            metaTitle: req.body.metaTitle || meta.metaTitle,
            metaDescription: req.body.metaDescription || meta.metaDescription,
        };

        // If a new image is uploaded, update the image
        if (req.file) {
            const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${req.file.originalname.split('.')[0]}`, // Use the original file name (without extension)
            });
            updatedData.FeaturedImage = imageResult.secure_url;
        }

        const updatedMeta = await MetaModel.findByIdAndUpdate(metaId, updatedData, { new: true });

        res.status(200).json(updatedMeta);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// Get All Footer Meta controller
export const getAllMeta = async (req, res) => {
    try {
        const metaList = await MetaModel.find();
        res.status(200).json(metaList);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
