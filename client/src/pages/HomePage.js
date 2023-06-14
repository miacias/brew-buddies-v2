import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_REVIEWS } from '../utils/queries';
import ReviewCard from '../components/ReviewCard';
import * as API from '../utils/OpenBreweryDbApi';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function HomePage() {
    const [breweryData, setBreweryData] = useState([]);
    const [page, setPage] = useState(undefined);
    const { loading: loadingAllReviews, error: allReviewErr, data: allReviewData, refetch } = useQuery(ALL_REVIEWS, {
      variables: { page }
    });

    // refetches breweries after a new review is added
    useEffect(() => {
      refetch();
    }, [breweryData, page]);

    // calls OpenBreweryDB API and sets breweryData State for all breweries
    useEffect(() => {
        if (!loadingAllReviews && allReviewData.allReviews && allReviewData.allReviews.length > 0) {
          fetchBreweries();
        }
      }, [allReviewData, page]);

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

    if(!loadingAllReviews && allReviewData && breweryData.length > 0) {
        // return (
        //     <>
        //         {allReviewData.allReviews.map((oneReview, index) => {
        //             return <ReviewCard
        //                 oneReview={oneReview}
        //                 key={oneReview?._id}
        //                 breweryData={breweryData[index]}
        //             />
        //         })}
        //     </>
        // )
        return (       
          <InfiniteScroll
            dataLength={allReviewData.allReviews.length} //This is important field to render the next data
            next={() => {
              if (page === 'undefined') {
                setPage(1);
              } else {
                setPage(page + 1);
              }
            }}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={this.refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
            }
          >
            {items}
        </InfiniteScroll>
      )
    }
}