import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
        status: { type: String, required: true },
        image: { type: String, required: true },
        imagePublicId: { type: String, required: true }
})

export const StatusModel = mongoose.model('Status', statusSchema);