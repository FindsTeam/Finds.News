const moment = require("moment");
const { capitalize } = require("./text");

moment.locale("ru");

const MONGO_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const FINDS_FORMAT = "dddd, DD.MM.YYYY, HH:MM";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

module.exports.now = () => {
    return moment().valueOf();
};

module.exports.endOfToday = () => {
    return moment().endOf("day").valueOf();
};

module.exports.startOfToday = () => {
    return moment().startOf("day").valueOf();
};

module.exports.toMongoDate = time => {
    return moment(time).utc().format(MONGO_FORMAT);
};

module.exports.fromMongoDate = string => {
    return capitalize(moment(string).local().format(FINDS_FORMAT));
};

module.exports.isTimePeriodLessThanOneDay = (from, to) => {
    return moment(to).diff(from, "milliseconds") < DAY; 
};
