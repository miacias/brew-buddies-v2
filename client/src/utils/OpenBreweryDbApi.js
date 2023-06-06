// handles all OpenBreweryDB API calls

// accepts zip code string and returns many breweries by zip
export const byPostalCode = async (zipInput) => {
    try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_postal=${zipInput}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

// accepts array of string IDs and returns many breweries by ID
export const byManyIds = async (breweryIds) => {
    // ensures .join() will complete before try/catch block attempts to fetch from API
    let idsStrPromise = await new Promise((resolve) => {
        let idsStr = breweryIds.join(',');
        resolve(idsStr);
    });
    try {
        const idsStr = await idsStrPromise;
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_ids=${idsStr}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

// accepts one brewery ID and returns that brewery
export const byOneId = async (breweryId) => {
    try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${breweryId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}
