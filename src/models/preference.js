const mongoose = require("mongoose");
const Notifications = require("./notification");
const Subscriptions = require("./subscription");

const Preferences = new mongoose.Schema({
    uid: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    notifications: {
        type: Notifications,
        required: false
    },
    subscriptions: {
        type: Subscriptions,
        required: false,
    }
});

module.exports = mongoose.model("Preferences", Preferences);