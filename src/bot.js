const Telegraf = require("telegraf");

const session = require("telegraf/session");
const Stage = require("telegraf/stage");

const buttons = require("./constants/buttons");
const keyboards = require("./constants/keyboards");
const messages = require("./constants/messages");

const {
    eventsForToday,
    feelingLuckyForToday
} = require("./controllers/events-today");

const {
    eventsAroundWizard
} = require("./controllers/events-around");

const token = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(token, { polling: true });

const start = async context => {
    context.scene && await context.scene.leave();

    return context.reply(
        messages.start,
        keyboards.main
    );
};

const stage = new Stage([ eventsAroundWizard ]);

bot.use(session());
bot.use(stage.middleware());

bot.start(context => start(context));
bot.hears(buttons.back, context => start(context));

bot.hears(buttons.eventsToday, context => eventsForToday(context));
bot.hears(buttons.eventsTodayRetry, context => eventsForToday(context));
bot.hears(buttons.feelingLucky, context => feelingLuckyForToday(context));

bot.hears(buttons.eventsAround, context => context.scene.enter("events-around-wizard"));


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
