import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
})

export const UserModel = mongoose.model('user', userSchema);