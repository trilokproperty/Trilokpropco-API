import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({ 
    description: { type: String, required: true },
    image: { type: String, required: true },
    facebook: { type: String, required: true },
    instagram: { type: String, required: true },
    youtube: { type: String, required: true },
    linkedin: { type: String, required: true },
    whatsapp: { type: String, required: true },
    twitter: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
});

export const FooterModel = mongoose.model('Footer', footerSchema);
