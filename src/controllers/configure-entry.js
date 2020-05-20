const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");

const {
    savePreference,
} = require("../utils/mongo");

const keyboards = require("../constants/keyboards");
const buttons = require("../constants/buttons");
const messages = require("../constants/messages");
const { eventEntryTypes } = require("../constants/preferences");

const entryChangeHandler = new Composer();

const eventEntryMapping = new Map([
    [ buttons.freeEvents, [ eventEntryTypes.free ] ],
    [ buttons.paidEvents, [ eventEntryTypes.paid ] ],
    [ buttons.allEntryTypesEvents, [ eventEntryTypes.free, eventEntryTypes.paid ] ]
]);

const finishEntryChanging = async context => {
    const entry = eventEntryMapping.get(context.match);
    const preference = {
        uid: context.update.message.chat.id,
        "subscriptions.entry": entry
    };
    const savedPreference = await savePreference(preference);

    if (savedPreference) {
        context.session.preference = savedPreference;
    }
    
    await context.reply(savedPreference ? messages.preferencesChangeSuccess : messages.preferencesChangeFailure);
    await context.scene.leave();
    await context.scene.enter("preferences-wizard");
};

entryChangeHandler.hears(buttons.freeEvents, async context => await finishEntryChanging(context));
entryChangeHandler.hears(buttons.paidEvents, async context => await finishEntryChanging(context));
entryChangeHandler.hears(buttons.allEntryTypesEvents, async context => await finishEntryChanging(context));

const configureEntryWizard = new WizardScene("configure-entry-wizard",
    async (context) => {
        await context.reply(messages.askAboutEntryChange, keyboards.changeEntryTypeMenu);

        await context.wizard.next();
    },
    entryChangeHandler
);

module.exports.configureEntryWizard = configureEntryWizard;