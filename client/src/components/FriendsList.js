import React from "react";
import { Avatar, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


export default function FriendsList(friendsData) {

    // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
    const AvatarFromURL = ({ url, ...props }) => {
        return (
        <Avatar {...props} src={url} />
        );
    };

    return (
        <>
            {friendsData?.friends ? (
                <List
                    itemLayout="horizontal"
                    dataSource={friendsData.friends}
                    renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                        key={item._id}
                        avatar={item.profilePic ? <AvatarFromURL url={item.profilePic} /> : <Avatar icon={<UserOutlined />} />}
                        title={<Link to={`/profile/${item.username}`}>{item.username}</Link>}
                        description={item.bio ? `${item.bio} Reviews: ${item.reviewCount}` : `Reviews: ${item.reviewCount}`}
                        />
                    </List.Item>
                    )}
                />
            ) : (
                ''
            )}
        </>
    )
}
