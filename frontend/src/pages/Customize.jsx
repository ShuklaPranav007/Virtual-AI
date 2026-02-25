import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import img1 from "../assets/ai1.jpg";
import img2 from "../assets/ai2.jpg";
import img3 from "../assets/ai3.jpg";
import img4 from "../assets/ai4.jpg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    handleCurrentUser,
    loading,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  const navigate = useNavigate()

  const inputImage = useRef();
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t form-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]">
      <h1 className="text-white text-[30px] text-center">
        Select Your Assistant Images
      </h1>
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap">
        <Card image={img1} />
        <Card image={img2} />
        <Card image={img3} />
        <Card image={img4} />
        <div
           className={`w-[150px] m-2 h-[250px] bg-[#030326] border-2 border-blue-500 rounded-2xl cursor-pointer hover:scale-105 transition overflow-hidden hover:border-4 hover:border-white h-full object-cover ${selectedImage=="input"?"border-4 border-white":null}`}
          onClick={() => {inputImage.current.click()
            setSelectedImage("input")
          }
            
          }
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-[25px] h-[25px]" />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage &&  <button className="min-w-[150px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px]" onClick={()=>navigate("/customize2")}>
        Next
      </button>}
     
    </div>
  );
};

export default Customize;
