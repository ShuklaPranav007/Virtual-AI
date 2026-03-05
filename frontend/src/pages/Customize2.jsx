import React, { useContext, useState } from "react";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize2 = () => {

  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);

  const navigate = useNavigate();
  const [assistantName, setAssistantName] =
    useState(userData?.assistantName || "");

  const [loading, setLoading] = useState(false);

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
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]">

      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-white text-[30px] text-center">
        Enter Your Assistant Name
      </h1>

      <input
        type="text"
        placeholder="Siri"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white
        bg-transparent text-white placeholder-gray-300
        px-[20px] py-[10px] rounded-full text-[18px]"
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[200px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Create Your Assistant" : "Loading..."}
        </button>
      )}

    </div>
  );
};

export default Customize2;