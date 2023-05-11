import React, { useState } from 'react';
import Map from '../components/Map';
import BreweryApi from '../components/BreweryApi';

export default function MapPage() {
    const [breweryList, setBreweryList] = useState(null);

    return (
        <section>
            <BreweryApi breweryList={breweryList} setBreweryList={setBreweryList}/>
            <Map breweryList={breweryList}/>
        </section>
    )
}

// lift state
// pass breweryList and setBreweryList as props to BreweryAPI
// pass breweryList as props to Map