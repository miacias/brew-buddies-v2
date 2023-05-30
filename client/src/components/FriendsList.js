import React from "react";
import { Avatar, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// import 


export default function FriendsList(loadingFrnds, frndsErr, frndsData) {
    // console.log(loadingFrnds)
    const data = [
        {
          title: 'Ant Design Title 1',
        },
        {
          title: 'Ant Design Title 2',
        },
        {
          title: 'Ant Design Title 3',
        },
        {
          title: 'Ant Design Title 4',
        },
      ];

    // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
    const AvatarFromURL = ({ url, ...props }) => {
        return (
        <Avatar {...props} src={url} />
        );
    };

    return (
        <>
            {frndsData ? (
                <List
                    itemLayout="horizontal"
                    dataSource={frndsData}
                    renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                        key={index}
                        avatar={item.profilePic ? <AvatarFromURL url={item.profilePic} /> : <Avatar icon={<UserOutlined />} />}
                        title={<a href="https://ant.design">{item.username}</a>}
                        description={`Reviews: ${item.reviewCount}`}
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
