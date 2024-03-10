import React, { createContext, useState, useContext } from 'react';

const LoggedInContext = createContext();

export const useLoggedIn = () => useContext(LoggedInContext);

export const LoggedInProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState({loggedInStatus: false, data: {}});

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};
