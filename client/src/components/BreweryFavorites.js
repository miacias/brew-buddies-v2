import React from "react";
import { List, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';



export default function BreweryFavorites(breweryList) {


    return (
        <>
            {/* {friendsData?.friends ? (
                <List
                    pagination={friendsData.friends.length > 3 ? {
                        position: 'bottom',
                        align: 'center',
                        defaultCurrent: 1,
                        pageSize: 3
                    } : ''}
                    itemLayout="horizontal"
                    dataSource={friendsData.friends}
                    locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Not following anyone yet'} />}}
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
            )} */}
        </>
    )
}
