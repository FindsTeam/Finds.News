const Extra = require("telegraf/extra");
const markup = Extra.markdown();

const keyboards = require("../constants/keyboards");

const messages = require("../constants/messages");

const {
    getActualEventsForToday,
} = require("../utils/mongo");

const {
    createEventsDigest
} = require("../utils/editor");

const buildReply = (context, events) => {
    let message;
    let keyboard;

    if (events.length) {
        message = createEventsDigest(events);
        keyboard = keyboards.haveEventsForToday;
    } else {
        message = messages.noEventsForToday;
        keyboard = keyboards.noEventsForToday;
    }

    return context.reply(message, markup).then(() => {
        context.reply(messages.afterEventsForToday, keyboard);
    });
};

module.exports.eventsForToday = async context => {
    const actualEvents = await getActualEventsForToday();

    buildReply(context, actualEvents);
};

module.exports.feelingLuckyForToday = async context => {
    const actualEvents = await getActualEventsForToday();
    const randomEvent = [ actualEvents[Math.floor(Math.random() * actualEvents.length)] ];

    buildReply(context, randomEvent);
};
