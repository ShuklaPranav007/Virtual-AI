// import jwt from "jsonwebtoken";
// const getToken = async (userId)=>{
//     try{
//         const token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"10d"})
//         return token
//     }catch(error){
//         console.log(error)
//     }
// }

// export default getToken


import jwt from "jsonwebtoken";

const getToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );
};

export default getToken;