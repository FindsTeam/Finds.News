const Extra = require("telegraf/extra");
const Composer = require("telegraf/composer");
const WizardScene = require("telegraf/scenes/wizard");
const markup = Extra.markdown();

const keyboards = require("../constants/keyboards");
const buttons = require("../constants/buttons");
const messages = require("../constants/messages");

const preferenceChangeHandler = new Composer();

const enterScene = async (context, scene) => {
    await context.scene.leave();
    await context.scene.enter(scene);
};

preferenceChangeHandler.hears(buttons.configureType, async context => await enterScene(context, "configure-type-wizard"));
preferenceChangeHandler.hears(buttons.configureEntry, async context => await enterScene(context, "configure-entry-wizard"));
preferenceChangeHandler.hears(buttons.unsubscribe, async context => await enterScene(context, "unsubscribe-wizard"));

const preferencesWizard = new WizardScene("preferences-wizard",
    async (context) => {

        await context.reply(messages.preferences(context.session.preference), markup);
        await context.reply(messages.askAboutPreferenceChange, keyboards.preferencesMenu);

        await context.wizard.next();
    },
    preferenceChangeHandler
);

module.exports.preferencesWizard = preferencesWizard;