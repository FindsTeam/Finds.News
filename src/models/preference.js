const mongoose = require("mongoose");
const Notifications = require("./notification");

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
    }
});

module.exports = mongoose.model("Preferences", Preferences);