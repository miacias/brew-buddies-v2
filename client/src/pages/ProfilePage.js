import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Button, Card, } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER, GET_ME } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND, REMOVE_FAV_BREWERY } from "../utils/mutations";
import { EditUserForm } from "../components/EditUserForm";
import BreweryCard from "../components/BreweryCard";
import styles from "./UserProfile.module.css";
import Auth from "../utils/auth";
import { byManyIds } from "../utils/OpenBreweryDbApi";
const ObjectId = require("bson-objectid");


export function ProfilePage() {
    const navigate = useNavigate();
    const { username } = useParams();
    // React States
    const [showForm, setShowForm] = useState(false);
    const [Loading, setLoading] = useState(true);
    const [breweryList, setBreweryList] = useState(new Set([]));
    // queries and mutations
    const [removeFavBrewery] = useMutation(REMOVE_FAV_BREWERY);
    const [addFriend] = useMutation(ADD_FRIEND);
    const [removeFriend] = useMutation(REMOVE_FRIEND);
    const {
        loading: loadingMe,
        error: errorMe,
        data: dataMe,
        refetch,
      } = useQuery(GET_ME);
    const {
        loading: loadingUser,
        error: errorUser,
        data: dataUser,
      } = useQuery(GET_USER, {
        variables: { username },
      });
    // profile data
    const userData = data?.me || {};
    const imageData = userData.profilePic;
    let profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    // handles favorite brewery list data
    const breweryApi = async () => {
        if (userData.favBreweries && userData.favBreweries.length > 0) {
            setLoading(true);
            const myBreweries = await byManyIds(userData.favBreweries);
            setLoading(false);
            // saves data as a new set in array
            setBreweryList((current) => {
                // checks if the brewery already exists in the set
                if (![...current].some((brewery) => brewery.id === data.id)) {
                    // adds breweries to set without adding duplicates
                    return new Set([...current, myBreweries]);
                }
                return current;
            });
            refetch();
        }
    }

    // sets loading and sets brewery list data in react State
    useEffect(() => {
        if (!userData) {
        return <h2>Please log in!</h2>;
        } else {
        breweryApi();
        }
    }, [userData.favBreweries]);

    // removes favorite brewery
    const handleRemoveFav = async (breweryId) => {
        try {
            const { data } = await removeFavBrewery({
                variables: {
                breweryId: breweryId,
                },
            });
            // creates a new set of breweries excluding the deleted brewery
            setBreweryList((current) => {
                const updatedBreweries = new Set(
                [...current].filter((brewery) => brewery.id !== breweryId)
                );
                return updatedBreweries;
            });
        } catch (err) {
            console.log(err);
        }
    };

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
              <div style={{fontSize: '24px'}}>
                <h2>
                  {userData.username} 
                </h2>
                  {userData.pronouns}
                </div>
                {/* <div>{userData.birthday}</div> */}
                
    
                <div>{userData.intro}</div>
            </Col>
          </Row>
                <Card title={<h2 style={{ fontSize: '24px' }}>Friend List</h2>} style={{ width: '25%' }}>
                  {userData.friends && userData.friends.length > 0 ? (
                    userData.friends.map((friend) => (
                      <div key={friend.username} style ={{fontSize: '18px'}}>
                      <Link to={`/profile/${friend.username}`} >{friend.username}</Link>
                      </div>
                    ))
                  )
                   : (
                    <p>You have no friends yet!</p>
                  )}
                </Card>
                <Row>
                  {Array.from(breweryList).map((brewery) => (
                      <BreweryCard
                        brewery={brewery}
                        key={brewery.id}
                        handleRemoveFav={handleRemoveFav}
                      />
                  ))}
                </Row>
          </>
        );
      } else {
        return <h2>Please log in!</h2>;
      }
}
