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

  // Helper function to attach the token to requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`, 
        { command },
        getAuthHeaders() // Send the token!
      );
      return result.data; 
    } catch (error) {
      console.log("Error fetching Gemini response:", error);
      return { response: "Sorry, I am having trouble connecting to my server." };
    }
  };

  const handleCurrentUser = async () => {
    const token = localStorage.getItem("token");
    
    // If no token exists, don't even bother asking the backend
    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`, 
        getAuthHeaders() // Send the token!
      );
      setUserData(result.data);
    } catch (error) {
      console.log("Session expired or invalid token.");
      setUserData(null);
      localStorage.removeItem("token"); // Clean up broken token
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
        getAuthHeaders, // Pass this down so Customize.jsx can use it!
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}

export default UserContextProvider;