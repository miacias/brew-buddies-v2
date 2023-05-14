import { React, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ReviewCard from "../components/ReviewCard";
import AddReviewForm from '../components/AddReviewForm';
import Auth from '../utils/auth'
import { ADD_FAV_BREWERY } from "../utils/mutations";
import { BREWERY_REVIEW } from '../utils/queries';
import { useParams } from "react-router-dom";
import { Col, Card, Space, Button, Tooltip } from "antd";
import { StarOutlined, StarFilled, HeartOutlined, HeartFilled } from "@ant-design/icons";


export default function SingleBrewery() {
  const { breweryId } = useParams();
  const [breweryData, setBreweryData] = useState();
  const [showForm, setShowForm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [favorite, setFavorite] = useState(false);

  // adds brewery to user Favorites list
  const [addFavBrewery, { error }] = useMutation(ADD_FAV_BREWERY);
  // loads all reviews for this brewery
  const { loading, data } = useQuery(BREWERY_REVIEW, { variables: { breweryId }});

  // calculates star review average
  const calculateAverage = (loading, data) => {
    const ratings = [];
    let average;
    let totalReviews;
    if (!loading && data.review) {
      data.review.forEach(review => {
        return ratings.push(parseInt(review.starRating));
      });
      const initialValue = 0;
      const sumWithInitial = ratings.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );
      average = sumWithInitial / ratings.length;
      totalReviews = ratings.length;
      return [average, totalReviews];
    }
  }

  // calls OpenBreweryDB API and sets breweryData State
  useEffect(() => {
    const searchByIdApi = `https://api.openbrewerydb.org/v1/breweries/${breweryId}`;
    fetch(searchByIdApi)
      .then((response) => response.json())
      .then((data) => setBreweryData(data))
      .catch((error) => console.error(error));
  }, [breweryId]);

  // verifies if user is logged in and sets loggedInUser State
  useEffect(() => {
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile();
      setLoggedInUser(userData.data);
    }
  }, []); // checks once

  // adds brewery to user favorites list
  const handleAddFavBrewery = async (event) => {
    try {
      const { data } = await addFavBrewery({
        variables: {
          breweryId: breweryId,
        },
      });
      if (!data) {
        throw new Error('Something went wrong!');
      }
      setFavorite(true);
    } catch (err) {
      console.error(err);
    }
  };

  if(loggedInUser !== null) {
    return (
      <>
        {breweryData && (
          <>
            <Col span={8}>
              <Card title={breweryData.name} bordered={false}>
                <p>Brewery Type: {breweryData.brewery_type}</p>
                <p>
                  Address: {breweryData.street}, {breweryData.city}, {" "}
                  {breweryData.state} {breweryData.postal_code}
                </p>
                  <Space.Compact block>
                    {/* star ratings! */}
                    {!loading && data.review && (
                    <Tooltip title={`${calculateAverage(loading, data)[1]} ratings!`}>
                      <Button 
                        type={showForm ? 'primary': 'default'}
                        icon={<StarOutlined />}
                        onClick={() => setShowForm(!showForm)}
                      > 
                        {!showForm ? `${calculateAverage(loading, data)[0]} out of 5` : 'Cancel'}
                      </Button>
                    </Tooltip>
                    )}
                    {/* add to favorites! */}
                    <Tooltip title="I love it!">
                      <Button 
                        icon={<HeartOutlined/>}
                        onClick={handleAddFavBrewery}
                      >Favorite it!</Button>
                    </Tooltip>
                </Space.Compact>
                {showForm && <AddReviewForm showForm={showForm} setShowForm={setShowForm}/>}
              </Card>
            </Col>
          </>
        )}

        {/* <div>Google Maps API here</div> */}
        <ul>
          {/* creates Review card based on total number of reviews possible */}
          {!loading && data.review && (
            <>
            {data.review.map((oneReview) => {
              return <ReviewCard 
                oneReview={oneReview} 
                key={oneReview._id}
                breweryData={breweryData}
              />
            })}
            </>
          )}
        </ul>
      </>
    );
  } else {
    return <div>Please log in!</div>
  }
}
