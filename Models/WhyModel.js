import mongoose from "mongoose";

const whySchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        logo: { type: String, required: true },
})

export const WhyModel = mongoose.model('why', whySchema);