import React , { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUserContext } from '../components/UserProvider';
import { Row, Col, Space, Avatar, Divider, Radio, Tabs, Button, Card } from "antd";
import { UserOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER, GET_FRIENDS } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND, REMOVE_FAV_BREWERY } from "../utils/mutations";
import { format_date, format_timestamp } from '../utils/formatters';
import FriendsList from "../components/FriendsList";
import { EditUserForm } from "../components/EditUserForm";
import Auth from "../utils/auth";
const ObjectId = require("bson-objectid");

export function ProfilePage() {
  // const navigate = useNavigate();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [friendsData, setFriendsData] = useState(null);
  const [breweryList, setBreweryList] = useState(new Set([]));
  const [showForm, setShowForm] = useState(false);
  const { loading, error, data: userData, refetch } = useQuery(GET_USER, {
    variables: { username },
  });
  const { loading: loadingFrnds, error: frndsErr, data: frndsData } = useQuery(GET_FRIENDS);
  const [addFriend] = useMutation(ADD_FRIEND);
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const [removeFavBrewery] = useMutation(REMOVE_FAV_BREWERY);

  // gets loggedIn user's ID
  const myData = useUserContext();
  // console.log(Auth.getProfile())
  const myId = Auth.getProfile()?.data?._id;



  // sets page data from URL and DB
  useEffect(() => {
    if (!loading && userData.user !== null) {
      setProfileData(userData.user);
    }
    if (!loadingFrnds && frndsData !== null) {
      setFriendsData(frndsData);
    }
    console.log(friendsData)
    refetch();
  }, [loading, error, userData, loadingFrnds, frndsErr, frndsData]);


  const handleFollow = async () => {
    try {
      const { data } = await addFriend({
        variables: {
          friendId: new ObjectId(userData._id),
        },
      });
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
      const { data } = await removeFriend({
        variables: {
          friendId: new ObjectId(friendId),
        },
      });
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
      setBreweryList((current) => {
        // Create a new set of breweries excluding the deleted brewery
        const updatedBreweries = new Set(
          [...current].filter((brewery) => brewery.id !== breweryId)
        );
        return updatedBreweries;
      });
    } catch (err) {
      console.log(err);
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
      children: 
        <FriendsList 
          loadingFrnds={loadingFrnds} 
          frndsErr={frndsErr} 
          frndsData={frndsData}
        />
    },
    {
      label: 'Favorites!',
      key: 2,
      children: 'favorites stuff'
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
                {/* show edit form if logged in User ID matches profile page ID */}
                {myId === profileData?._id && (
                  <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Close" : "Edit Profile"}
                  </Button>
                )}
                {/* consider replacing in-line edit form with modal form */}
                {showForm && <EditUserForm />}
                {myId !== profileData?._id && myData && (
                  myData.user?.friends.some((friend) => friend.username === userData.username) ? (
                    <Button onClick={() => handleUnfollow(userData._id)}>
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
