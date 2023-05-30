import React, { useState, useEffect } from 'react';
import UserContext from '../utils/UserContext';
import Auth from '../utils/auth';
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { loading, error, data /*, refetch */ } = useQuery(GET_ME);

  useEffect(() => {
    // retrieves and validates JWT
    const token = Auth.getToken();
    // validates token, decodes it, then extracts user data from DB
    if (!Auth.isTokenExpired(token) && !loading && !error) {
        // checks if the "errors" array exists and is not empty
      if (data && data.me && data.me.errors && data.me.errors.length > 0) {
        console.log(error.message);
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

export default UserProvider;
