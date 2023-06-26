import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_REVIEWS } from '../utils/queries';
import ReviewCard from '../components/ReviewCard';
import * as API from '../utils/OpenBreweryDbApi';

export default function HomePage() {
    const [breweryData, setBreweryData] = useState([]);
    const { loading: loadingAllReviews, error: allReviewErr, data: allReviewData, refetch } = useQuery(ALL_REVIEWS, {
      fetchPolicy: 'network-only',
    });

    // refetches breweries after a new review is added
    useEffect(() => {
      refetch();
    }, [breweryData]);

    // calls OpenBreweryDB API and sets breweryData State for all breweries
    useEffect(() => {
        if (!loadingAllReviews && allReviewData.allReviews && allReviewData.allReviews.length > 0) {
          const fetchBreweries = async () => {
            try {
              const breweryIds = allReviewData.allReviews.map(review => review.brewery);
              const breweries = await API.byManyIds(breweryIds);
              setBreweryData(breweries);
            } catch (err) {
              console.error(err);
              return null;
            }
          }
          fetchBreweries();
        }
      }, [allReviewData]);
    
    // protects from page breaks if breweryData is unavailable
    if (!breweryData) {
      return <div>Loading...</div>;
    }

    if(!loadingAllReviews && allReviewData && breweryData.length > 0) {
        return (
            <>
                {allReviewData.allReviews.map((oneReview) => {
                    return (
                      <ReviewCard
                          oneReview={oneReview}
                          key={oneReview?._id}
                          breweryData={breweryData.filter(brewery => brewery.id === oneReview.brewery)[0]}
                      />
                    )
                })}
            </>
        )
    }
}
