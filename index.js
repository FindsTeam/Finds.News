require("dotenv").config();
require("./src/mongoose").connect();

const { handleChat } = require("./src/chat");
const { handleSubscriptions } = require("./src/subscriptions");

(() => {
    const argument = process.argv.slice(2)[0];
    
    switch (argument) {
    case "chat":
        handleChat();
        break;
    case "subscriptions":
        handleSubscriptions();
        break;
    default:
        handleChat();
    }
})();