import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUserContext } from '../components/UserProvider';
import { Row, Col, Space, Avatar, Divider, Button, Card } from "antd";
import { UserOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND } from "../utils/mutations";
import { format_date, format_timestamp } from '../utils/formatters';
const ObjectId = require("bson-objectid");

export function ProfilePage() {

  const [addFriend] = useMutation(ADD_FRIEND);
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  // const navigate = useNavigate();
  const { username } = useParams();
  // const myData = useUserContext();
  const { loading, error, data: userData } = useQuery(GET_USER, {
    variables: { username },
  });

  const handleFollowFriend = async () => {
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

  const handleRemoveFriend = async (friendId) => {
    try {
      const { data } = await removeFriend({
        variables: {
          friendId: new ObjectId(friendId),
        },
      });
      // refetch();
      // navigate("/profile");
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
            </Space>
          </Space>
          <Divider orientation='center' plain>Joined {format_date(userData.user?.createdAt)}</Divider>
          <Row>
              
          </Row>
        </>
      )}
    </>
  )

}