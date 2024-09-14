import { DeveloperModel } from "../Models/DeveloperModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// add Developers controller:
export const addDeveloper = async(req, res)=>{
    try{
        const imageResult = await cloudinary.uploader.upload(req.file.path);
        const developer = new DeveloperModel({name: req.body.name, details: req.body.details, image:imageResult.secure_url,
            imagePublicId: imageResult.public_id})
        const savedDeveloper = await developer.save();
        res.status(200).json(savedDeveloper)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}

// get Developers controller:
export const getDeveloper = async (req, res) =>{
    try{
      const developers = await DeveloperModel.find();
      res.status(200).json(developers)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// delete Property controller:
export const deleteDeveloper = async(req, res) =>{
    const id = req.params.id;
    try{
        const developer = await DeveloperModel.findById(id);
        if(!developer){
            return res.status(404).json({ message: "Developer not found."})
        }
        await DeveloperModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Developer successfully deleted."})
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}