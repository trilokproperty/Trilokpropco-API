import mongoose from "mongoose";

const amenitiesSchema = new mongoose.Schema({
        name: { type: String, required: true },
        logo: { type: String, required: true },
        imagePublicId: { type: String, required: true }
})

export const AmenitiesModel = mongoose.model('Amenities', amenitiesSchema);