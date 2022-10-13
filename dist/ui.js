var STATUS;
(function (STATUS) {
    STATUS["HIDDEN"] = "hidden";
    STATUS["MARKED"] = "marked";
    STATUS["MINE"] = "mine";
    STATUS["NUMBER"] = "number";
})(STATUS || (STATUS = {}));
export function AppGrid(boardSize, numberOfMines) {
    var board = [];
    var minePositions = getMinePositions(boardSize, numberOfMines);
    Array.from({ length: boardSize }, function (_r, x) {
        var rowElement = [];
        Array.from({ length: boardSize }, function (_c, y) {
            var element = document.createElement("div");
            element.dataset.status = "hidden";
            var tile = {
                element: element,
                x: x,
                y: y,
                mine: minePositions.some(positionMatch.bind(null, { x: x, y: y })),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
            };
            rowElement.push(tile);
        });
        board.push(rowElement);
    });
    return board;
}
export var checkWin = function (board) {
    return board.every(function (row) {
        return row.every(function (tiles) {
            return tiles.status === STATUS.NUMBER ||
                (tiles.mine &&
                    (tiles.status === STATUS.HIDDEN || tiles.status === STATUS.MARKED));
        });
    });
};
export var checkLose = function (board) {
    return board.some(function (row) {
        return row.some(function (t) { return t.status === STATUS.MINE; });
    });
};
export var revealTile = function (board, tile) {
    if (tile.status !== STATUS.HIDDEN) {
        return;
    }
    if (tile.mine) {
        tile.status = STATUS.MINE;
        return;
    }
    tile.status = STATUS.NUMBER;
    var adjacentTiles = nearbyTiles(board, tile);
    var mineCount = adjacentTiles.filter(function (p) { return p.mine; }).length;
    if (mineCount > 0) {
        tile.element.textContent = "".concat(mineCount);
    }
    else {
        adjacentTiles.forEach(revealTile.bind(null, board));
    }
};
var nearbyTiles = function (board, _a) {
    var _b;
    var x = _a.x, y = _a.y;
    var tiles = [];
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
        for (var yOffest = -1; yOffest <= 1; yOffest++) {
            var tile = (_b = board[x + xOffset]) === null || _b === void 0 ? void 0 : _b[y + yOffest];
            if (tile)
                tiles.push(tile);
        }
    }
    return tiles;
};
export var MarkTile = function (tile) {
    if (tile.status !== STATUS.HIDDEN && tile.status !== STATUS.MARKED) {
        return;
    }
    if (tile.status === STATUS.HIDDEN) {
        tile.status = STATUS.MARKED;
    }
    else {
        tile.status = STATUS.HIDDEN;
    }
};
function getMinePositions(boardSize, numberOfMines) {
    var positions = [];
    var _loop_1 = function () {
        var position = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        };
        if (!positions.some(function (p) { return positionMatch(p, position); })) {
            positions.push(position);
        }
    };
    while (positions.length < numberOfMines) {
        _loop_1();
    }
    return positions;
}
function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y;
}
