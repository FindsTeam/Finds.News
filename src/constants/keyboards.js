const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const buttons = require("./buttons");

const main = isSubscribed => {
    const subscribeButton = isSubscribed ? buttons.unsubscribe : buttons.subscribe;
    return Markup.keyboard([
        [ buttons.eventsToday, buttons.eventsAround ],
        [ subscribeButton, buttons.preferences ]
    ]).oneTime().resize().extra();
};

const haveEventsForToday = Markup.keyboard([
    [ buttons.home, buttons.feelingLucky ]
]).oneTime().resize().extra();

const noEventsForToday = Markup.keyboard([
    [ buttons.home, buttons.eventsTodayRetry ]
]).oneTime().resize().extra();

const askForLocation = Extra.markup(markup => {
    return markup.resize().oneTime().keyboard([
        [ buttons.home, buttons.locationRequest(markup) ] 
    ]);
});

const searchRadius = Markup.keyboard([
    [ buttons.near, buttons.walk ]
]).oneTime().resize().extra();

const subscriptionWarning = Markup.keyboard([
    [ buttons.home, buttons.confirmSubscription ]
]).oneTime().resize().extra();

const digestsPeriodicity = Markup.keyboard([
    [ buttons.digestsEveryWeekday, buttons.digestsBeforeWeekend ],
    [ buttons.home, buttons.digestsEveryDay ]
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