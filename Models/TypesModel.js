import mongoose from "mongoose";

const typesSchema = new mongoose.Schema({
        type: { type: String, required: true },
        logo: { type: String, required: true },
        imagePublicId: { type: String, required: true }
})

export const TypesModel = mongoose.model('Types', typesSchema);