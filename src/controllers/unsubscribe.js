const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");

const {
    savePreference,
} = require("../utils/mongo");

const keyboards = require("../constants/keyboards");
const buttons = require("../constants/buttons");
const messages = require("../constants/messages");

const unsubscriptionProceedHandler = new Composer();

unsubscriptionProceedHandler.hears(buttons.confirmSubscription, async context => {
    const preference = context.session.preference;

    preference.notifications.enabled = false;
    
    const savedPreference = await savePreference(preference);

    if (savedPreference) {
        context.session.preference = savedPreference;
    }
    
    await context.reply(savedPreference ? messages.finishUnsubscribingSuccess : messages.finishUnsubscribingFailure);

    await context.scene.leave();
    await context.scene.enter("main-scene");
});

const unsubscribeWizard = new WizardScene("unsubscribe-wizard",
    async (context) => {
        context.reply(messages.unsubscriptionWarning, keyboards.subscriptionWarning);

        return context.wizard.next();
    },
    unsubscriptionProceedHandler,
);

module.exports.unsubscribeWizard = unsubscribeWizard;