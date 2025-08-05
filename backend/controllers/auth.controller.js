import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

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

    try{ //User registration
        await newUser.save()
        res.json("Signup successfully")
    }catch(err){
        // res.status(500).json({message: err.message})
        next(err)
    }
}

export const signin = async(req,res,next) => { //will get req frim login form
    const {email, password} = req.body;

     if( !email || !password || email==="" || password===""){
        return next(errorHandler(400, "All fields are required"))
    }

     try{ //Validation of user
        const validUser = await User.findOne({email})

        if(!validUser){
            return next(errorHandler(404,"User not found"))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password) //comparing password (req.body) with users password (hashed)

        if(!validPassword){
            return next(errorHandler(400,"Wrong Credentials"))
        }

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)

        const {password: pass, ...rest} = validUser._doc //except password, rest of the data will be extracted 
        //Respose will go in frontend wala part
        res.status(200).cookie("access_token", token,{ //cookie(name,value)
            httpOnly: true,
        }).json(rest) //except password

    }catch(err){
        // res.status(500).json({message: err.message})
        next(err)
    }
}