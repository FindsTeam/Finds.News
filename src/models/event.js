const mongoose = require("mongoose");
const Links = require("./links");

mongoose.Promise = Promise;

const Event = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: false
    },
    links: {
        type: Links,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    entry: {
        type: String,
        required: true,
    }
}, {
    collection: "events",
    versionKey: false,
    strict: false
});

module.exports = mongoose.model("events", Event);