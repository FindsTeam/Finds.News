const { isTimePeriodLessThanOneDay, toMilliseconds } = require("./time");

module.exports.isEventSingle = event => {
    const {
        start,
        end
    } = event;

    return isTimePeriodLessThanOneDay(start, end);
};

module.exports.sortByDate = (firstEvent, secondEvent) => {
    return toMilliseconds(firstEvent.start) - toMilliseconds(secondEvent.start); 
};