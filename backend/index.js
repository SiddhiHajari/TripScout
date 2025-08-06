import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import path from "path"
import { fileURLToPath } from "url"


//configure
dotenv.config() //used to access .env file

mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Database is connected');
    }).catch((error) => {
        console.log(error);
    })

const app = express()

app.use(cookieParser()) //to use cookie

//For allowing json obj in req body
app.use(express.json())

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/travel-story",travelStoryRoutes)

//to serve/access static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url) //convert url into path (imageUrl from controller.js)
const __dirname = path.dirname(__filename)

app.use("/uploads",express.static(path.join(__dirname,"uploads"))) //since img is a static file

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500

    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
