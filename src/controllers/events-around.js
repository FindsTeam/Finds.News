const Extra = require("telegraf/extra");
const markup = Extra.markdown();

const messages = require("../constants/messages");
const keyboards = require("../constants/keyboards");

const {
    getActualEventsForToday,
} = require("../utils/mongo");

const {
    addressToGeopoint,
    distanceBetween
} = require("../utils/here");

const {
    createEventsDigest
} = require("../utils/editor");

const RELEVANCE_LIMIT = 0.6;
const DISTANCE_LIMIT = 10000;

const asyncFilter = async (arr, callback) => {
    const fail = Symbol();

    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail);
};

const isEventNear = async (event, location) => {
    if (!event.address) {
        return false;
    }

    const eventGeopoint = await addressToGeopoint(event.address);

    if (eventGeopoint.relevance < RELEVANCE_LIMIT) {
        return false;
    }

    const distance = await distanceBetween(location, eventGeopoint.location);

    return distance <= DISTANCE_LIMIT;
};

const getEventsAroundPoint = async (events, location) => {
    if (events.length) {
        return await asyncFilter(events, async event => await isEventNear(event, location));
    }
};

module.exports.askForLocation = context => {
    return context.reply(messages.askForLocation, keyboards.askForLocation);
};

module.exports.eventsAround = async context => {
    const userLocation = context.update.message.location;
    const actualEvents = await getActualEventsForToday();
    const eventsAroundLocation = await getEventsAroundPoint(actualEvents, userLocation);
    const message = eventsAroundLocation.length ? createEventsDigest(eventsAroundLocation) : messages.noEventsAround;

    return context.reply(message, markup);
};