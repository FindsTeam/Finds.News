const { toFindsBriefDate, now, toFindsTime } = require("./time");

const MAX_EVENTS_AMOUNT = 12;
const SHORT_DESCRIPTION = 150;
const LONG_DESCRIPTION = 400;
const SEPARATOR = "`______________________________`\n";
const EVENTS_SEPARATOR = `\n${ SEPARATOR }\n`;

const buildBriefing = amount => {
    return `\n📆  _${ toFindsBriefDate(now()) }_
🎉  Событий найдено: *${ amount }*
🤖  _Просим прощения, если ссылки будут битыми, описания неинформативными, а сами события — ужасными. Такова воля судьбы._`;
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

const fullEventInformationDigest = (header, events) => {
    return `${ header }
${ buildBriefing(events.length) }
${ SEPARATOR }
${ events.map(event => fullEventInformation(event)).join(EVENTS_SEPARATOR) }`;
};

const shortEventInformationDigest = (header, events) => {
    return `${ header }
${ buildBriefing(events.length) }
${ SEPARATOR }
${ events.map(event => shortEventInformation(event)).join(EVENTS_SEPARATOR) }`;
};

module.exports.createEventsDigest = (header, events) => {
    const amount = events.length;

    if (amount) {
        if (amount < 4) {
            return fullEventInformationDigest(header, events);
        } else {
            return shortEventInformationDigest(header, events.splice(0, MAX_EVENTS_AMOUNT));
        }
    } else {
        return "";
    }
};
