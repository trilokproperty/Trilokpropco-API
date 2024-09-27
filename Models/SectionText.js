import mongoose from "mongoose";

const sectionTextSchema = new mongoose.Schema({ 
    serviceDes: { type: String, required: true },
});

export const SectionTextModel = mongoose.model('sectionText', sectionTextSchema);
