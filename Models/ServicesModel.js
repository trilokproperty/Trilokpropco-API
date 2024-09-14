import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
        name: { type: String, required: true },
        logo: { type: String, required: true },
        details: { type: String, required: true }
})

export const ServicesModel = mongoose.model('services', servicesSchema);