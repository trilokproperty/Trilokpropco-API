import mongoose from "mongoose";

const developerSchema = new mongoose.Schema({
        name: { type: String, required: true },
        image: { type: String, required: true },
        details: { type: String, required: true },
        imagePublicId: { type: String, required: true }
})

export const DeveloperModel = mongoose.model('Developer', developerSchema);