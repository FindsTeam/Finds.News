const { isTimePeriodLessThanOneDay } = require("./time");

module.exports.isEventSingle = event => {
    const {
        start,
        end
    } = event;

    return isTimePeriodLessThanOneDay(start, end);
};