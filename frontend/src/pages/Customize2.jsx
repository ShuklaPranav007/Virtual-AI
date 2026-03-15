import React, { useContext, useState } from "react";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);

  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const [loading, setLoading] = useState(false);

  // Fallback to existing image if no new one is selected
  const previewImage = selectedImage || userData?.assistantImage;

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

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
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
    <div className="relative w-full h-screen bg-gradient-to-br from-[#02021A] via-[#05052b] to-[#0a0a4a] flex justify-center items-center p-5">
      
      {/* Back Button */}
      <div 
        className="absolute top-8 left-8 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full cursor-pointer transition-all border border-white/10"
        onClick={() => navigate("/customize")}
      >
        <MdKeyboardBackspace className="text-white w-7 h-7" />
      </div>

      {/* Glassmorphism Card Wrapper */}
      <div className="flex flex-col items-center w-full max-w-[450px] p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Selected Image Preview */}
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse blur-xl opacity-50"></div>
          {previewImage ? (
            <img
              src={previewImage}
              alt="Assistant Preview"
              className="relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center rounded-full border-4 border-white/20 bg-black/50 text-white text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-8 text-center">
          Name Your Assistant
        </h1>

        {/* Input & Button Group */}
        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Eg. Siri, Jarvis..."
            className="w-full h-14 bg-black/30 border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 text-lg shadow-inner"
            onChange={(e) => setAssistantName(e.target.value)}
            value={assistantName}
            autoComplete="off"
          />

          {/* Button appears right below the input, matching its width */}
          <button
            className={`w-full h-14 flex items-center justify-center rounded-xl text-white font-semibold text-lg transition-all transform ${
              !assistantName
                ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
            }`}
            disabled={loading || !assistantName}
            onClick={handleUpdateAssistant}
          >
            {loading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              "Create Assistant"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Customize2;