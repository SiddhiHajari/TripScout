import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

//configure
dotenv.config() //used to access .env file

mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Database is connected');
    }).catch((error) => {
        console.log(error);
    })

const app = express()

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

