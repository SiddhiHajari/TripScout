import express from "express" //all the above is basic setup to route the apis
import { signin, signup } from "../controllers/auth.controller.js"

const router = express.Router() //all the above is basic setup to route the apis

router.post("/signup",signup) //will define signup function inside the controller
router.post("/signin", signin)

export default router //all the above is basic setup to route the apis