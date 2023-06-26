// libraries, packages
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Divider } from "antd";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
// utils
import { GET_USER, GET_FRIENDS, REVIEWS_BY_USER } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND, REMOVE_FAV_BREWERY } from "../utils/mutations";
import { format_date } from '../utils/formatters';
import Auth from "../utils/auth";
import * as API from '../utils/OpenBreweryDbApi';
// components
import UserProfile from '../components/UserProfile';
import ProfileTabs from '../components/ProfileTabs'
import FriendsList from "../components/FriendsList";
import BreweryFavorites from "../components/BreweryFavorites";
import BreweryWishlist from '../components/BreweryWishlist';
import ReviewCard from '../components/ReviewCard';

const ObjectId = require("bson-objectid");

export function ProfilePage() {
  const client = useApolloClient();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [friendsData, setFriendsData] = useState(null);
  const [reviewCardData, setReviewCardData] = useState();
  const [breweriesData, setBreweriesData] = useState({
    favorites: [],
    wishlist: [],
    reviewed: [],
  });
  const [showForm, setShowForm] = useState(false);
  const { loading, error, data: userData, refetch } = useQuery(GET_USER, {
    variables: { username },
    fetchPolicy: 'network-only',
  });
  const [follow] = useMutation(ADD_FRIEND);
  const [unfollow] = useMutation(REMOVE_FRIEND);
  const [removeFavBrewery] = useMutation(REMOVE_FAV_BREWERY);


  // sets page data from URL and DB
  useEffect(() => {
    if (!loading && userData && userData.user) {
      setProfileData(userData.user);
    }
  }, [loading, error, userData, refetch]);

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
    if (profileData) {
      const fetchBreweries = async () => {
        if (profileData?.favBreweries && profileData.favBreweries.length > 0) {
          const favorites = await API.byManyIds(profileData.favBreweries);
          setBreweriesData((currentData) => ({
            ...currentData,
            favorites,
          }));
        }
        if (profileData?.wishBreweries && profileData.wishBreweries.length > 0) {
          const wishlist = await API.byManyIds(profileData.wishBreweries);
          setBreweriesData((currentData) => ({
            ...currentData,
            wishlist,
          }));
        }
      };
      fetchBreweries();
    }
  }, [username, profileData]);

  // gets and sets reviews data for given profile
  const fetchReviews = async (userId) => {
    try {
      const { data } = await client.query({
        query: REVIEWS_BY_USER,
        variables: { id: userId },
        fetchPolicy: 'network-only',
      });
      const reviewCards = data.reviewsByAuthor.map(review=> {
        return {
          author: profileData,
          ...review
        };
      });
      setReviewCardData(reviewCards);
      const breweryIds = data.reviewsByAuthor.map((review) => review.brewery);
      const reviewedBreweries = await API.byManyIds(breweryIds);
      setBreweriesData((currentData) => ({
        ...currentData,
        reviewed: reviewedBreweries,
      }));
    } catch (err) {
      console.error(err);
    }
  };

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
  };

  // gathers brewery info and review info into one State
  useEffect(() => {
    refetch();
    if (profileData) {
      fetchReviews(profileData._id);
    }
  }, [username, profileData]);

  const handleFollow = async () => {
    try {
      const { data } = await follow({
        variables: {
          friendId: new ObjectId(profileData._id),
        },
      });
      if (!data) {
        throw new Error("Unable to follow this account");
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
      if (!data) {
        throw new Error("Unable to unfollow this account");
      }
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
        setBreweriesData((current) => {
          const updatedFavorites = current.favorites.filter(
            (brewery) => brewery.id !== breweryId
          );
          const updatedWishlist = current.wishlist.filter(
            (brewery) => brewery.id !== breweryId
          );
          return { favorites: updatedFavorites, wishlist: updatedWishlist };
        });
      }
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const filterReviewedBreweries = (oneReview) => {
    const matchingBrewery = breweriesData.reviewed.filter(brewery => brewery.id === oneReview.brewery)[0];
    return matchingBrewery;
  }
  
  // renders user friends, favorites, and wish lists. useMemo only computes after data changes
  const tabItems = useMemo(() => [
      {
        label: `Following (${profileData?.followsCount || 0})`,
        key: 1,
        children: <FriendsList friends={friendsData} />,
      },
      {
        label: `Favorites! (${breweriesData.favorites.length || 0})`,
        key: 2,
        children: <BreweryFavorites breweries={breweriesData.favorites} />,
      },
      {
        label: `Wish List! (${breweriesData.wishlist.length || 0})`,
        key: 3,
        children: <BreweryWishlist breweryWishes={breweriesData.wishlist} />,
      },
    ],
    [profileData, friendsData, breweriesData]
  );


  if (Auth.loggedIn()) {
    return (
      <>
        {userData?.user && !loading && (
          <UserProfile 
            profileData={profileData}
            friendsData={friendsData}
            loading={loading}
            showForm={showForm}
            setShowForm={setShowForm}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
          />
        )}
        {userData?.user && !loading && (
          <>
            <Divider orientation='center' plain>Joined {format_date(userData.user?.createdAt)}</Divider>
            <ProfileTabs tabItems={tabItems}/>
            <h3>Reviews by {profileData?.username}</h3>
          </>
        )}
        {reviewCardData && reviewCardData.length > 0 && breweriesData.reviewed.length > 0 && reviewCardData.map((oneReview, index) => {
          return (
            <ReviewCard
              key={oneReview._id}
              oneReview={oneReview}
              breweryData={filterReviewedBreweries(oneReview)}
            />
          )}
        )}
      </>
    )
  } else {
    return <h2>Please log in!</h2>;
  }
}
