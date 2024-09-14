import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
        history: { type: String, required: true },
        mission: { type: String, required: true },
        vision: { type: String, required: true },
        founder: { type: String, required: true },
        founderLogo: { type: String, required: true },
        locationMap: { type: String, required: true },
        imagePublicId: { type: String, required: true }
})

export const AboutModel = mongoose.model('about', aboutSchema);