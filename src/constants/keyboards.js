const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const buttons = require("./buttons");

const main = Markup.keyboard([
    [ buttons.eventsToday, buttons.eventsAround ]
]).oneTime().resize().extra();

const haveEventsForToday = Markup.keyboard([
    [ buttons.back, buttons.feelingLucky ]
]).oneTime().resize().extra();

const noEventsForToday = Markup.keyboard([
    [ buttons.back, buttons.eventsTodayRetry ]
]).oneTime().resize().extra();

const askForLocation = Extra.markup(markup => {
    return markup.resize().oneTime().keyboard([
        buttons.locationRequest(markup),
        buttons.back
    ]);
});

module.exports = {
    main,
    haveEventsForToday,
    noEventsForToday,
    askForLocation
};