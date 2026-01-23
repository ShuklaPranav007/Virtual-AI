import express from "express"
import { getCurrentUser } from "../controllers/auth.controller.js"

const userRouter = express.Router()

authRouter.get("/current", getCurrentUser)

export default userRouter