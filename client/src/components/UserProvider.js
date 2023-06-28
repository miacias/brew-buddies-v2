import React, { useState, useEffect, createContext, useContext } from 'react';
import Auth from '../utils/auth';
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";


const UserContext = createContext();


export const useUserContext = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { loading, error, data /*, refetch */ } = useQuery(GET_ME);

  const fetchToken = async () => {
    return new Promise((resolve) => {
      const token = Auth.getToken();
      resolve(token);
    })
  }

  useEffect(() => {
    if (!Auth.loggedIn()) {
      setUserData(null); // clears user data if the user is not logged in
      return;
    }
    // retrieves and validates JWT
    const token = Auth.getToken();
    // validates token, decodes it, then extracts user data from DB
    if (!Auth.isTokenExpired(token) && !loading && !error) {
        // checks if the "errors" array exists and is not empty
      if (data && data.me && data.me.errors && data.me.errors.length > 0) {
        console.error(error.message);
      } else {
        const userData = data?.me || {};
        // sets the user data in the context
        setUserData(userData);
      }
    }
  }, [data, error, loading]);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

