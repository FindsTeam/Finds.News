const mongoose = require("mongoose");

const Subscriptions = new mongoose.Schema({
    entry: {
        type: Array,
        required: true,
        default: [ "free", "paid" ]
    },
    type: {
        type: Array,
        required: true,
        default: [ "education", "entertainment" ]
    },
});

module.exports = Subscriptions;