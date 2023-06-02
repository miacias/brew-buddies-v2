import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from '../components/UserProvider';
import { Avatar, Divider } from "antd";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_USER, GET_FRIENDS } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND, REMOVE_FAV_BREWERY } from "../utils/mutations";
import { format_date } from '../utils/formatters';
import UserProfile from '../components/UserProfile';
import ProfileTabs from '../components/ProfileTabs'
import FriendsList from "../components/FriendsList";
import BreweryFavorites from "../components/BreweryFavorites";
import BreweryWishlist from '../components/BreweryWishlist';
import Auth from "../utils/auth";
import * as API from '../utils/OpenBreweryDbApi';
const ObjectId = require("bson-objectid");

export function ProfilePage() {
  const client = useApolloClient();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [friendsData, setFriendsData] = useState(null);
  const [breweryFaves, setBreweryFaves] = useState(new Set([]));
  const [breweryWishes, setBreweryWishes] = useState(new Set([]));
  const [showForm, setShowForm] = useState(false);
  const { loading, error, data: userData, refetch } = useQuery(GET_USER, {
    variables: { username },
  });
  const [follow] = useMutation(ADD_FRIEND);
  const [unfollow] = useMutation(REMOVE_FRIEND);
  const [removeFavBrewery] = useMutation(REMOVE_FAV_BREWERY);


  // gets loggedIn user's ID
  const myData = useUserContext();
  const myId = Auth.getProfile()?.data?._id;

  const isFollowing = myData && friendsData && myData.friends.some(
    (friend) => friend._id === profileData?._id
  );

  // sets page data from URL and DB
  useEffect(() => {
    if (!loading && userData && userData.user) {
      setProfileData(userData.user);
    }
    refetch();
  }, [loading, error, userData, profileData, refetch]);

  // initiates friends list DB fetch for profile page once profile data is available
  useEffect(() => {
    if (profileData && profileData.friends && profileData.friends.length > 0) {
      const friendsIdList = profileData.friends.map((friend) => friend._id);
      fetchFriends(friendsIdList);
    }
  }, [profileData]);

  // refetch friend data when username changes
  useEffect(() => {
    refetch();
    if (profileData) {
      const friendsIdList = profileData.friends.map((friend) => friend._id);
      fetchFriends(friendsIdList);
    }
  }, [username, profileData]);

  // tracks breweries lists
  useEffect(() => {
    if (profileData?.favBreweries && profileData?.favBreweries.length > 0) {
      const fetchFaves = async () => {
        const data = await API.byManyIds(profileData.favBreweries);
        setBreweryFaves(data);
      }
      fetchFaves();
    }
    if (profileData?.wishBreweries && profileData?.wishBreweries.length > 0) {
      const fetchWishes = async () => {
        const data = await API.byManyIds(profileData.wishBreweries);
        setBreweryWishes(data);
      }
      fetchWishes();
    }
  }, [username, profileData])

  // gets and sets friend user data for given profile
  const fetchFriends = async (friendsIdList) => {
    try {
      const { data } = await client.query({
        query: GET_FRIENDS,
        variables: { ids: friendsIdList },
      });
      if (data && data?.getFriends) {
        setFriendsData(data.getFriends);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleFollow = async () => {
    try {
      const { data } = await follow({
        variables: {
          friendId: new ObjectId(profileData._id),
        },
      });
      if (!data) {
        throw new Error("You have no friends");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (friendId) => {
    try {
      const { data } = await unfollow({
        variables: {
          friendId: new ObjectId(friendId),
        },
      });
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  // removes favorite brewery
  const handleRemoveFavBrewery = async (breweryId) => {
    try {
      const { data } = await removeFavBrewery({
        variables: {
          brewery: breweryId,
        },
      });
      if (data) {
        setBreweryFaves((current) => {
          // creates a new set of breweries excluding the deleted brewery
          const updatedBreweries = new Set(
            [...current].filter((brewery) => brewery.id !== breweryId)
          );
          return updatedBreweries;
        });
      }
      refetch();
    } catch (err) {
      console.error(err);
    }
  };
  
  // renders user friends, favorites, and wish lists
  const tabItems = [
    {
      label: `Follows (${profileData?.followsCount || 0})`,
      key: 1,
      children: <FriendsList friends={friendsData} />
    },
    {
      label: `Favorites! (${breweryFaves?.length || 0})`,
      key: 2,
      children: <BreweryFavorites breweries={breweryFaves} />
    },
    {
      label: `Wish List! (${breweryWishes?.length || 0})`,
      key: 3,
      children: <BreweryWishlist breweryWishes={breweryWishes}/>
    },
  ];

  if (Auth.loggedIn()) {
    return (
      <>
        {userData?.user && !loading && (
          <UserProfile profileData={profileData} loading={loading} showForm={showForm} />
        )}
        {userData?.user && !loading && (
          <>
            <Divider orientation='center' plain>Joined {format_date(userData.user?.createdAt)}</Divider>
            <ProfileTabs tabItems={tabItems}/>
          </>
        )}
      </>
    )
  } else {
    return <h2>Please log in!</h2>;
  }
}
