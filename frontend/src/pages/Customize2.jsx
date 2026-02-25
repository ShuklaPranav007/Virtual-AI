import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";


const Customize2 = () => {
  const {userData}=useContext(userDataContext)  
  const [assistantName, setAssistantName]=useState(userData?.AssistantName || "")

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t form-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]"><h1 className="text-white text-[30px] text-center">
      Enter Your Assistant Name
    </h1>
    <input
          type="text"
          placeholder="Siri"
          className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white
          bg-transparent text-white placeholder-gray-300
          px-[20px] py-[10px] rounded-full text-[18px]"
          onChange={(e)=>setAssistantName(e.target.value)}
          vaalue = {assistantName}
          required
        />
        {assistantName && <button className="min-w-[200px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px]" onClick={()=>navigate("/customize2")}>
        Create Your Assistant
      </button>}
         
    </div>

  );
};

export default Customize2;
