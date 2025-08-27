import express from "express" //common
// import { verify } from "jsonwebtoken"
import { getUsers, signout } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router() //common

router.get("/getusers",verifyToken,getUsers)

router.post("/signout", signout)

export default router //common