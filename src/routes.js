import dialogflow from '@google-cloud/dialogflow';
import * as uuid from 'uuid';
import Const from './constant';
import * as fs from 'fs';

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
let db = {};

const typingAction = async (bot, message, timeout = 1500) => {
    await bot.sendChatAction(message.chat.id, 'typing')
    await sleep(timeout);
}

const init = async (message, bot, result) => {
    const adjectifs = Const.adjectifs.sort(() => Math.random() - 0.5);
    let i = 0;
    await bot.sendMessage(message.chat.id, `${result} ${message.from.first_name} ! =p`);
    await bot.sendMessage(message.chat.id, 'Choisi un rat 2 rue.');
    await typingAction(bot, message);
    for (const rat of Const.rats) {
        const stream = fs.createReadStream(`./rats/${rat}.jpg`);
        await bot.sendMessage(message.chat.id, `${rat[0].toUpperCase() + rat.slice(1).toLowerCase()}${adjectifs[i++]}`,);
        await bot.sendPhoto(message.chat.id, stream);
        await typingAction(bot, message);
    }
    bot.sendMessage(message.chat.id, 'Quel rat voulez-vous faire combattre ?', {
        "parse_mode": "Markdown",
        "reply_markup": {
            "keyboard": Const.rats.map(x => [x[0].toUpperCase() + x.slice(1).toLowerCase()])
        }
    });
}

const getDialogflowResult = async (projectId, sessionId, message) => {
    const sessionClient = new dialogflow.SessionsClient({
        keyFilename: './key.json'
    });
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const req = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message.text,
                languageCode: 'fr-FR'
            }
        }
    };
    return await sessionClient.detectIntent(req);
}

const fightRats = async (message, bot) => {
    let rats = Const.rats.map(rat => rat[0].toUpperCase() + rat.slice(1).toLowerCase());
    let i = 1;
    await typingAction(bot, message);
    await bot.sendMessage(message.chat.id, `${message.from.first_name} ${message.from.last_name} vous avez choisi ${message.text}, le combat va commencer.`);
    while (rats.length > 1) {
        await bot.sendMessage(message.chat.id, `Le round ${i++} commence, ${rats.join(', ')} sont en vie.`);
        await typingAction(bot, message, 2500);
        const lose = rats[Math.floor(Math.random() * rats.length)];
        rats = rats.filter(rat => rat !== lose);
        await bot.sendMessage(message.chat.id, `${lose} est mort`);
        await typingAction(bot, message, 2000);
    }
    if (rats[0] === message.text) await bot.sendMessage(message.chat.id, `Bravo ${message.text} a gagne.`);
    else await bot.sendMessage(message.chat.id, `Le gagnant est ${rats[0]}, dommage.`);
};

export const useDialogflow = async (message, bot, projectId = Const.projectId) => {
    const sessionId = uuid.v4();
    console.log(message, db)
    if (Const.rats.includes(message.text.toLowerCase()))
        fightRats(message, bot);
    else {
        const result = (await getDialogflowResult(projectId, sessionId, message))[0].queryResult.fulfillmentText;
        if (result === 'Bonjour')
            await init(message, bot, result)
        else bot.sendMessage(message.chat.id, result || 'Je ne comprend pas desole.');
    }
};
