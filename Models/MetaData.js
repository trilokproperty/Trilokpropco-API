import mongoose from "mongoose";

const metaSchema = new mongoose.Schema({
    metaTitle:{ type: String },
    metaDescription:{ type: String },
    FeaturedImage:{ type: String },
    slug:{ type: String },
})

export const MetaModel = mongoose.model('metaData', metaSchema);