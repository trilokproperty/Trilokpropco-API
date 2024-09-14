import nodemailer from 'nodemailer';
import { FormDataModel } from '../Models/FormDataModel.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const addFormData = async(req, res) =>{
    const {option, name, email, message, phone, project} = req.body;
    const newFormData = new FormDataModel({option, name, email, message, phone, project});
    try{
    await newFormData.save();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.OWNER_EMAIL,
        subject: `New Form Submission by ${name}`,
        text: `Option: ${option},
        Name: ${name},
        Email: ${email},
        Phone: ${phone},
        Project: ${project},
        Message: 
        ${message}`
      };
      transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            return res.status(500).json({error: "Error Sending Email"})
        }
        res.status(200).json({message: "Form Data Saved And Email Sent"});
      })
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const getFormData = async(req, res)=>{
    try{
    const formData = await FormDataModel.find();
    res.status(200).json(formData)
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const deleteFormData = async(req, res) =>{
    const id = req.params.id;
    try{
    const deleteFormData = await FormDataModel.findByIdAndDelete(id)
    if(!deleteFormData){
        return res.status(404).json({message: "Form Data Not Found!"})
    }
    res.status(200).json({message: "Form Data Deleted Successfully."})
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}