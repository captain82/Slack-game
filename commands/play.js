'use strict';

const sendMessage = require('../helpers/messenger').default;
const sendJsonMessage = require('../helpers/messenger').default;
const sendInteractiveMessage = require('../helpers/messenger').default;


const constants = require('../constants');

function play (gameManager, channelId, userId, respond) {
   const opponentName = gameManager.getOpponentName();

  const opponentId = gameManager.getUserId(opponentName);
  gameManager.addGame(channelId, userId, opponentId);

  const game = gameManager.getGame(channelId);
  const board = game._buildTicTacMessage();
  return board;
}

module.exports = play;
