import { WhyModel } from "../Models/WhyModel.js";
import { cloudinary } from "../utils/cloudinary.js";

export const addWhy = async (req, res) => {
    try {
        const logoResult = await cloudinary.uploader.upload(req.file.path);
        const whyData = {
            title: req.body.title,
            description: req.body.description,
            logo: logoResult.secure_url
        };
        const why = new WhyModel(whyData);
        const savedWhy = await why.save();
        res.status(200).json(savedWhy);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const getWhys = async (req, res) => {
    try {
        const whys = await WhyModel.find();
        res.status(200).json(whys);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const updateWhy = async (req, res) => {
    try {
        const { id } = req.params;
        const existingWhy = await WhyModel.findById(id);
        if (!existingWhy) {
            return res.status(404).json({ message: "Why entry not found" });
        }

        const updatedData = {
            title: req.body.title || existingWhy.title,
            description: req.body.description || existingWhy.description
        };

        if (req.file) {
            const logoResult = await cloudinary.uploader.upload(req.file.path);
            updatedData.logo = logoResult.secure_url;
        } else {
            updatedData.logo = existingWhy.logo;
        }

        const updatedWhy = await WhyModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedWhy);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const deleteWhy = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWhy = await WhyModel.findByIdAndDelete(id);
        if (!deletedWhy) {
            return res.status(404).json({ message: "Why entry not found" });
        }
        res.status(200).json({ message: "Why entry deleted successfully" });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};