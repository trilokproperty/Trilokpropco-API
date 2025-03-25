import { AmenitiesModel } from "../Models/AmenitiesModel.js";
import { cloudinary } from "../utils/cloudinary.js";
import path from "path";

// add Amenities controller:
export const addAmenities = async(req, res)=>{
    try{
        // const imageResult = await cloudinary.uploader.upload(req.file.path);
        
        const originalName = path.parse(req.file.originalname).name;

        // Upload the new image
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: originalName, // Use the same filename
            overwrite: true // Ensure it replaces any existing file with the same name
        });
        const amenities = new AmenitiesModel({
            name: req.body.name, 
            logo:imageResult.secure_url,
            imagePublicId: imageResult.public_id})
        const savedAmenities = await amenities.save();
        res.status(200).json(savedAmenities)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}
// get Amenities controller:
export const getAmenities = async (req, res) =>{
    try{
      const amenities = await AmenitiesModel.find();
      res.status(200).json(amenities)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// delete Amenity controller:
export const deleteAmenity = async(req, res) =>{
    const id = req.params.id;
    try{
        const amenity = await AmenitiesModel.findById(id);
        if(!amenity){
            return res.status(404).json({ message: "Amenity not found."})
        }
        await AmenitiesModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Amenity successfully deleted."})
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}