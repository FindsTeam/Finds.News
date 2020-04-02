const { fromMongoDate } = require("./time");

const SEPARATOR = "\n`______________________________`\n\n";

const fullEventInformation = event => {
    const date = fromMongoDate(event.start);
    return `📆  ${ date }

📌  [${ event.title }](${ event.links.post })
    
🗒  ${ event.description.slice(0, 400) }
    
🌍  ${ event.address } ([${ event.place }](${ event.links.place }))`;
};

const fullEventInformationDigest = events => events.map(event => fullEventInformation(event)).join(SEPARATOR);

module.exports.createEventsDigest = events => {
    const amount = events.length;

    if (amount === 1) {
        return fullEventInformation(events[0]);
    } else if (amount < 4) {
        return fullEventInformationDigest(events);
    } else {
        return `🤖  Для тебя ничего не жалко, но я еще пока не умею обрабатывать ${ amount } ивентов за раз.`;
    }
};
