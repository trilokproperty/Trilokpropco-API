import { AboutModel } from "../Models/AboutMode.js";
import { cloudinary } from "../utils/cloudinary.js";
import path from "path";

export const addAbout = async (req, res) => {
    try {
        // const imageResult = await cloudinary.uploader.upload(req.file.path);
        
        const originalName = path.parse(req.file.originalname).name;

        // Upload the new image
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: originalName, // Use the same filename
            overwrite: true // Ensure it replaces any existing file with the same name
        });
        const aboutData = {
            history: req.body.history,
            mission: req.body.mission,
            vision: req.body.vision,
            founder: req.body.founder,
            founderLogo: imageResult.secure_url,
            locationMap: req.body.locationMap,
            imagePublicId: imageResult.public_id,
        };
        console.log(aboutData)
        const about = new AboutModel(aboutData);
        const savedAbout = await about.save();
        res.status(200).json(savedAbout);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const getAbout = async (req, res) => {
    try {
        const about = await AboutModel.findOne();
        if (!about) {
            return res.status(404).json({ message: "About section not found" });
        }
        res.status(200).json(about);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const updateAbout = async (req, res) => {
    try {
        const { id } = req.params;
        const existingAbout = await AboutModel.findById(id);
        if (!existingAbout) {
            return res.status(404).json({ message: "About section not found" });
        }

        const updatedData = {
            history: req.body.history || existingAbout.history,
            mission: req.body.mission || existingAbout.mission,
            vision: req.body.vision || existingAbout.vision,
            founder: req.body.founder || existingAbout.founder,
            locationMap: req.body.locationMap || existingAbout.locationMap,
        };

        if (req.file) {
            // Delete the old image from cloudinary
            await cloudinary.uploader.destroy(existingAbout.imagePublicId);
            const originalName = path.parse(req.file.originalname).name;

            // Upload the new image
            const imageResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: originalName, // Use the same filename
                overwrite: true // Ensure it replaces any existing file with the same name
            });
            updatedData.founderLogo = imageResult.secure_url;
        } else {
            updatedData.imagePublicId = existingAbout.imagePublicId;
        }

        const updatedAbout = await AboutModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedAbout);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};