const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const markup = Extra.markdown();

const handler = new Telegraf(process.env.TELEGRAM_TOKEN);

const {
    getPreferences,
    getActualEventsForToday,
} = require("./utils/mongo");
const { shouldSendDigestToday } = require("./utils/time");
const { createEventsDigest } = require("./utils/editor");

const messages = require("./constants/messages");

module.exports.handleSubscriptions = async () => {   
    const preferences = await getPreferences();

    if (preferences.length) {
        const actualEvents = await getActualEventsForToday();
        
        preferences.forEach(preference => {
            const periodicity = preference.notifications.periodicity;

            if (preference.notifications.enabled && shouldSendDigestToday(periodicity)) {
                const message = createEventsDigest(
                    messages.subscriptionDigestHeader(periodicity),
                    actualEvents
                );

                message && handler.telegram.sendMessage(preference.uid, message, markup);
            }
        });
    }
};