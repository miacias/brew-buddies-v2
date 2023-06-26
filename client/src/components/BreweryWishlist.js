import React from "react";
import { List, Empty } from 'antd';
import { Link } from 'react-router-dom';



export default function BreweryWishlist({breweryWishes}) {


    return (
        <>
            {breweryWishes && breweryWishes?.length > 0 ? (
                <List
                    pagination={breweryWishes.length > 3 ? {
                        position: 'bottom',
                        align: 'center',
                        defaultCurrent: 1,
                        pageSize: 3
                    } : ''}
                    itemLayout="horizontal"
                    dataSource={breweryWishes}
                    locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No saved places yet'} />}}
                    renderItem={(item, index) => (
                    <List.Item actions={[item.website_url ? <Link to={item.website_url} target="_blank" rel="noopener noreferrer">visit site</Link> : '', <Link to={`/breweries/${item.id}`}>see reviews</Link>]}>
                        <List.Item.Meta
                        key={item._id}
                        title={item.name}
                        description={`${item.brewery_type} in ${item.state}`}
                        />
                    </List.Item>
                    )}
                />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No saved places yet'} />
            )}
        </>
    )
}
