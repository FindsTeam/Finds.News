const Telegraf = require("telegraf");

const buttons = require("./constants/buttons");
const keyboards = require("./constants/keyboards");
const messages = require("./constants/messages");

const eventsToday = require("./controllers/events-today");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(({ reply }) => {
    return reply(
        messages.start,
        keyboards.main
    );
});

bot.hears(buttons.eventsToday, context => eventsToday(context));
bot.hears(buttons.eventsAround, context => context.reply(messages.sendLocation));

bot.launch();