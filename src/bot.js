const Telegraf = require("telegraf");

const buttons = require("./constants/buttons");
const keyboards = require("./constants/keyboards");
const messages = require("./constants/messages");

const eventsToday = require("./controllers/events-today");

const token = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(token, { polling: true });

bot.start(({ reply }) => {
    return reply(
        messages.start,
        keyboards.main
    );
});

bot.hears(buttons.eventsToday, context => eventsToday(context));
bot.hears(buttons.eventsAround, context => context.reply(messages.sendLocation));

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