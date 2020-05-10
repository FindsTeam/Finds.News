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
        message = createEventsDigest(messages.eventsTodayHeader, events);
        keyboard = keyboards.haveEventsForToday;
    } else {
        message = messages.noEventsForToday;
        keyboard = keyboards.noEventsForToday;
    }

    await context.reply(message, markup);
    return keyboard;
};

const eventsForToday = async context => {
    const actualEvents = await getActualEventsForToday();

    return await buildReply(context, actualEvents);
};

const retryEventsForToday = async context => {
    const keyboard = await eventsForToday(context);

    return context.reply(messages.afterSearch, keyboard);
};

const feelingLuckyForToday = async context => {
    const actualEvents = await getActualEventsForToday();
    const randomEvent = [ actualEvents[Math.floor(Math.random() * actualEvents.length)] ];
    const keyboard = await buildReply(context, randomEvent);

    return context.reply(messages.afterSearch, keyboard);
};

const afterSearchStepHandler = new Composer();
afterSearchStepHandler.hears(buttons.eventsTodayRetry, context => retryEventsForToday(context));
afterSearchStepHandler.hears(buttons.feelingLucky, context => feelingLuckyForToday(context));

module.exports.eventsTodayWizard = new WizardScene("events-today-wizard",
    async (context) => {
        const keyboard = await eventsForToday(context);

        context.reply(messages.afterSearch, keyboard); 

        return context.wizard.next();
    },
    afterSearchStepHandler
);
