import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)



app.listen(port,()=>{
    connectDb()
    console.log(`listening to port ${port}`)
})