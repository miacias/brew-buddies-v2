import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_REVIEWS } from '../utils/queries';
import ReviewCard from '../components/ReviewCard';

export default function HomePage() {
    const [breweryData, setBreweryData] = useState([]);
    const { loading: loadingAllReviews, data: allReviewData } = useQuery(ALL_REVIEWS);
    console.log('homepg allreview data', allReviewData);

    // calls OpenBreweryDB API and sets breweryData State for all breweries
    useEffect(() => {
        if (!loadingAllReviews && allReviewData.allReviews && allReviewData.allReviews.length > 0) {
          const fetchBreweries = async () => {
            const breweriesData = await Promise.all(
                allReviewData.allReviews.map(async (review) => {
                try {
                  const searchByIdApi = `https://api.openbrewerydb.org/v1/breweries/${review.brewery}`;
                  const response = await fetch(searchByIdApi);
                  const data = await response.json();
                  return data;
                } catch (error) {
                  console.error(error);
                  return null;
                }
              })
            );
            setBreweryData(breweriesData);
          };
    
          fetchBreweries();
        }
      }, [allReviewData]);
    // useEffect(() => {
    //     if (!loadingAllReviews && allReviewData.allReviews && allReviewData.allReviews.length > 0) {
    //         allReviewData.allReviews.forEach(review => {     
    //             const searchByIdApi = `https://api.openbrewerydb.org/v1/breweries/${review.breweryId}`;
    //             fetch(searchByIdApi)
    //             .then((response) => response.json())
    //             .then((data) => setBreweryData(data))
    //             .catch((error) => console.error(error));
    //         });
    //     }
    // }, [allReviewData]);

    if(!loadingAllReviews && allReviewData && breweryData.length > 0) {
        return (
            <>
                {allReviewData.allReviews.map((oneReview, index) => {
                    return <ReviewCard
                        oneReview={oneReview}
                        key={oneReview?._id}
                        breweryData={breweryData[index]}
                    />
                })}
            </>
        )
    }
}