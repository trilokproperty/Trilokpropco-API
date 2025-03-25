import { TestimonialModel } from "../Models/TestimonialModel.js";
import { cloudinary } from "../utils/cloudinary.js";
import path from "path";

// Add testimonial controller
export const addTestimonial = async(req, res) =>{
    try{
        const originalName = path.parse(req.file.originalname).name;
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: originalName, // Use the same filename
            overwrite: true // Ensure it replaces any existing file with the same name
        });
        //= await cloudinary.uploader.upload(req.file.path);
        const testimonial = new TestimonialModel({
            name: req.body.name, 
            des: req.body.des, 
            details: req.body.details, 
            rating: req.body.rating, 
            image:imageResult.secure_url
        })
        const savedTestimonial = await testimonial.save();
        res.status(200).json(savedTestimonial)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}

// get testimonial controller
export const getTestimonial = async (req, res) =>{
    try{
      const testimonial = await TestimonialModel.find();
      res.status(200).json(testimonial)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// delete testimonial controller
export const deleteTestimonial = async (req, res) => {
    const id = req.params.id;
    try {
        const testimonial = await TestimonialModel.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }

        // Delete the testimonial from the database
        await TestimonialModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Testimonial deleted successfully." });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

