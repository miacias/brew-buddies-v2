import React, { useState, useEffect } from 'react';
import UserContext from '../utils/UserContext';
import Auth from '../utils/auth';
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_ME);

  useEffect(() => {
    // Logic to retrieve and validate the JWT
    const token = Auth.getToken();
    // Validate the token, decode it, and extract the user data
    if (token) {
        const userData = data?.me || {};
        // sets the user data in the context
        setUserData(userData);
    }
  }, [data?.me]);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
