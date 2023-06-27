import React from "react";
import { useUserContext } from '../components/UserProvider';
import { Avatar, Button, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { EditUserForm } from "./EditUserForm";
import Auth from "../utils/auth";


const UserProfile = ({ profileData, friendsData, loading, showForm, setShowForm, handleFollow, handleUnfollow }) => {
  const myId = Auth.getProfile()?.data?._id;
  const myData = useUserContext();

  // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
  const AvatarFromURL = ({ url, ...props }) => {
      return (
      <Avatar {...props} src={url} />
      );
  };

  return (
    <>
      {profileData && !loading && (
        <Space direction="horizontal" size={16} style={{ display: 'inline-block' }}>
          {profileData?.profilePic ? (
            <AvatarFromURL url={profileData?.profilePic} size={300} />
          ) : (
            <Avatar icon={<UserOutlined />} size={300} />
          )}
          <Space direction="vertical">
            <h2 style={{ fontSize: "24px" }}>{profileData.username}</h2>
            <h3 style={{ fontSize: "20px" }}>{profileData?.pronouns}</h3>
            <p>{profileData?.bio}</p>
            {showForm && <EditUserForm />}
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
      )}
    </>
  );
};

export default UserProfile;
