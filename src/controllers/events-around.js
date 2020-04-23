const Extra = require("telegraf/extra");
const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");
const markup = Extra.markdown();

const buttons = require("../constants/buttons");
const keyboards = require("../constants/keyboards");
const messages = require("../constants/messages");

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
const DISTANCE_LIMIT_NEAR = 1000;
const DISTANCE_LIMIT_WALK = 5000;

const DISTANCE = new Map([
    [ buttons.near, DISTANCE_LIMIT_NEAR ],
    [ buttons.walk, DISTANCE_LIMIT_WALK ]
]);

const asyncFilter = async (arr, callback) => {
    const fail = Symbol();

    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail);
};

const isEventNear = async (event, location, distanceLimit) => {
    if (!event.address) {
        return false;
    }

    const eventGeopoint = await addressToGeopoint(event.address);

    if (eventGeopoint.relevance < RELEVANCE_LIMIT) {
        return false;
    }

    const distance = await distanceBetween(location, eventGeopoint.location);

    return distance <= distanceLimit;
};

const getEventsAroundPoint = async (events, location, distanceLimit) => {
    if (events.length) {
        return await asyncFilter(events, async event => await isEventNear(event, location, distanceLimit));
    }
};

const eventsAround = async (context, userLocation, type) => {
    const distanceLimit = DISTANCE.get(type);
    const actualEvents = await getActualEventsForToday();
    const eventsAroundLocation = await getEventsAroundPoint(actualEvents, userLocation, distanceLimit);
    const message = eventsAroundLocation.length ?
        createEventsDigest(messages.eventsAround, eventsAroundLocation) :
        messages.noEventsAround;
    
    await context.reply(message, markup);
    await context.reply(messages.afterSearch, keyboards.main);
    context.scene && await context.scene.leave();
};

const locationStepHandler = new Composer();
locationStepHandler.on("location", context => {
    const userLocation = context.update.message.location;

    if (!userLocation) {
        return context.scene.leave();
    }

    context.wizard.state.userLocation = userLocation;
    context.reply(messages.refineSearchRadius, keyboards.searchRadius);

    return context.wizard.next();
});

const refineRadiusStepHandler = new Composer();
refineRadiusStepHandler.hears(buttons.near, context => eventsAround(context, context.wizard.state.userLocation, buttons.near));
refineRadiusStepHandler.hears(buttons.walk, context => eventsAround(context, context.wizard.state.userLocation, buttons.walk));

module.exports.eventsAroundWizard = new WizardScene("events-around-wizard",
    (context) => {
        context.reply(messages.askForLocation, keyboards.askForLocation);

        return context.wizard.next();
    },
    locationStepHandler,
    refineRadiusStepHandler
);