import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Button, Row } from 'antd';
import styles from './BreweryCard.module.css';

export default function BreweryCard(props) {
  let urlParams = window.location.pathname;
  const breweryId = props.brewery.id;
  const url = `/breweries/${breweryId}`;

  return (
    <Row>
      <Card className={styles.breweryCard} bordered={false}>
        <div className={styles.cardTitle}>
          {props.brewery.name}
        </div>
        <p>Brewery Type: {props.brewery.brewery_type}</p>
        <p>Address: {props.brewery.street}, {props.brewery.city}, {props.brewery.state} {props.brewery.postal_code}</p>
        <p><Link to={url}>Click here for more information!</Link></p>
        {urlParams === '/profile' ? (
          <Button onClick={() => props.handleRemoveBrewery(props.brewery.id)}>
            Delete Favorite Brewery
          </Button>
        ) : (
          ''
        )}
      </Card>
    </Row>
  );
}
