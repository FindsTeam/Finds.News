const Extra = require("telegraf/extra");
const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");
const markup = Extra.markdown();

const keyboards = require("../constants/keyboards");
const buttons = require("../constants/buttons");
const messages = require("../constants/messages");

const {
    getActualEventsForToday,
} = require("../utils/mongo");

const {
    createEventsDigest
} = require("../utils/editor");

const buildReply = async (context, events) => {
    let message;
    let keyboard;

    if (events.length) {
        message = createEventsDigest(messages.eventsToday, events);
        keyboard = keyboards.haveEventsForToday;
    } else {
        message = messages.noEventsForToday;
        keyboard = keyboards.noEventsForToday;
    }

    await context.reply(message, markup);
    return await context.reply(messages.afterSearch, keyboard);
};

const eventsForToday = async context => {
    const actualEvents = await getActualEventsForToday();

    return await buildReply(context, actualEvents);
};

const feelingLuckyForToday = async context => {
    const actualEvents = await getActualEventsForToday();
    const randomEvent = [ actualEvents[Math.floor(Math.random() * actualEvents.length)] ];

    return await buildReply(context, randomEvent);
};

const afterSearchStepHandler = new Composer();
afterSearchStepHandler.hears(buttons.eventsTodayRetry, context => eventsForToday(context));
afterSearchStepHandler.hears(buttons.feelingLucky, context => feelingLuckyForToday(context));

module.exports.eventsTodayWizard = new WizardScene("events-today-wizard",
    (context) => {
        eventsForToday(context);

        return context.wizard.next();
    },
    afterSearchStepHandler
);
