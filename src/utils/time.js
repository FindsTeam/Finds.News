const moment = require("moment");
const { capitalize } = require("./text");

const periodicityTypes = require("../constants/periodicity-types");

const MONGO_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const FINDS_DAY_FORMAT = "DD.MM.YYYY";
const FINDS_START_TIME_FORMAT = "HH:mm";
const FINDS_BRIEF_FORMAT = `dddd, ${ FINDS_DAY_FORMAT }`;
const FINDS_FULL_FORMAT = `${ FINDS_BRIEF_FORMAT }, ${ FINDS_START_TIME_FORMAT }`;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const periodicityMapping = new Map([
    [ periodicityTypes.everyDay, [ 1, 2, 3, 4, 5, 6, 0 ] ],
    [ periodicityTypes.everyWeekday, [ 1, 2, 3, 4, 5 ] ],
    [ periodicityTypes.beforeWeekend, [ 5, 6, 0 ] ],
]);

moment.locale("ru");

module.exports.now = () => {
    return moment().valueOf();
};

module.exports.toMilliseconds = timestamp => {
    return moment(timestamp).valueOf();
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

module.exports.toFindsFullDate = time => {
    return capitalize(moment(time).local().format(FINDS_FULL_FORMAT));
};

module.exports.toFindsBriefDate = time => {
    return capitalize(moment(time).local().format(FINDS_BRIEF_FORMAT));
};

module.exports.toFindsTime = time => {
    return moment(time).local().format(FINDS_START_TIME_FORMAT);
};

module.exports.isTimePeriodLessThanOneDay = (from, to) => {
    return moment(to).diff(from, "milliseconds") < DAY; 
};

module.exports.shouldSendDigestToday = periodicity => {
    const dayOfWeek = moment().day();

    return periodicityMapping.get(periodicity).includes(dayOfWeek);
};
