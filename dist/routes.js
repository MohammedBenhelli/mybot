'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useDialogflow = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _dialogflow = require('@google-cloud/dialogflow');

var _dialogflow2 = _interopRequireDefault(_dialogflow);

var _uuid = require('uuid');

var uuid = _interopRequireWildcard(_uuid);

var _constant = require('./constant');

var _constant2 = _interopRequireDefault(_constant);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sleep = function sleep(milliseconds) {
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, milliseconds);
    });
};
var db = {};

var typingAction = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(bot, message) {
        var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1500;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return bot.sendChatAction(message.chat.id, 'typing');

                    case 2:
                        _context.next = 4;
                        return sleep(timeout);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function typingAction(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var init = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(message, bot, result) {
        var adjectifs, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, rat, stream;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        adjectifs = _constant2.default.adjectifs.sort(function () {
                            return Math.random() - 0.5;
                        });
                        i = 0;
                        _context2.next = 4;
                        return bot.sendMessage(message.chat.id, result + ' ' + message.from.first_name + ' ! =p');

                    case 4:
                        _context2.next = 6;
                        return bot.sendMessage(message.chat.id, 'Choisi un rat 2 rue.');

                    case 6:
                        _context2.next = 8;
                        return typingAction(bot, message);

                    case 8:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context2.prev = 11;
                        _iterator = (0, _getIterator3.default)(_constant2.default.rats);

                    case 13:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context2.next = 25;
                            break;
                        }

                        rat = _step.value;
                        stream = fs.createReadStream('./rats/' + rat + '.jpg');
                        _context2.next = 18;
                        return bot.sendMessage(message.chat.id, '' + (rat[0].toUpperCase() + rat.slice(1).toLowerCase()) + adjectifs[i++]);

                    case 18:
                        _context2.next = 20;
                        return bot.sendPhoto(message.chat.id, stream);

                    case 20:
                        _context2.next = 22;
                        return typingAction(bot, message);

                    case 22:
                        _iteratorNormalCompletion = true;
                        _context2.next = 13;
                        break;

                    case 25:
                        _context2.next = 31;
                        break;

                    case 27:
                        _context2.prev = 27;
                        _context2.t0 = _context2['catch'](11);
                        _didIteratorError = true;
                        _iteratorError = _context2.t0;

                    case 31:
                        _context2.prev = 31;
                        _context2.prev = 32;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 34:
                        _context2.prev = 34;

                        if (!_didIteratorError) {
                            _context2.next = 37;
                            break;
                        }

                        throw _iteratorError;

                    case 37:
                        return _context2.finish(34);

                    case 38:
                        return _context2.finish(31);

                    case 39:
                        bot.sendMessage(message.chat.id, 'Quel rat voulez-vous faire combattre ?', {
                            "parse_mode": "Markdown",
                            "reply_markup": {
                                "keyboard": _constant2.default.rats.map(function (x) {
                                    return [x[0].toUpperCase() + x.slice(1).toLowerCase()];
                                })
                            }
                        });

                    case 40:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[11, 27, 31, 39], [32,, 34, 38]]);
    }));

    return function init(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

var getDialogflowResult = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(projectId, sessionId, message) {
        var sessionClient, sessionPath, req;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        sessionClient = new _dialogflow2.default.SessionsClient({
                            keyFilename: './key.json'
                        });
                        sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
                        req = {
                            session: sessionPath,
                            queryInput: {
                                text: {
                                    text: message.text,
                                    languageCode: 'fr-FR'
                                }
                            }
                        };
                        _context3.next = 5;
                        return sessionClient.detectIntent(req);

                    case 5:
                        return _context3.abrupt('return', _context3.sent);

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getDialogflowResult(_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
    };
}();

var fightRats = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(message, bot) {
        var rats, i, _loop;

        return _regenerator2.default.wrap(function _callee4$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        rats = _constant2.default.rats.map(function (rat) {
                            return rat[0].toUpperCase() + rat.slice(1).toLowerCase();
                        });
                        i = 1;
                        _context5.next = 4;
                        return typingAction(bot, message);

                    case 4:
                        _context5.next = 6;
                        return bot.sendMessage(message.chat.id, message.from.first_name + ' ' + message.from.last_name + ' vous avez choisi ' + message.text + ', le combat va commencer.');

                    case 6:
                        _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
                            var lose;
                            return _regenerator2.default.wrap(function _loop$(_context4) {
                                while (1) {
                                    switch (_context4.prev = _context4.next) {
                                        case 0:
                                            _context4.next = 2;
                                            return bot.sendMessage(message.chat.id, 'Le round ' + i++ + ' commence, ' + rats.join(', ') + ' sont en vie.');

                                        case 2:
                                            _context4.next = 4;
                                            return typingAction(bot, message, 2500);

                                        case 4:
                                            lose = rats[Math.floor(Math.random() * rats.length)];

                                            rats = rats.filter(function (rat) {
                                                return rat !== lose;
                                            });
                                            _context4.next = 8;
                                            return bot.sendMessage(message.chat.id, lose + ' est mort');

                                        case 8:
                                            _context4.next = 10;
                                            return typingAction(bot, message, 2000);

                                        case 10:
                                        case 'end':
                                            return _context4.stop();
                                    }
                                }
                            }, _loop, undefined);
                        });

                    case 7:
                        if (!(rats.length > 1)) {
                            _context5.next = 11;
                            break;
                        }

                        return _context5.delegateYield(_loop(), 't0', 9);

                    case 9:
                        _context5.next = 7;
                        break;

                    case 11:
                        if (!(rats[0] === message.text)) {
                            _context5.next = 16;
                            break;
                        }

                        _context5.next = 14;
                        return bot.sendMessage(message.chat.id, 'Bravo ' + message.text + ' a gagne.');

                    case 14:
                        _context5.next = 18;
                        break;

                    case 16:
                        _context5.next = 18;
                        return bot.sendMessage(message.chat.id, 'Le gagnant est ' + rats[0] + ', dommage.');

                    case 18:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function fightRats(_x10, _x11) {
        return _ref4.apply(this, arguments);
    };
}();

var useDialogflow = exports.useDialogflow = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(message, bot) {
        var projectId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constant2.default.projectId;
        var sessionId, result;
        return _regenerator2.default.wrap(function _callee5$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        sessionId = uuid.v4();

                        console.log(message, db);

                        if (!_constant2.default.rats.includes(message.text.toLowerCase())) {
                            _context6.next = 6;
                            break;
                        }

                        fightRats(message, bot);
                        _context6.next = 15;
                        break;

                    case 6:
                        _context6.next = 8;
                        return getDialogflowResult(projectId, sessionId, message);

                    case 8:
                        result = _context6.sent[0].queryResult.fulfillmentText;

                        if (!(result === 'Bonjour')) {
                            _context6.next = 14;
                            break;
                        }

                        _context6.next = 12;
                        return init(message, bot, result);

                    case 12:
                        _context6.next = 15;
                        break;

                    case 14:
                        bot.sendMessage(message.chat.id, result || 'Je ne comprend pas desole.');

                    case 15:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function useDialogflow(_x12, _x13) {
        return _ref5.apply(this, arguments);
    };
}();