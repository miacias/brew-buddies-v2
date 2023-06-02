// formats date
export const format_date = (date) => {
    const timestamp = new Intl.DateTimeFormat("en", {
        // timeStyle: "short",
        dateStyle: "medium"
    }).format(date);
    return timestamp;
};

// formats date and time
export const format_timestamp = (date) => {
    const timestamp = new Intl.DateTimeFormat("en", {
        timeStyle: "short",
        dateStyle: "medium"
    }).format(date);
    return timestamp;
};

// formats string to US-styled phone number
export const format_phone_number = (phoneNumber) => {
    const areaCode = phoneNumber.substring(0, 3);
    const firstPart = phoneNumber.substring(3, 6);
    const secondPart = phoneNumber.substring(6, 10);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
};

// formats a zip code into US short-styled zip
export const format_zip_code =(fullZipCode) => {
    const hasHyphen = fullZipCode.includes('-'); // checks if string contains hyphen
    const zipWithoutLastFiveDigits = fullZipCode.slice(0, -5); // removes the last five digits
    const shortZip = hasHyphen ? zipWithoutLastFiveDigits.replace('-', '') : zipWithoutLastFiveDigits; // removes the hyphen if exists
    return shortZip;
};

// provides details about types of brewery
export const format_brewery_type = (type) => {
    const firstLetterCaps = type.charAt(0).toUpperCase() + type.slice(1);
    switch (type) {
        case 'micro':
            return `${firstLetterCaps}! Craft brewery, the most common type. For example, Samuel Adams is still considered a micro brewery!`;
        case 'nano':
            return `${firstLetterCaps}! An extremely small brewery which typically only distributes locally.`;
        case 'regional':
            return `${firstLetterCaps}! A regional location of an expanded brewery. Ex. Sierra Nevada's Asheville, NC location.`;
        case 'brewpub':
            return `${firstLetterCaps}! A beer-focused restaurant or restaurant/bar with a brewery on-premise.`;
        case 'large':
            return `${firstLetterCaps}! A very large brewery... likely not for visitors. Ex. Miller-Coors.`;
        case 'planning':
            return `${firstLetterCaps}! A brewery in planning or not yet opened to the public.`;
        case 'bar':
            return `${firstLetterCaps}! A bar. No brewery equipment on premise but definitely beer!`;
        case 'contract':
            return `${firstLetterCaps}! A brewery that uses another brewery's equipment.`
        case 'proprietor':
            return `${firstLetterCaps}! Similar to contract brewing but refers more to a brewery incubator.`;
        case 'closed':
            return `${firstLetterCaps}! This location has been closed. Nooooo!!!`;
        default: ; // no default
    }
};
