import multer from "multer";
import path from "path";

//storage configuration
const storage = multer.diskStorage({  //diskstorage --> gives control on storing files to disk
    destination: function(req,file,cb){ //file--> u wanna access, cb-->callback function, dest k andar function pass karenge
        cb(null,"./uploads/") //null-->setting error, defining destination file
    },

    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname)) //unique file name
    },
})

//file filter to accept only images
const fileFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith("image/")){ //file starts with image
        cb(null, true) //to accept the file we r passing true in it
    }else{
        cb(new Error("Only images are allowed"), false) //file not starts with image
    }
}

//Initialize multer instance
const upload = multer({storage, fileFilter}) //fileFilter --> we only want images so filter that only

export default upload