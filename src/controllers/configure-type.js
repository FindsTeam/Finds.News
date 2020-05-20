const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");

const {
    savePreference,
} = require("../utils/mongo");

const keyboards = require("../constants/keyboards");
const buttons = require("../constants/buttons");
const messages = require("../constants/messages");
const { eventTypes } = require("../constants/preferences");

const typeChangeHandler = new Composer();

const eventTypeMapping = new Map([
    [ buttons.educationEvents, [ eventTypes.education ] ],
    [ buttons.entertainmentEvents, [ eventTypes.entertainment ] ],
    [ buttons.allTypesEvents, [ eventTypes.education, eventTypes.entertainment ] ]
]);

const finishTypeChanging = async context => {
    const type = eventTypeMapping.get(context.match);
    const preference = {
        uid: context.update.message.chat.id,
        "subscriptions.type": type
    };
    const savedPreference = await savePreference(preference);

    if (savedPreference) {
        context.session.preference = savedPreference;
    }
    
    await context.reply(savedPreference ? messages.preferencesChangeSuccess : messages.preferencesChangeFailure);
    await context.scene.leave();
    await context.scene.enter("preferences-wizard");
};

typeChangeHandler.hears(buttons.educationEvents, async context => await finishTypeChanging(context));
typeChangeHandler.hears(buttons.entertainmentEvents, async context => await finishTypeChanging(context));
typeChangeHandler.hears(buttons.allTypesEvents, async context => await finishTypeChanging(context));

const configureTypeWizard = new WizardScene("configure-type-wizard",
    async (context) => {
        await context.reply(messages.askAboutTypeChange, keyboards.changeTypeMenu);

        await context.wizard.next();
    },
    typeChangeHandler
);

module.exports.configureTypeWizard = configureTypeWizard;