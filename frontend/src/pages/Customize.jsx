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
import axios from "axios";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getAuthHeaders, // <--- ADDED THIS
  } = useContext(userDataContext);
  
  const navigate = useNavigate();
  const inputImage = useRef();

  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      // --- UPDATED: Using getAuthHeaders() instead of withCredentials ---
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        getAuthHeaders()
      );

      setUserData(result.data);
      navigate("/"); 
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col lg:flex-row justify-center items-center p-[20px] lg:p-[50px] gap-[40px] overflow-y-auto relative">
      
      {/* Back Button */}
      <div 
        className="absolute top-6 left-6 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full cursor-pointer transition-all border border-white/10 z-10"
        onClick={() => navigate("/")}
      >
        <MdKeyboardBackspace className="text-white w-7 h-7" />
      </div>

      {/* --- LEFT SECTION: Image Grid --- */}
      <div className="flex-1 w-full flex flex-col items-center justify-center mt-16 lg:mt-0">
        <h1 className="text-white text-[30px] font-bold text-center mb-[30px] drop-shadow-lg">
          Select Assistant Avatar
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full max-w-3xl p-4 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5">
          <Card image={img1} />
          <Card image={img2} />
          <Card image={img3} />
          <Card image={img4} />
          <Card image={img5} />
          <Card image={img6} />
          <Card image={img7} />
          <Card image={img8} />
          
          {/* Custom Upload Button */}
          <div
            className={`w-[120px] h-[120px] m-3 bg-[#030326] border-2 border-blue-500 rounded-full cursor-pointer hover:scale-105 transition overflow-hidden flex items-center justify-center hover:border-4 hover:border-white shadow-lg ${
              selectedImage === "input" ? "border-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""
            }`}
            onClick={() => {
              inputImage.current.click();
              setSelectedImage("input");
            }}
          >
            {!frontendImage && (
              <RiImageAddLine className="text-white w-[50px] h-[50px]" />
            )}

            {frontendImage && (
              <img src={frontendImage} className="w-full h-full object-cover" alt="Upload Preview" />
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
      </div>

      {/* --- RIGHT SECTION: Name Input & Submit --- */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col items-center justify-center gap-6 bg-white/5 p-10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center mb-2">
          Name Your Assistant
        </h2>

        {/* Name Input Field */}
        <input
          type="text"
          placeholder="Eg. Siri, Jarvis..."
          className="w-full h-[60px] outline-none border-2 border-white/20 focus:border-blue-500 bg-black/30 text-white placeholder-gray-500 px-[20px] py-[10px] rounded-xl text-[18px] transition-all shadow-inner"
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
          autoComplete="off"
        />

        {/* Submit Button */}
        <button
          className={`w-full h-[60px] font-semibold rounded-xl text-[19px] transition-all transform ${
            !assistantName || !selectedImage
              ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
          }`}
          disabled={loading || !assistantName || !selectedImage}
          onClick={handleUpdateAssistant}
        >
          {loading ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            "Create Assistant"
          )}
        </button>

        {/* Helpful hints */}
        <div className="mt-2 text-sm text-center">
          {!selectedImage && <p className="text-red-400/80 mb-1">* Please select an avatar first</p>}
          {!assistantName && <p className="text-red-400/80">* Please provide a name</p>}
        </div>
      </div>

    </div>
  );
};

export default Customize;