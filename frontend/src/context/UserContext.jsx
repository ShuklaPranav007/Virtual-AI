import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContextProvider({ children }) {
  const serverUrl = "http://localhost:8080";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage]= useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );

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
        frontendImage, setFrontendImage,
        backendImage, setBackendImage,
        selectedImage, setSelectedImage
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}

export default UserContextProvider;