import mongoose from 'mongoose';

const formDataSchema = new mongoose.Schema({
    option:{ type: String},
    name:{ type: String, required: true},
    email:{ type: String},
    phone:{ type: String},    
    project:{ type: String},    
    message:{ type: String},    
    created_at:{ type: Date, default: Date.now},
})

export const FormDataModel = mongoose.model('inquiries', formDataSchema);