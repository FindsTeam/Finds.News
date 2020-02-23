const Markup = require("telegraf/markup");
const buttons = require("./buttons");

const main = Markup.keyboard([
    [ buttons.eventsToday, buttons.eventsAround ]
]).oneTime().resize().extra();

module.exports = {
    main 
};