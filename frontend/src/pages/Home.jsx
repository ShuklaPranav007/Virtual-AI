import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]">
      <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] ">
        Log Out
      </button>
      <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px]
      px-[20px] py-[10px]" onClick={()=>{navigate("/customize")}}> 
        Customize your Assiatant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center flex-col">
        <div className="w-[300px] h-[400] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
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
