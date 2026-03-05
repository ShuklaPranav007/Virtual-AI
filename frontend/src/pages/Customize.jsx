import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import img1 from "../assets/ai1.jpg";
import img2 from "../assets/ai2.jpg";
import img3 from "../assets/ai3.jpg";
import img4 from "../assets/ai4.jpg";
import img5 from "../assets/ai5.webp";
import img6 from "../assets/ai6.webp";
import img7 from "../assets/ai7.jpg";
import img8 from "../assets/ai8.webp";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

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
  const navigate = useNavigate();

  const inputImage = useRef();
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t form-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]">
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white text-[30px] text-center">
        Select Your Assistant Images
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center ">
        <Card image={img1} />
        <Card image={img2} />
        <Card image={img3} />
        <Card image={img4} />
        <Card image={img5} />
        <Card image={img6} />
        <Card image={img7} />
        <Card image={img8} />
       <div
  className={`w-[120px] h-[120px] m-3 bg-[#030326] border-2 border-blue-500 rounded-full cursor-pointer hover:scale-105 transition overflow-hidden flex items-center justify-center hover:border-4 hover:border-white ${selectedImage == "input" ? "border-4 border-white" : ""}`}
  onClick={() => {
    inputImage.current.click();
    setSelectedImage("input");
  }}
>
  {!frontendImage && (
    <RiImageAddLine className="text-white w-[60px] h-[60px]" />
  )}

  {frontendImage && (
    <img
      src={frontendImage}
      className="w-full h-full object-cover"
    />
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
      {selectedImage && (
        <button
          className="min-w-[150px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px]"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
