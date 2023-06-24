import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Card, Rate, Tooltip, Spin } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { format_timestamp } from '../utils/formatters';

const { Meta } = Card;


export default function ReviewCard({ oneReview, breweryData }) {
  let urlParams = window.location.pathname;
  const [view, setView] = useState('');

  // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
  const AvatarFromURL = ({ url, ...props }) => {
    return (
    <Avatar {...props} src={url} />
    );
  };

  // determines current page on screen
  const pageView = async () => {
    let newView;
    if (urlParams.includes('breweries')) {
      newView = 'brewery';
    } else if (urlParams.includes('profile')) {
      newView = 'profile';
    } else {
      newView = 'home';
    }
    return newView;
  };

  useEffect(() => {
    const fetchPage = async () => {
      const newView = await pageView();
      setView(newView);
    };
    fetchPage();
  }, [breweryData]);

  return (
    <>
      {(!breweryData || !breweryData.id || breweryData?.id !== oneReview.brewery) 
      ? <div 
          style={{
            margin: '20px 0',
            marginBottom: '20px',
            padding: '30px 50px',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
          }}
        >
          <Spin/>
        </div>
      : <Card>
            <Meta
              avatar={oneReview.author.profilePic 
                ? <Link to={`/profile/${oneReview.author.username}`}><AvatarFromURL url={oneReview.author.profilePic} /></Link>
                : <Link to={`/profile/${oneReview.author.username}`}><Avatar icon={<UserOutlined/>} /></Link>
              }
              title={<Tooltip title='View Profile'><Link to={`/profile/${oneReview.author.username}`}>{oneReview.author.username}</Link></Tooltip>}
              description={format_timestamp(oneReview.createdAt)}
            />
            {/* if on HomePage, render card with brewery title */}
            {view === 'home' && (
              <Card
                type="inner"
                title={<Link to={`/breweries/${breweryData.id}`}>{breweryData?.name}</Link>}
                style={{
                  marginTop: 16,
                }}
              >
                <Rate disabled defaultValue={oneReview.rating}/>
                <p>{oneReview.text}</p>
              </Card>
            )}
            {/* if on BreweryPage render card with brewery star rating as title */}
            {view === 'brewery' && (
              <Card
                type="inner"
                title={<Rate disabled defaultValue={oneReview.rating}/>}
                style={{
                  marginTop: 16,
                }}
              >
                <p>{oneReview.text}</p>
              </Card>
            )}
            {/* if on ProfilePage render card with brewery star rating as title */}
            {view === 'profile' && (
              <Card
                type="inner"
                title={<Link to={`/breweries/${breweryData?.id}`}>{breweryData?.name}</Link>}
                // title={<Rate disabled defaultValue={oneReview.review.rating}/>}
                style={{
                  marginTop: 16,
                }}
              >
                <Rate disabled defaultValue={oneReview.rating}/>
                <p>{oneReview.text}</p>
              </Card>
            )}
        </Card>
      }
    </>
  )
};
