
const axios = require("axios");
const Here = require("here-maps-node").default;
const here = new Here({
    app_id: process.env.HERE_APP_ID,
    app_code: process.env.HERE_APP_CODE
});

const baseHereRoutingApi = `${process.env.HERE_ROUTE_API}?app_id=${process.env.HERE_APP_ID}&app_code=${process.env.HERE_APP_CODE}`;
const mode = "fastest;pedestrian;traffic:disabled";

const buildPointString = location => {
    return `geo!${ location.latitude },${ location.longitude }`;
};

const buildRoutingApiUrl = (first, second) => {
    const start = buildPointString(first);
    const finish = buildPointString(second);
    return `${ baseHereRoutingApi }&waypoint0=${ start }&waypoint1=${ finish }&mode=${ mode }`;
};

module.exports.addressToGeopoint = address => {
    const geocodeParams = {
        searchtext: address
    };

    return new Promise((resolve, reject) => {
        here.geocode(geocodeParams, (error, result) => {
            if (
                !error &&
                result &&
                result.Response &&
                result.Response.View.length &&
                result.Response.View[0].Result.length
            ) {
                const data = result.Response.View[0].Result[0];
    
                resolve({
                    relevance: data.Relevance,
                    location: {
                        latitude: data.Location.DisplayPosition.Latitude,
                        longitude: data.Location.DisplayPosition.Longitude,
                    }
                }); 
            } else {
                reject(error);
            }
        });
    });
};

module.exports.distanceBetween = async (first, second) => {
    const url = buildRoutingApiUrl(first, second);  
    const response = await axios.get(url);
    const summary = response.data.response.route[0].summary;

    return summary.distance;
};