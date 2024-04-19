import React, { createContext, useState, useContext } from 'react';

const LoggedInContext = createContext();

export const useLoggedIn = () => useContext(LoggedInContext);

/**
 * 
 * userData is meant to store companies on watchlist.
 */
export const LoggedInProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState({loginInfo: {}, userData: {}});

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};
