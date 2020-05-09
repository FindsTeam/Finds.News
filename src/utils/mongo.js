const Event = require("../models/event");
const Preferences = require("../models/preference");

const { toMongoDate, now, endOfToday } = require("./time");
const { isEventSingle, sortByDate } = require("./events");

const findEventByQuery = query => Event.find(query, (error, result) => result);

const getEventsInRangeByStartTime = async (from, to) => {
    const query = {
        start: {
            $gte: from,
            $lte: to
        }
    };

    return await findEventByQuery(query);
};

module.exports.getActualEventsForToday = async () => {
    const currentTimestamp = toMongoDate(now());
    const endOfDayTimestamp = toMongoDate(endOfToday());
    const events = await getEventsInRangeByStartTime(currentTimestamp, endOfDayTimestamp);

    return events.sort((firstEvent, secondEvent) => sortByDate(firstEvent, secondEvent));
};

module.exports.getEventsInProgressForToday = async () => {
    const currentTimestamp = toMongoDate(now());
    const query = {
        start: {
            $lte: currentTimestamp,
        },
        end: {
            $gte: currentTimestamp
        }
    };
    const events = await findEventByQuery(query);

    return events.filter(event => isEventSingle(event))
        .sort((firstEvent, secondEvent) => sortByDate(firstEvent, secondEvent));
};

module.exports.savePreferences = async preferences => {
    const query = { uid: preferences.uid };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    return await Preferences.findOneAndUpdate(query, preferences, options);
};