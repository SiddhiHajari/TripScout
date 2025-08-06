import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
// import { errorHandler } from "../utils/error.js"

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