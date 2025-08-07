import path, { basename } from "path"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import { fileURLToPath } from "url"
// import { errorHandler } from "../utils/error.js"
import fs from "fs"


export const addTravelStory = async (req, res,next) => {
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body //from frontend --> destruction(accessing)

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

export const editTravelStory = async(req, res, next) => {
    const {id} = req.params //from url (endpoint passed in router)
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body
    const userId = req.user.id //from verifyToken

    //Validate required field
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return next(errorHandler(400,"All fields are required"))
    }

     //convert visited date from milliseconds to Date Object -->since date comes in milliseconds
    const parsedVisitedDate = new Date(parseInt(visitedDate)) //converting that into date object

    try {
        //based on the id passed in URL fetch that travelStory info from DB
        const travelStory = await TravelStory.findOne({_id: id, userId: userId})

        if(!travelStory){
            next(errorHandler(404, "Travel Story not found!"))
        }

        const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.jpeg`

        //Updating Travel Story
        travelStory.title = title
        travelStory.story = story
        travelStory.visitedLocation = visitedLocation
        travelStory.imageUrl = imageUrl || placeholderImageUrl //if there is no image then by default placeholderImage will be stored
        travelStory.visitedDate = parsedVisitedDate

        await travelStory.save() //saved the updated travelStory in db

        res.status(200).json({
            story: travelStory,
            message: "Travel Story Updated Successfully!",
        })
    } catch (error) {
        next(error)
    }

}

export const deleteTravelStory = async(req, res, next) => {
    const {id} = req.params
    const userId = req.user.id
    try {
        const travelStory = await TravelStory.findOne({_id: id, userId: userId})

        if(!travelStory){
            next(errorHandler(404, "travel Story not found"))
        }

        //delete travel story from database
        await travelStory.deleteOne({_id: id, userId: userId}) //deletes everything from db, but img will still remain in uploads folder

        //Extract a filename from imageUrl
        const imageUrl = travelStory.imageUrl
        const filename = path.basename(imageUrl)

        //delete the file path
        const filePath = path.join(rootDir,"uploads",filename)

        //check if filePath exists
        if(!fs.existsSync(filePath)){ //checks if exists
            return next(errorHandler(404, "Image not found!"))
        }

        //delete  the file
       await fs.promises.unlink(filePath)

        res.status(200).json({message: "Travel Story Deleted Successfully!"})
    } catch (error) {
        next(error)
    }
}

export const updateIsFavourite = async(req, res, next) => {
    const {id} = req.params
    const {isFavorite} = req.body //OR const isFavorite = req.body.isFavorite
    const userId = req.user.id

    try {
        const travelStory = await TravelStory.findOne({_id: id, userId: userId})

        if(!travelStory){
            return next(errorHandler(404,"Travel Story not found!"))
        }

        travelStory.isFavorite = isFavorite //True or false

        await travelStory.save()

        res.status(200).json({story: travelStory, message: "Updated Successfully"})
    } catch (error) {
        next(error)
    }
}

export const searchTravelStory = async(req, res, next) => {
    const {query} = req.query //as we are searching for something i.e search variable will work as a query parameter (in backend)
    const userId = req.user.id

    if(!query){
        return next(errorHandler(404,"Query is required!"))
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                {title: {$regex: query, $options: "i"}},
                {story: {$regex: query, $options: "i"}},
                {visitedLocation: {$regex: query, $options: "i"}} //i for ignoreCase
            ]
        }).sort({isFavorite: -1}) //favorite story at top

        res.status(200).json({
            stories: searchResults
        })
    } catch (error) {
        next(error)
    }
}