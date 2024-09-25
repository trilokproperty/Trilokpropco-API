import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
        category: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category', 
            required: true 
                  },
        title: {
            type: String,
            required: true
        },
    metaTitle:{ type: String },
    metaDescription:{ type: String },
        description:{
            type: String,
            required: true
        },
        image:{
            type: String,
            required: true
        },
        imagePublicId: { type: String, required: true },
        date: {
            type: Date,
            default: Date.now
        }
    })

export const blogModel = mongoose.model('blog', blogSchema);