/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppGrid, checkLose, checkWin, MarkTile, revealTile, } from "./ui.js";
var MarkedTiles = 0;
var BOARD_SIZE = 10;
var NUMBER_OF_MINES = 10;
var boardElement = document.querySelector(".board");
var board = AppGrid(BOARD_SIZE, NUMBER_OF_MINES);
var mineAmount = document.querySelector("[data-mine-count");
var subtext = document.querySelector(".subtext");
mineAmount.textContent = "".concat(NUMBER_OF_MINES);
console.log(board);
boardElement.style.setProperty("--size", "".concat(BOARD_SIZE));
board.forEach(function (row) {
    row.forEach(function (tile) {
        if (boardElement) {
            boardElement.append(tile.element);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            tile.element.addEventListener("click", function () {
                revealTile(board, tile);
                checkWinLose(board);
            });
            tile.element.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                console.log(tile);
                // const markedTilesCount = row.filter((p) => p.status === "marked").length;
                // console.log(markedTilesCount);
                // if (markedTilesCount > NUMBER_OF_MINES) {
                //   return;
                // }
                if (MarkedTiles < NUMBER_OF_MINES || tile.status === "marked") {
                    MarkTile(tile);
                    MarkedTiles = board.reduce(function (count, row) {
                        var markedTiles = row.filter(function (p) { return p.status === "marked"; }).length;
                        return count + markedTiles;
                    }, 0);
                    mineAmount.textContent = "".concat(NUMBER_OF_MINES - MarkedTiles);
                }
            });
        }
    });
});
var checkWinLose = function (board) {
    var win = checkWin(board);
    var lose = checkLose(board);
    console.log(lose + "lose");
    if (win || lose) {
        boardElement.addEventListener("click", function (e) {
            e.stopImmediatePropagation();
        }, { capture: true });
        boardElement.addEventListener("contextmenu", function (e) {
            e.stopImmediatePropagation();
        }, { capture: true });
    }
    if (win) {
        if (subtext) {
            subtext.textContent = "You lose";
        }
    }
    if (lose) {
        board.forEach(function (row) {
            return row.forEach(function (tile) {
                if (tile.status === "marked")
                    MarkTile(tile);
                if (tile.mine) {
                    revealTile(board, tile);
                }
            });
        });
        if (subtext) {
            subtext.textContent = "You lose";
        }
    }
};
