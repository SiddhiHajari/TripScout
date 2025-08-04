import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"

//configure
dotenv.config() //used to access .env file

mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Database is connected');
    }).catch((error) => {
        console.log(error);
    })

const app = express()

//For allowing json obj in req body
app.use(express.json())

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

app.use("/api/auth",authRoutes)

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500

    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
