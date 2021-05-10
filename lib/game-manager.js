const Game = require('./game');

/**
* Maintains mapping between channels and games
* as well as the list of workspace users. Methods
* can be used to add, get and remove games.
*/

class GameManager {

    constructor(workspaceUsers) {
        this._workspaceUsers = workspaceUsers;
        this._activeGames = {};
        this._opponentName = '';
    }

    addGame(channelId, player1Id, player2Id) {
        this._activeGames[channelId] = new Game(3, player1Id, player2Id);
    }

    hasUser(userName) {
        return this._workspaceUsers[userName] != null;
    }

    addOpponentName(opponentName){
        this._opponentName = opponentName;
    }

    getOpponentName(){
        return this._opponentName;
    }

    getUserId(userName) {
        return this._workspaceUsers[userName];
    }

    hasGame(channelId) {
        return this._activeGames[channelId] != null;
    }

    getGame(channelId) {
        return this._activeGames[channelId];
    }

    removeGame(channelId) {
        this._activeGames[channelId] = null;
    }

}

module.exports = GameManager;
