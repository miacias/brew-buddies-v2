import React from "react";
import { Avatar, Button, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { EditUserForm } from "./EditUserForm";
import Auth from "../utils/auth";


const UserProfile = ({ profileData, loading, showForm, toggleForm }) => {
    const myId = Auth.getProfile()?.data?._id;


    // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
    const AvatarFromURL = ({ url, ...props }) => {
        return (
        <Avatar {...props} src={url} />
        );
    };

  return (
    <Space direction="horizontal" size={16}>
      {profileData.user?.profilePic ? (
        <AvatarFromURL url={profileData?.profilePic} size={300} />
      ) : (
        <Avatar icon={<UserOutlined />} size={300} />
      )}
      {console.log(profileData)}
      <Space direction="vertical">
        <h2 style={{ fontSize: "24px" }}>{profileData.username}</h2>
        <h3 style={{ fontSize: "20px" }}>{profileData?.pronouns}</h3>
        <p>{profileData?.user?.bio}</p>
        {showForm && <EditUserForm />}
        {myId === profileData?._id && (
          <Button onClick={toggleForm}>
            {showForm ? "Close" : "Edit Profile"}
          </Button>
        )}
      </Space>
    </Space>
  );
};

export default UserProfile;
