import jwt, { verify } from "jsonwebtoken"

const isAUth = async (req, res, next)=>{
    try{
        const token = req.cookie.token
        if(!token){
            return res.status(400).json({message:"token not found"})
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
        req.userId= verifyToken.userId

        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"is auth error!!"})
    }
}

export default isAUth