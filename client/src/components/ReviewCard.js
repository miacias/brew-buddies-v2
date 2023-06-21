// using both "loading card" and "inner card" components from ANT.  The Meta tag comes from "loading card" is attached to an "inner card"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Card, Rate, Tooltip } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { format_timestamp } from '../utils/formatters';

const { Meta } = Card;


export default function ReviewCard({ oneReview, breweryData }) {
  let urlParams = window.location.pathname;
  let view;

  useEffect(() => {
    pageView();
  }, [breweryData]);

  // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
  const AvatarFromURL = ({ url, ...props }) => {
    return (
    <Avatar {...props} src={url} />
    );
  };

  const pageView = async () => {
    if (urlParams.includes('breweries')) {
      view = 'brewery'
    } else if (urlParams.includes('profile')) {
      view = 'profile'
    } else {
      view = 'home'
    }
  };


  return (
      <Card>
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
        {view === 'brewery' && (
          // if on BreweryPage render card with brewery star rating as title
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
        {view === 'profile' && (
          // if on BreweryPage render card with brewery star rating as title
          <Card
            type="inner"
            title={<Rate disabled defaultValue={oneReview.review.rating}/>}
            style={{
              marginTop: 16,
            }}
          >
            <p>{oneReview.review.text}</p>
          </Card>
        )}
      </Card>
  )
};