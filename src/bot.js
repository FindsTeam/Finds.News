const Telegraf = require("telegraf");
const buttons = require("./constants/buttons");
const keyboards = require("./constants/keyboards");
const messages = require("./constants/messages");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.use(Telegraf.log());

bot.start(({ reply }) => {
    return reply(
        messages.start,
        keyboards.main
    );
});

bot.hears(buttons.eventsAround, ctx => ctx.reply(messages.sendLocation));
bot.hears(buttons.eventsToday, ctx => ctx.reply(messages.eventsToday));

bot.launch();