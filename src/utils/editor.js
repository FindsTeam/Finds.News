const messages = require("../constants/messages");

const { toFindsBriefDate, now, toFindsTime } = require("./time");

const MAX_EVENTS_AMOUNT = 12;
const SHORT_DESCRIPTION = 180;
const LONG_DESCRIPTION = 400;
const SEPARATOR = "`______________________________`\n";
const EVENTS_SEPARATOR = `\n${ SEPARATOR }\n`;

const buildBriefing = amount => {
    return `\n📆  _${ toFindsBriefDate(now()) }_
🎉  Ивентов найдено: *${ amount }*
🤖  _Просим прощения, если ссылки будут битыми, описания неинформативными, а ивенты — отстойными._`;
};

const buildAddress = event => {
    const {
        address,
        place
    } = event;

    const placeString = place ? `[${ place }](${ event.links.place })` : "";
    const placeSection = address && placeString ? `(${ placeString })` : placeString;
    
    return address ? `_${ address }_ ${ placeSection}` : placeSection;
};

const fullEventInformation = event => {
    return `⏰  _${ toFindsTime(event.start) }_\n
📌  [${ event.title }](${ event.links.post })\n
🗒  ${ event.description.slice(0, LONG_DESCRIPTION) }...\n
🌍  ${ buildAddress(event) }`;
};

const shortEventInformation = event => {
    return `⏰  _${ toFindsTime(event.start) }_
📌  [${ event.title }](${ event.links.post }) ${ event.description.slice(0, SHORT_DESCRIPTION) }...
🌍  ${ buildAddress(event) }`;
};

const fullEventInformationDigest = events => {
    return `${ messages.eventsToday }
${ buildBriefing(events.length) }
${ SEPARATOR }
${ events.map(event => fullEventInformation(event)).join(EVENTS_SEPARATOR) }`;
};

const shortEventInformationDigest = events => {
    return `${ messages.eventsToday }
${ buildBriefing(events.length) }
${ SEPARATOR }
${ events.map(event => shortEventInformation(event)).join(EVENTS_SEPARATOR) }`;
};

module.exports.createEventsDigest = events => {
    const amount = events.length;

    if (amount === 1) {
        return fullEventInformation(events[0]);
    } else if (amount < 4) {
        return fullEventInformationDigest(events);
    } else {
        return shortEventInformationDigest(events.splice(0, MAX_EVENTS_AMOUNT));
    }
};
