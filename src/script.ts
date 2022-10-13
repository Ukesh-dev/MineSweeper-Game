/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AppGrid,
  checkLose,
  checkWin,
  MarkTile,
  revealTile,
  Row,
} from "./ui.js";

let MarkedTiles = 0;
const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;
const boardElement: HTMLDivElement = document.querySelector(".board")!;

const board = AppGrid(BOARD_SIZE, NUMBER_OF_MINES);
const mineAmount = document.querySelector("[data-mine-count")!;
const subtext = document.querySelector(".subtext");

mineAmount.textContent = `${NUMBER_OF_MINES}`;

boardElement.style.setProperty("--size", `${BOARD_SIZE}`);

board.forEach((row) => {
  row.forEach((tile) => {
    if (boardElement) {
      boardElement.append(tile.element);
      tile.element.addEventListener("click", () => {
        revealTile(board, tile);
        checkWinLose(board);
      });

      tile.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (MarkedTiles < NUMBER_OF_MINES || tile.status === "marked") {
          MarkTile(tile);
          MarkedTiles = board.reduce((count: number, row) => {
            const markedTiles = row.filter((p) => p.status === "marked").length;
            return count + markedTiles;
          }, 0);
          mineAmount.textContent = `${NUMBER_OF_MINES - MarkedTiles}`;
        }
      });
    }
  });
});

const checkWinLose = (board: Row[][]) => {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener(
      "click",
      (e) => {
        e.stopImmediatePropagation();
      },
      { capture: true }
    );
    boardElement.addEventListener(
      "contextmenu",
      (e) => {
        e.stopImmediatePropagation();
      },
      { capture: true }
    );
  }
  if (win) {
    if (subtext) {
      subtext.textContent = "You lose";
    }
  }
  if (lose) {
    board.forEach((row) =>
      row.forEach((tile) => {
        if (tile.status === "marked") MarkTile(tile);
        if (tile.mine) {
          revealTile(board, tile);
        }
      })
    );
    if (subtext) {
      subtext.textContent = "You lose";
    }
  }
};
