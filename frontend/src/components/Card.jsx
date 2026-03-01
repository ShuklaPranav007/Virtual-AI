import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
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
  return (
    <div
      className={`w-[150px] m-2 h-[250px] bg-[#030326] border-2 border-blue-500 rounded-2xl cursor-pointer hover:scale-105 transition overflow-hidden hover:border-4 hover:border-white h-full object-cover ${selectedImage==image?"border-4 border-white":null}`}
      onClick={() => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}
    >
      <img
        src={image}
        className="h-full w-full object-cover"
        alt="assistant"
      />
    </div>
  );
};

export default Card;
