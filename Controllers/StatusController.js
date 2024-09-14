import { StatusModel } from "../Models/StatusModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// add status controller:
export const addStatus = async(req, res)=>{
    try{
        const imageResult = await cloudinary.uploader.upload(req.file.path);
        const status = new StatusModel({
            status: req.body.status, 
            image:imageResult.secure_url,
            imagePublicId: imageResult.public_id})
        const savedStatus = await status.save();
        res.status(200).json(savedStatus)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}

// get status controller:
export const getStatus = async (req, res) =>{
    try{
      const statuses = await StatusModel.find();
      res.status(200).json(statuses)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// delete Status controller:
export const deleteStatus = async(req, res) =>{
    const id = req.params.id;
    try{
        const status = await StatusModel.findById(id);
        if(!status){
            return res.status(404).json({ message: "Status not found."})
        }
        await StatusModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Status successfully deleted."})
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}