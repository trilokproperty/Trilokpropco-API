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
import prerender from 'prerender-node';


const app = express();
const PORT = 5000;
dotenv.config()

const corsConfig = {
    origin: ['*','https://trilokpropco.com', 'https://www.trilokpropco.com','https://admin.trilokpropco.com','http://localhost:5173'],  // Include the protocol
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.options("", cors(corsConfig))
app.use(cors(corsConfig))
app.use(express.json())
app.use('/api/status', statusRouter);
app.use('/api/type', typeRouter);
app.use('/api/amenity', amenitiesRouter);
app.use('/api/developer', developerRouter);
app.use('/api/property', propertyRouter);
app.use('/api/blogCategory', blogCategoryRouter);
app.use('/api/blog', blogRouter);
app.use('/api/city', cityRouter);
app.use('/api/testimonial', testimonialRouter);
app.use('/api/partner', partnerRouter);
app.use('/api/footer', footerRouter);
app.use('/api/about', aboutRouter);
app.use('/api/why', whyRouter);
app.use('/api/service', servicesRouter);
app.use('/api/inquire', formRouter);
app.use('/api/user', userRouter);
app.use('/api/meta', metaRouter);


app.use(prerender.set('prerenderToken', 'RtOYjmL0QlhrCoIyrjBt'));

//const dbName = "trilokpropertyconsultant"
const dbName = process.env.DBNAME
const dbHost = process.env.DBHOST
const dbUser = process.env.DBUSER
const dbPassword = process.env.DBPASS
try{
  await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`)
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
