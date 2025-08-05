import express from "express" //common
// import { verify } from "jsonwebtoken"
import { getUsers } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router() //common

router.get("/getusers",verifyToken,getUsers)

export default router //common