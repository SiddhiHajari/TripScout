import path from "path"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import { fileURLToPath } from "url"
// import { errorHandler } from "../utils/error.js"
import fs from "fs"

export const addTravelStory = async (req, res,next) => {
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body //from frontend

    const userId = req.user.id //from verifyToken method in utils-->verifyUser

    //validate required field
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return next(errorHandler(400,"All fields are required"))
    }

    //convert visited date from milliseconds to Date Object -->since date comes in milliseconds
    const parsedVisitedDate = new Date(parseInt(visitedDate)) //converting that into date object

    //title: title since the names are same --> simply can be written as title
    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        })

        await travelStory.save() //will be stored in database

        res.status(201).json({
            story: travelStory,
            message: "Your story is added successfully!",
        })
    } catch (error) {
        next(error)
    }
 }

export const getAllTravelStory = async(req,res,next)=>{
    const userId = req.user.id //from verifyUser

    try {

        const travelStories = await TravelStory.find({userId: userId}).sort({
            isFavorite: -1, //on top
        })

        res.status(200).json({stories: travelStories})
        
    } catch (error) {
        next(error)
    }
}

export const imageUpload = async(req, res, next)=>{
    try {
        if(!req.file){
            return next(errorHandler(400,"No image uploaded"))
        }

        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        res.status(201).json({imageUrl})
    } catch (error) {
        next(error)
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) //its taking tripScout/backend/controllers/ --> wrong path

const rootDir = path.join(__dirname,"..") //its taking tripScout/backend/ --> right path
export const deleteImage = async(req, res, next)=>{
    const {imageUrl} = req.query

    if(!imageUrl){
        return next(errorHandler(400,"ImageUrl parameter is required!"))
    }

    try {
        //extract the filename from the imageUrl
        const filename = path.basename(imageUrl) //basename --> /45754343.png

        //Delete the file path
        //find out the path
        const filePath = path.join(rootDir,"uploads",filename) //join dir,uploads and filename --> tripScout/backend/uploads/12234.png
        console.log(filePath)

        //check if file exists
        if(!fs.existsSync(filePath)){
            return next(errorHandler(404,"Image not found!"))
        }

        //delete the file
        await fs.promises.unlink(filePath) //delete file using its path

        res.status(200).json({message: "Image deleted successfully!"})

    } catch (error) {
        next(error)
    }
}