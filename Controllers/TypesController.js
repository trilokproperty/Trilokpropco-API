import { TypesModel } from "../Models/TypesModel.js";
import { cloudinary } from "../utils/cloudinary.js";
import path from "path";

// add Types controller:
export const addType = async(req, res)=>{
    try{
        const { name } = req.body;
        const existingProject = await TypesModel.findOne({ name });

        if (!existingProject) {
            return res.status(400).json({ message: "Type already exists." });
        }
        const originalName = path.parse(req.file.originalname).name;

        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: originalName, // Use the same filename
            overwrite: true // Ensure it replaces any existing file with the same name
        });
        //await cloudinary.uploader.upload(req.file.path);
        const type = new TypesModel({
            type: req.body.type, 
            logo:imageResult.secure_url,
            imagePublicId: imageResult.public_id})
        const savedType = await type.save();
        res.status(200).json(savedType)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}

// get Types controller:
export const getTypes = async (req, res) =>{
    try{
      const types = await TypesModel.find();
      res.status(200).json(types)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// get type with id:
export const getSingleType = async (req, res)=>{
    const {id} = req.params;
    try{
        const type = await TypesModel.findById(id)
        res.status(200).json(type)
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}

// delete Type controller:
export const deleteType = async(req, res) =>{
    const id = req.params.id;
    try{
        const type = await TypesModel.findById(id);
        if(!type){
            return res.status(404).json({ message: "type not found."})
        }
        await TypesModel.findByIdAndDelete(id);
        res.status(200).json({ message: "type successfully deleted."})
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}