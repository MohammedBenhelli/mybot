'use strict';

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _constant = require('./constant');

var _constant2 = _interopRequireDefault(_constant);

var _routes = require('./routes');

require('babel-core/register');

require('babel-polyfill');

require('regenerator-runtime');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bot = new _nodeTelegramBotApi2.default(_constant2.default.token, { polling: true });

bot.on("polling_error", function (err) {
  return console.log(err);
});
bot.on('message', function (msg, match) {
  return (0, _routes.useDialogflow)(msg, bot);
});