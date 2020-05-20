const Telegraf = require("telegraf");

const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");

const buttons = require("./constants/buttons");
const keyboards = require("./constants/keyboards");
const messages = require("./constants/messages");

const {
    eventsTodayWizard
} = require("./controllers/events-today");
const {
    eventsAroundWizard
} = require("./controllers/events-around");
const {
    subscribeWizard
} = require("./controllers/subscribe");
const {
    unsubscribeWizard
} = require("./controllers/unsubscribe");
const {
    preferencesWizard
} = require("./controllers/preferences");
const {
    configureTypeWizard
} = require("./controllers/configure-type");
const {
    configureEntryWizard
} = require("./controllers/configure-entry");

const { getPreferenceByUid } = require("./utils/mongo");

const token = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(token, { polling: true });

const start = async context => {
    if (context && context.scene) {
        await context.scene.leave();
        await context.scene.enter("main-scene");
    }
};

const mainScene = new Scene("main-scene");

mainScene.enter(async context => {
    const uid = context.update.message.chat.id;
    const preference = await getPreferenceByUid(uid);
    const isSubscribed = preference && preference.notifications.enabled;
    
    context.session.preference = preference;

    return context.reply(
        messages.start,
        keyboards.main(isSubscribed)
    );
});

mainScene.hears(buttons.eventsToday, context => context.scene.enter("events-today-wizard"));
mainScene.hears(buttons.eventsAround, context => context.scene.enter("events-around-wizard"));
mainScene.hears(buttons.subscribe, context => context.scene.enter("subscribe-wizard"));
mainScene.hears(buttons.preferences, context => context.scene.enter("preferences-wizard"));

const stage = new Stage([
    mainScene,
    eventsAroundWizard,
    eventsTodayWizard,
    subscribeWizard,
    unsubscribeWizard,
    preferencesWizard,
    configureTypeWizard,
    configureEntryWizard
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(context => start(context));
bot.hears(buttons.home, context => start(context));

// fallback - there could be a situation when app reloaded and the user hangs outside every available scene
bot.hears(buttons.eventsToday, context => context.scene.enter("events-today-wizard"));
bot.hears(buttons.eventsAround, context => context.scene.enter("events-around-wizard"));

module.exports.handleChat = () => {
    if (process.env.NODE_ENV === "development") {
        bot.launch();
    } else {
        bot.launch({
            webhook: {
                domain: process.env.HEROKU_URL + token,
                port: process.env.PORT
            }
        });
    }
};