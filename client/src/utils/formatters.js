// formats date
export const format_date = (date) => {
    const timestamp = new Intl.DateTimeFormat("en", {
        // timeStyle: "short",
        dateStyle: "medium"
    }).format(date);
    return timestamp;
}

// formats date and time
export const format_timestamp = (date) => {
    const timestamp = new Intl.DateTimeFormat("en", {
        timeStyle: "short",
        dateStyle: "medium"
    }).format(date);
    return timestamp;
}