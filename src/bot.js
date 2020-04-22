const Telegraf = require("telegraf");

const buttons = require("./constants/buttons");
const keyboards = require("./constants/keyboards");
const messages = require("./constants/messages");

const {
    eventsForToday,
    feelingLuckyForToday
} = require("./controllers/events-today");

const {
    askForLocation,
    eventsAround
} = require("./controllers/events-around");

const LOCATION = "location";

const token = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(token, { polling: true });

const start = context => context.reply(
    messages.start,
    keyboards.main
);

bot.start(context => start(context));
bot.hears(buttons.back, context => start(context));
bot.hears(buttons.eventsToday, context => eventsForToday(context));
bot.hears(buttons.eventsTodayRetry, context => eventsForToday(context));
bot.hears(buttons.feelingLucky, context => feelingLuckyForToday(context));
bot.hears(buttons.eventsAround, context => askForLocation(context));
bot.on(LOCATION, context => eventsAround(context));

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