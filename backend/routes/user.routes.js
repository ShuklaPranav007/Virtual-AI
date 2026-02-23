// import express from "express"
// import { getCurrentUser } from "../controllers/auth.controller.js"
// import isAuth from "../middleware/isAuth.js"

// const userRouter = express.Router()

// authRouter.get("/current",isAuth, getCurrentUser)

// export default userRouter


import express from "express";
import { getCurrentUser } from "../controllers/auth.controller.js";
import isAuth from "../middleware/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

export default userRouter;