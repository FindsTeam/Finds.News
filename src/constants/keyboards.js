const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const buttons = require("./buttons");

const main = Markup.keyboard([
    [ buttons.eventsToday, buttons.eventsAround ],
    [ buttons.subscribe, buttons.preferences ]
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

const searchRadius = Markup.keyboard([
    [ buttons.near, buttons.walk ]
]).oneTime().resize().extra();

const subscriptionWarning = Markup.keyboard([
    [ buttons.back, buttons.confirmSubscription ]
]).oneTime().resize().extra();

const digestsPeriodicity = Markup.keyboard([
    [ buttons.digestsEveryWeekday, buttons.digestsBeforeWeekend ],
    [ buttons.back, buttons.digestsEveryDay ]
]).oneTime().resize().extra();

module.exports = {
    main,
    haveEventsForToday,
    noEventsForToday,
    askForLocation,
    searchRadius,
    subscriptionWarning,
    digestsPeriodicity
};