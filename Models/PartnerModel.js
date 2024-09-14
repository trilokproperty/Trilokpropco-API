import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({ 
    name:{ type: String, required: true },
    images: [{
        url: { type: String, required: true },
        deleteUrl: { type: String, required: true }
    }],
 })

export const PartnerModel = mongoose.model('partners', partnerSchema);
