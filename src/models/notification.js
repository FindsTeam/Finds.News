const mongoose = require("mongoose");

const Notifications = new mongoose.Schema({
    enabled: {
        type: Boolean,
        required: true
    },
    periodicity: {
        type: String,
        required: true
    }
});

module.exports = Notifications;