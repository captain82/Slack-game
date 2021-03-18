const constants = require('../constants')

class Game {

    constructor(boardSize, player1Id, player2Id) {
        this._boardSize = boardSize;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this._curPlayerIsP1 = true;
        this._board = this.initBoard(boardSize);
        this._availableSpots = new Array(boardSize * boardSize).fill(true);
    }

    _initBoard(size) {
        return [...new Array(size)].map((d, row) => {
            return [...new Array(size)].map((d, col) => {
                let position = this._mapCoordstoMove(row, col);
                return constants.boardSymbolMap[position.toString()];
            });
        });
    }

    _mapCoordstoMove(row, col) {
        return (row * this._boardSize) + col + 1;
    }

    _mapMovetoCoords(position) {
        const col = (position - 1) % this._boardSize;
        const row = (position - 1 - col) / this._boardSize;
        return [row, col];
    }

    validMove(position) {
        if (position < 1 || position > this._availableSpots.length) {
            return false;
        }
        return this._availableSpots[position - 1];
    }
}