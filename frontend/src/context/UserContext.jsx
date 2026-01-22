import React, { createContext } from "react";

export const userDataContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:8080";

  return (
    <userDataContext.Provider value={{ serverUrl }}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContextProvider;
