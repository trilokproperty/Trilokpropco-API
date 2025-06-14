import { ServicesModel } from "../Models/ServicesModel.js";
import { SectionTextModel } from "../Models/SectionText.js";
import { cloudinary } from "../utils/cloudinary.js";

export const addService = async (req, res) => {
    try {
        const logoResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${encodeURIComponent(req.file.originalname.split('.')[0])}`, // Use the original file name (without extension)
            });
        const serviceData = {
            name: req.body.name,
            details: req.body.details,
            logo: logoResult.secure_url
        };
        const service = new ServicesModel(serviceData);
        const savedService = await service.save();
        res.status(200).json(savedService);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
export const addServiceText = async (req, res) => {
    try{
        const service = new SectionTextModel({serviceDes: req.body.serviceDes});
        const savedService = await service.save();
        res.status(200).json(savedService);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}
export const updateServiceText = async (req, res) => {
    try{
        const { id } = req.params;
        const existingService = await SectionTextModel.findById(id);
        if (!existingService) {
            return res.status(404).json({ message: "Service not found" });
        }
        const updatedData = {
            serviceDes: req.body.serviceDes || existingService.serviceDes
        };
        const updatedService = await SectionTextModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedService);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}
export const getServiceTexts = async (req, res) => {
    try {
        const serviceTexts = await SectionTextModel.find();
        res.status(200).json(serviceTexts);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
export const getServices = async (req, res) => {
    try {
        const services = await ServicesModel.find();
        res.status(200).json(services);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const existingService = await ServicesModel.findById(id);
        if (!existingService) {
            return res.status(404).json({ message: "Service not found" });
        }

        const updatedData = {
            name: req.body.name || existingService.name,
            details: req.body.details || existingService.details
        };

        if (req.file) {
            const logoResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${encodeURIComponent(req.file.originalname.split('.')[0])}`, // Use the original file name (without extension)
            });
            updatedData.logo = logoResult.secure_url;
        } else {
            updatedData.logo = existingService.logo;
        }

        const updatedService = await ServicesModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedService);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await ServicesModel.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
