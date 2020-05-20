const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const markup = Extra.markdown();

const handler = new Telegraf(process.env.TELEGRAM_TOKEN);

const {
    getAllPreferences,
    getActualEventsForToday,
} = require("./utils/mongo");
const { shouldSendDigestToday } = require("./utils/time");
const { createEventsDigest } = require("./utils/editor");

const messages = require("./constants/messages");

const subscriptionKeys = [
    "entry",
    "type"
];

const filterEventsBy = (event, key, value) => value.includes(event[key]);

const filterEvents = (events, subscriptions) => {
    let filteredEvents = events;

    subscriptionKeys.forEach(key => {
        filteredEvents = filteredEvents.filter(event => filterEventsBy(event, key, subscriptions[key]));
    });

    return filteredEvents;
};

module.exports.handleSubscriptions = async () => {   
    const preferences = await getAllPreferences();

    if (preferences.length) {
        const actualEvents = await getActualEventsForToday();
        
        preferences.forEach(preference => {
            const periodicity = preference.notifications.periodicity;
            const subscriptions = preference.subscriptions;

            if (preference.notifications.enabled && shouldSendDigestToday(periodicity)) {
                const events = filterEvents(actualEvents, subscriptions);
                const message = createEventsDigest(
                    messages.subscriptionDigestHeader(periodicity),
                    events
                );

                message && handler.telegram.sendMessage(preference.uid, message, markup);
            }
        });
    }
};