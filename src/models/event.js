const mongoose = require("mongoose");
const Links = require("./links");

mongoose.Promise = Promise;

const event = new mongoose.Schema({
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
    }
}, {
    collection: "events",
    versionKey: false
});

module.exports = mongoose.model("events", event);