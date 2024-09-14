import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    des: { type: String, required: true },
    details: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true }
})

export const TestimonialModel = mongoose.model('testimonials', testimonialSchema);