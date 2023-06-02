// using both "loading card" and "inner card" components from ANT.  The Meta tag comes from "loading card" is attached to an "inner card"
import { Link } from 'react-router-dom';
import { Avatar, Card, Rate, Tooltip } from 'antd';
import { format_timestamp } from '../utils/formatters';

const { Meta } = Card;


export default function ReviewCard({ oneReview, breweryData }) {
  let urlParams = window.location.pathname;

  // custom avatar: Ant Design UI v5.4 does not support built-in avatars from URL
  const AvatarFromURL = ({ url, ...props }) => {
    return (
    <Avatar {...props} src={url} />
    );
  };


  return (
      <Card>
        <Meta
          avatar={<Link to={`/profile/${oneReview.author.username}`}><AvatarFromURL url={oneReview.author.profilePic} /></Link>}
          title={<Tooltip title='View Profile'><Link to={`/profile/${oneReview.author.username}`}>{oneReview.author.username}</Link></Tooltip>}
          description={format_timestamp(oneReview.createdAt)}
        />
        {/* if on HomePage, render card with brewery title */}
        {urlParams === '/' ?
          <Card
            type="inner"
            title={<a href={breweryData.website_url ? breweryData.website_url : ''}>{breweryData?.name}</a>}
            style={{
              marginTop: 16,
            }}
          >
            <Rate disabled defaultValue={oneReview.rating}/>
            <p>{oneReview.text}</p>
          </Card>
        :
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
        }
      </Card>
  )
};