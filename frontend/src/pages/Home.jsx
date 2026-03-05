import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData,serverUrl,setUserData } = useContext(userDataContext);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const handleLogOut = async ()=>{
    setLoading(true)
    try{
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
        {withCredentials:true}
      )
      setLoading(false)
      setUserData(null)
      navigate("/")

    }
    catch(error){
      setLoading(false)
      setUserData(null)
      console.log(error)
    }
  }
  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]">
      <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] cursor-pointer " onClick={handleLogOut}>
        Log Out
      </button>
      <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px]
      px-[20px] py-[10px] cursor-pointer" onClick={()=>{navigate("/customize")}}> 
        Customize your Assiatant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center flex-col">
        <div className="w-[300px] h-[400] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg gap-[30px]">
          <img
            src={userData?.assistantImage}
            alt=""
            className="h-full object-cover"
          />
        </div>
        <h1 className="text-white">
          I'm {userData?.assistantName} your Assistant{" "}
        </h1>
      </div>
    </div>
  );
};

export default Home;
