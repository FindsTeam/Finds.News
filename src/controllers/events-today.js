const extra = require("telegraf/extra");
const markup = extra.markdown();

const messages = require("../constants/messages");

const {
    getActualEventsForToday,
} = require("../utils/mongo");

const {
    createEventsDigest
} = require("../utils/editor");

module.exports = async context => {
    const actualEvents = await getActualEventsForToday();
    const message = actualEvents.length ? createEventsDigest(actualEvents) : messages.noEventsForToday;

    context.reply(message, markup);
};
