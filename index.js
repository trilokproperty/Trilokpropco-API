import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { statusRouter } from "./Routers/status.js";
import { typeRouter } from "./Routers/type.js";
import { amenitiesRouter } from "./Routers/amenities.js";
import { developerRouter } from "./Routers/developer.js";
import { propertyRouter } from "./Routers/property.js";
import { blogCategoryRouter } from "./Routers/blogCategory.js";
import { blogRouter } from "./Routers/blog.js";
import { cityRouter } from "./Routers/city.js";
import { testimonialRouter } from "./Routers/testimonial.js";
import { partnerRouter } from "./Routers/partner.js";
import { footerRouter } from "./Routers/footer.js";
import { formRouter } from "./Routers/formData.js";
import { aboutRouter } from "./Routers/about.js";
import { whyRouter } from "./Routers/why.js";
import { servicesRouter } from "./Routers/services.js";
import { userRouter } from "./Routers/user.js";
import { metaRouter } from "./Routers/meta.js";

const app = express();
const PORT = 5000;
dotenv.config()

const corsConfig ={
    origin:'admin.trilokpropco.com',
    Credential:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig))
app.use(express.json())
app.use('/status', statusRouter)
app.use('/type', typeRouter)
app.use('/amenity', amenitiesRouter)
app.use('/developer', developerRouter)
app.use('/property', propertyRouter)
app.use('/blogCategory', blogCategoryRouter)
app.use('/blog', blogRouter)
app.use('/city', cityRouter)
app.use('/testimonial', testimonialRouter)
app.use('/partner', partnerRouter)
app.use('/footer', footerRouter)
app.use('/about', aboutRouter)
app.use('/why', whyRouter)
app.use('/service', servicesRouter)
app.use('/inquire', formRouter)
app.use('/user', userRouter)
app.use('/meta', metaRouter)


const dbName = "trilokpropertyconsultant"
const dbUser = process.env.DBUSER
const dbPassword = process.env.DBPASS
try{
  await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.vvmocfe.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`)
  console.log("DataBase Connected")
}
catch (e){
    console.log("Error on mongodb:",e)
}

app.get('/', (req, res)=>{
    res.send("Backend is Running")
})

app.listen(PORT, ()=>{
    console.log(`Backend is running on port ${PORT}`)
})