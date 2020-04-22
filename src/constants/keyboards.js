const Markup = require("telegraf/markup");
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

module.exports = {
    main,
    haveEventsForToday,
    noEventsForToday
};