
import { CityModel } from "../Models/CityModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// add City controller:
export const addCity = async(req, res)=>{
    try{
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${encodeURIComponent(req.file.originalname.split('.')[0])}`, // Use the original file name (without extension)
            });
        const city = new CityModel({name: req.body.name, image:imageResult.secure_url,
            imagePublicId: imageResult.public_id})
        const savedCity = await city.save();
        res.status(200).json(savedCity)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}
// get City controller:
export const getCity = async (req, res) =>{
    try{
      const city = await CityModel.find();
      res.status(200).json(city)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}
// get city with id:
export const getSingleCity = async (req, res)=>{
    const {id} = req.params;
    try{
        const city = await CityModel.findById(id)
        res.status(200).json(city)
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}
// delete City controller:
export const deleteCity = async(req, res) =>{
    const id = req.params.id;
    try{
        const city = await CityModel.findById(id);
        if(!city){
            return res.status(404).json({ message: "City not found."})
        }
        await CityModel.findByIdAndDelete(id);
        res.status(200).json({ message: "City successfully deleted."})
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
    }
}