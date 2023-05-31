import React from "react";
import { Avatar, List, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ReactComponent as EmptyBin } from './EmptyBin.svg';



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
                    pagination={friendsData.friends.length > 3 ? {
                        position: 'bottom',
                        align: 'center',
                        defaultCurrent: 1,
                        pageSize: 3
                    } : ''}
                    itemLayout="horizontal"
                    dataSource={friendsData.friends}
                    locale={{emptyText: <div><EmptyBin/><p>{`Not following anyone yet`}</p></div>}}
                    renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                        key={item._id}
                        avatar={item.profilePic
                            ? <Link to={`/profile/${item.username}`}><AvatarFromURL url={item.profilePic} /></Link> 
                            : <Link to={`/profile/${item.username}`}><Avatar icon={<UserOutlined />} /></Link>}
                        title={<Link to={`/profile/${item.username}`}>{item.username}</Link>}
                        description={item.bio ? item.bio : ''}
                        />
                        <div>{`${item.reviewCount} reviews`}</div>
                    </List.Item>
                    )}
                />
            ) : (
                ''
            )}
        </>
    )
}
