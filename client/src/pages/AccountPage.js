import React from "react";
import { Row, Col, Form, Input, Button } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { EditUserForm } from "../components/EditUserForm";
import BreweryCard from "../components/BreweryCard";
import Review from "../components/Review";
import styles from "./UserProfile.module.css";
import Auth from "../utils/auth";
// import { set } from "mongoose";
// const myBreweryList = []
export function AccountPage() {
  const [showForm, setShowForm] = useState(false);
  const [breweryList, setBreweryList] = useState(new Set([]));
  const [Loading, setLoading] = useState(true);
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  useEffect(() => {
    if (!userData) {
      return <h2>Please log in!</h2>;
    }
    if (userData.favBreweries && userData.favBreweries.length > 0) {
      for (let i = 0; i < userData.favBreweries.length; i++) {
        const searchByIdApi = `https://api.openbrewerydb.org/v1/breweries/${userData.favBreweries[i]}`;
        setLoading(true);
        fetch(searchByIdApi)
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            //////We set a new set, saving the data as a new set in the array every time
            setBreweryList((current) => {
              return new Set([...current, data]);
            });
          });
      }
    }
  }, [userData.favBreweries]);

  const imageData = userData.profilePic;
  let profilePic =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  if (Auth.loggedIn()) {
    return (
      <>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "Edit Profile"}
        </Button>
        {showForm && <EditUserForm />}
        <Row>
          <Col>
            <div>
              {imageData ? (
                <img
                  className={styles.profilePic}
                  src={imageData}
                  alt="Database profile"
                />
              ) : (
                <img
                  className={styles.profilePic}
                  src={profilePic}
                  alt="Default profile"
                />
              )}
            </div>
          </Col>
          <Col>
            <h2>
              {userData.username} {userData.postalCode}
            </h2>
            <div>{userData.birthday}</div>
            <div>{userData.pronouns}</div>
            <div>{userData.intro}</div>
            {Array.from(breweryList).map((brewery) => (
              //
              <Row>
              <BreweryCard brewery={brewery} key={brewery.id}/>
                <Button>Delete Favorite Brewery</Button>
            
              </Row>
            ))}
          </Col>
        </Row>
      </>
    );
  } else {
    return <h2>Please log in!</h2>;
  }
}
