import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
}, 
{timestamps: true}) //timestamp --> created and updates at

const User = mongoose.model("User",userSchema) //User--> collection (plurals), userSchema --> data

export default User