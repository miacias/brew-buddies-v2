// libraries, packages
import { React, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Col, Card, Space, Button, Tooltip, Divider } from "antd";
import { StarOutlined, HeartOutlined, HeartFilled, PushpinOutlined, PushpinFilled, DoubleRightOutlined, PhoneOutlined, StarFilled } from "@ant-design/icons";
import styles from '../components/BreweryCard.module.css';
// utils
import Auth from '../utils/auth';
import * as formatters from '../utils/formatters';
import { ADD_FAV_BREWERY, ADD_WISH_BREWERY, REMOVE_FAV_BREWERY, REMOVE_WISH_BREWERY } from "../utils/mutations";
import { BREWERY_REVIEWS } from '../utils/queries';
// components
import { useUserContext } from '../components/UserProvider';
import ReviewCard from "../components/ReviewCard";
import AddReviewForm from '../components/AddReviewForm';


export default function BreweryPage() {
  const { breweryId } = useParams();
  const [breweryData, setBreweryData] = useState();
  const [showForm, setShowForm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [favorite, setFavorite] = useState();
  const [wish, setWish] = useState();
  // loads logged in user data
  const myData = useUserContext();

  // adds or removes brewery from user Favorites list
  const [addFavBrewery, { error: addFavErr }] = useMutation(ADD_FAV_BREWERY);
  const [removeFavBrewery, { error: removeFavErr }] = useMutation(REMOVE_FAV_BREWERY);
  const [addWishBrewery, { error: addWishErr }] = useMutation(ADD_WISH_BREWERY);
  const [removeWishBrewery, { error: removeWishErr }] = useMutation(REMOVE_WISH_BREWERY);
  // loads all reviews for this brewery
  const { loading: loadingReview, data: reviewData, refetch } = useQuery(BREWERY_REVIEWS, { variables: { breweryId }});


  // heart icon is filled if brewery on screen is in the favorites list of the user viewing the page
  const handleHeartFill = async (brewery) => {
    const myFavesArr = myData?.favBreweries;
    if (myFavesArr && myFavesArr.length > 0) {
      const foundMatch = myFavesArr.find((favMatch) => favMatch === breweryId)
      if (foundMatch) {
        return setFavorite(true);
      } else {
        return setFavorite(false);
      }
    }
  }

    // heart icon is filled if brewery on screen is in the favorites list of the user viewing the page
    const handlePinFill = async (brewery) => {
      const myWishesArr = myData?.wishBreweries;
      if (myWishesArr && myWishesArr.length > 0) {
        const foundMatch = myWishesArr.find((favMatch) => favMatch === breweryId)
        if (foundMatch) {
          return setWish(true);
        } else {
          return setWish(false);
        }
      }
    }

  // checks if user data is loaded then fills in the favorite heart or not
  useEffect(() => {
    if(myData) {
      handleHeartFill(breweryData);
      handlePinFill(breweryData);
    }
  }, [myData, breweryData]);

  // calculates star review average
  const calculateAverage = (loadingReview, reviewData) => {
    const ratings = [];
    let average;
    let totalReviews;
    if (!loadingReview && reviewData.reviewsByBrewery) {
      reviewData.reviewsByBrewery.forEach(review => {
        return ratings.push(parseInt(review.rating));
      });
      const initialValue = 0;
      const sumWithInitial = ratings.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );
      average = sumWithInitial / ratings.length;
      totalReviews = ratings.length;
      return [average.toFixed(1), totalReviews];
    }
  }

  // calls OpenBreweryDB API and sets breweryData State
  useEffect(() => {
    const searchByIdApi = `https://api.openbrewerydb.org/v1/breweries/${breweryId}`;
    fetch(searchByIdApi)
      .then((response) => response.json())
      .then((data) => {
        setBreweryData(data);
        handleHeartFill(data);
      })
      .catch((error) => console.error(error));
  }, [breweryId]);

  // verifies if user is logged in and sets loggedInUser State
  useEffect(() => {
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile();
      setLoggedInUser(userData.data);
    }
  }, []); // checks once


  // refetches brewery review data, used as a prop and passed through form component
  const handleReviewAdded = () => {
    refetch();
  };

  // saves brewery to favorites list
  const handleAddFavBrewery = async () => {
    try {
      const { data } = await addFavBrewery({
        variables: {
          brewery: breweryId,
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

  // removes brewery from favorites list
  const handleRemoveFavBrewery = async () => {
    try {
      const { data } = await removeFavBrewery({
        variables: {
          brewery: breweryId,
        },
      });
      if (!data) {
        throw new Error('Something went wrong!');
      }
      setFavorite(false);
    } catch (err) {
      console.error(err);
    }
  };

  // saves brewery to wish list
  const handleAddWishBrewery = async () => {
    try {
      const { data } = await addWishBrewery({
        variables: {
          brewery: breweryId,
        },
      });
      if (!data) {
        throw new Error('Something went wrong!');
      }
      setWish(true);
    } catch (err) {
      console.error(err);
    }
  };

  // removes brewery from wish list
  const handleRemoveWishBrewery = async () => {
    try {
      const { data } = await removeWishBrewery({
        variables: {
          brewery: breweryId,
        },
      });
      if (!data) {
        throw new Error('Something went wrong!');
      }
      setWish(false);
    } catch (err) {
      console.error(err);
    }
  };

  if(loggedInUser !== null) {
    return (
      <>
        {breweryData && (
          <>
            <Col >
              <Card 
                className={styles.singleBrewery} 
                // title={breweryData?.name}
                bordered={false}
              >
                <h2>{breweryData?.name}</h2>
                <Divider/>
                {!loadingReview && reviewData && (
                  <div style={{fontSize: '20px'}}>{isNaN(calculateAverage(loadingReview, reviewData)[0]) 
                    ? 'No reviews' 
                    : <p><span><StarFilled twoToneColor="#FADB14" /></span><span>{` ${calculateAverage(loadingReview, reviewData)[0]} out of 5!`}</span></p>
                  }</div>
                )}
                {breweryData.brewery_type && (
                  <p>Brewery Flavor: {formatters.format_brewery_type(breweryData?.brewery_type)}</p>
                )}
                {/* phone number */}
                {breweryData.phone && (<div>
                  <span style={{ display: 'inline-block', marginRight: '10px' }}>
                    <PhoneOutlined />
                  </span>
                  <span style={{ display: 'inline-block', marginRight: '10px' }}>
                    <p>{formatters.format_phone_number(breweryData?.phone)}</p>
                  </span>
                </div>)}
                {/* street address */}
                <p>{breweryData?.street}</p>
                <p>{breweryData?.city}, {breweryData?.state} {breweryData.postal_code && (formatters.format_zip_code(breweryData?.postal_code))}</p>
                {!loadingReview && reviewData && (
                  <>
                    {/* <p>{isNaN(calculateAverage(loadingReview, reviewData)[0]) ? 'No reviews' : `${calculateAverage(loadingReview, reviewData)[0]} out of 5⭐`}</p> */}
                    <Space.Compact block style={{ display: 'inline-block' }}>
                      {/* star ratings! */}
                      <Tooltip title={`${calculateAverage(loadingReview, reviewData)[1]} ratings!`}>
                        <Button 
                          type={showForm ? 'primary': 'default'}
                          icon={<StarOutlined />}
                          onClick={() => setShowForm(!showForm)}
                          > 
                        {/* shows Cancel when form is open */}
                          {
                            !showForm
                              ? 'Add review'
                              : 'Cancel'
                          }
                        </Button>
                      </Tooltip>
                      
                      {/* add/remove from favorites! */}
                      {favorite ? (
                        <Tooltip title={favorite ? 'I love it!' : 'Add me?'}>
                          <Button 
                            icon={favorite ? <HeartFilled /> : <HeartOutlined />}
                            onClick={handleRemoveFavBrewery}
                          >Favorited
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title={favorite ? 'I love it!' : 'Add me?'}>
                          <Button 
                            icon={favorite ? <HeartFilled /> : <HeartOutlined />}
                            onClick={handleAddFavBrewery}
                          >Favorite it!
                          </Button>
                        </Tooltip>
                      )}
                      {/* add/remove from wish list! */}
                      {wish ? (
                        <Tooltip title={'Someday!'}>
                          <Button 
                            icon={wish ? <PushpinFilled /> : <PushpinOutlined />}
                            onClick={handleRemoveWishBrewery}
                          >Saved
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title={'Save for later?'}>
                          <Button 
                            icon={wish ? <PushpinFilled /> : <PushpinOutlined />}
                            onClick={handleAddWishBrewery}
                          >Save it!
                          </Button>
                        </Tooltip>
                      )}
                      {/* external website button if site exists */}
                      {breweryData?.website_url && 
                      (<Tooltip title='View site!'>
                        <Button icon={<DoubleRightOutlined />} href={breweryData?.website_url} target="_blank" rel="noopener noreferrer"/>
                      </Tooltip>)}
                    </Space.Compact>
                  </>
                )}
                {/* shows/hides Add Review form based on showForm State */}
                {showForm && 
                <AddReviewForm 
                  showForm={showForm} 
                  setShowForm={setShowForm}
                  onReviewAdded={handleReviewAdded} 
                />}
              </Card>
            </Col>
          </>
        )}

        {/* <div>Google Maps API here</div> */}
        <ul>
          {/* creates Review card based on total number of reviews possible */}
          {!loadingReview && reviewData?.reviewsByBrewery && (
            <>
            {reviewData.reviewsByBrewery.map((oneReview) => {
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
