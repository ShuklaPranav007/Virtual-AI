import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContextProvider({ children }) {
  const serverUrl = "https://virtual-ai-backend-0iiu.onrender.com";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const getGeminiResponse = async (command) => {
    try {
      // 1. Changed URL to the "ask" route (Verify this matches your backend!)
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`, 
        { command },
        { withCredentials: true }
      );
      
      return result.data; 

    } catch (error) {
      console.log("Error fetching Gemini response:", error);
      
      return { response: "Sorry, I am having trouble connecting to my server." };
    }
  };

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      setUserData(result.data);
    } catch (error) {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider
      value={{
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
        getGeminiResponse,
      }}
    >
      {children}{" "}
    </userDataContext.Provider>
  );
}

export default UserContextProvider;
