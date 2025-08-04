import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"

export const signup = async(req, res, next) => {
    const {username, email, password} = req.body

    if(!username || !email || !password || username==="" || email==="" || password===""){
        return next(errorHandler(400, "All fields are required"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10) //here 10(default value) is salt number high salt means strong encryption

    const newUser = new User({
        username, 
        email,
        password: hashedPassword,
    })

    try{
        await newUser.save()
        res.json("Signup successfully")
    }catch(err){
        // res.status(500).json({message: err.message})
        next(err)
    }
}