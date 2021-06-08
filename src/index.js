import TelegramBot from 'node-telegram-bot-api';
import Const from './constant';
import {useDialogflow} from './routes';

import "babel-core/register";
import "babel-polyfill";
import "regenerator-runtime";


const bot = new TelegramBot(Const.token, {polling: true});

bot.on("polling_error", (err) => console.log(err));
bot.on('message', (msg, match) => useDialogflow(msg, bot));
