import React , { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from '../components/UserProvider';
import { Space, Avatar, Divider, Tabs, Button } from "antd";
import { UserOutlined } from '@ant-design/icons'
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_USER, GET_FRIENDS } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND, REMOVE_FAV_BREWERY } from "../utils/mutations";
import { format_date } from '../utils/formatters';
import FriendsList from "../components/FriendsList";
import BreweryFavorites from "../components/BreweryFavorites";
import { EditUserForm } from "../components/EditUserForm";
import Auth from "../utils/auth";
const ObjectId = require("bson-objectid");

export function ProfilePage() {
  const client = useApolloClient();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [friendsData, setFriendsData] = useState(null);
  const [breweryList, setBreweryList] = useState(new Set([]));
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
      console.log(data)
      if (!data) {
        throw new Error("You have no friends");
      }
      // refetch();
      // navigate("/profile");
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
      // refetch();
      // navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  // removes favorite brewery
  const handleRemoveFavBrewery = async (breweryId) => {
    try {
      const { data } = await removeFavBrewery({
        variables: {
          breweryId: breweryId,
        },
      });
      if (data) {
        setBreweryList((current) => {
          // creates a new set of breweries excluding the deleted brewery
          const updatedBreweries = new Set(
            [...current].filter((brewery) => brewery.id !== breweryId)
          );
          return updatedBreweries;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };


  // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
  const AvatarFromURL = ({ url, ...props }) => {
    return (
      <Avatar {...props} src={url} />
    );
  };
  
  // renders user friends, favorites, and wish lists
  const tabItems = [
    {
      label: `Friends (${profileData?.friendCount})`,
      key: 1,
      children: <FriendsList friends={friendsData} />
    },
    {
      label: 'Favorites!',
      key: 2,
      children: <BreweryFavorites breweries={breweryList}/>
    },
    {
      label: 'Wish List!',
      key: 3,
      children: 'some wishes'
    },
  ];

  if (Auth.loggedIn()) {
    return (
      <>
        {userData?.user && !loading && (
          <>
            <Space direction='horizontal' size={16}>
              {userData.user?.profilePic ? (
                <AvatarFromURL url={userData.user?.profilePic} size={300} />
              ) : (
                <Avatar icon={<UserOutlined />} size={300} />
              )}
              <Space direction='vertical'>
                <h2 style={{fontSize: '24px'}}>{userData.user.username}</h2>
                <h3 style={{fontSize: '20px'}}>{userData.user.pronouns}</h3>
                <p>{userData.user.bio}</p>
                {/* consider replacing in-line edit form with modal form */}
                {showForm && myId === profileData?._id && <EditUserForm />}
                {/* shows edit profile form if logged in User ID matches profile page ID */}
                {myId === profileData?._id && (
                  <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Close" : "Edit Profile"}
                  </Button>
                )}
                {/* shows follow/unfollow if logged in User ID is viewing a different profile page */}
                {myId !== profileData?._id && myData && friendsData && (
                  myData.friends.some((friend) => friend._id === profileData._id) ? (
                    <Button onClick={() => handleUnfollow(profileData._id)}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button onClick={handleFollow}>Follow</Button>
                  )
                )}
              </Space>
            </Space>
            <Divider orientation='center' plain>Joined {format_date(userData.user?.createdAt)}</Divider>
            <Tabs
              defaultActiveKey="1"
              size={12}
              style={{marginBottom: 32}}
              items={tabItems}
            />
          </>
        )}
      </>
    )
  } else {
    return <h2>Please log in!</h2>;
  }
}
