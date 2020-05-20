const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");

const {
    savePreference,
} = require("../utils/mongo");

const keyboards = require("../constants/keyboards");
const buttons = require("../constants/buttons");
const messages = require("../constants/messages");
const { periodicityTypes } = require("../constants/preferences");

const periodicityMapping = new Map([
    [ buttons.digestsEveryDay, periodicityTypes.everyDay ],
    [ buttons.digestsEveryWeekday, periodicityTypes.everyWeekday ],
    [ buttons.digestsBeforeWeekend, periodicityTypes.beforeWeekend ]
]);

const finishSubscribing = async context => {
    const periodicity = periodicityMapping.get(context.match);
    const preference = {
        uid: context.update.message.chat.id,
        name: context.update.message.chat.first_name || context.update.message.chat.title,
        notifications: {
            enabled: true,
            periodicity
        }
    };
    const savedPreference = await savePreference(preference);

    if (savedPreference) {
        context.session.preference = savedPreference;
    }
    
    await context.reply(savedPreference ? messages.finishSubscribingSuccess : messages.finishSubscribingFailure);
    await context.scene.leave();
    await context.scene.enter("main-scene");
};

const subscriptionProceedHandler = new Composer();

subscriptionProceedHandler.hears(buttons.confirmSubscription, async context => {
    context.reply(messages.askAboutPeriodicity, keyboards.digestsPeriodicity);

    return context.wizard.next();
});

const digestsPeriodicityHandler = new Composer();

digestsPeriodicityHandler.hears(buttons.digestsEveryDay, async context => await finishSubscribing(context));
digestsPeriodicityHandler.hears(buttons.digestsEveryWeekday, async context => await finishSubscribing(context));
digestsPeriodicityHandler.hears(buttons.digestsBeforeWeekend, async context => await finishSubscribing(context));

const subscribeWizard = new WizardScene("subscribe-wizard",
    async (context) => {
        context.reply(messages.subscriptionWarning, keyboards.subscriptionWarning);

        return context.wizard.next();
    },
    subscriptionProceedHandler,
    digestsPeriodicityHandler
);

module.exports.subscribeWizard = subscribeWizard;