import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
        name: { type: String, required: true },
        image: { type: String, required: true },
        imagePublicId: { type: String, required: true }
})

export const CityModel = mongoose.model('city', citySchema);