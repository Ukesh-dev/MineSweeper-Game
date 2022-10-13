enum STATUS {
  HIDDEN = "hidden",
  MARKED = "marked",
  MINE = "mine",
  NUMBER = "number",
}

export interface Row {
  x: number;
  element: HTMLDivElement;
  y: number;
  mine: boolean;
  getNewStat: () => void;
  status: string | undefined;
}

export function AppGrid(boardSize: number, numberOfMines: number) {
  const board: Row[][] = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);
  console.log(minePositions);
  Array.from({ length: boardSize }, (_r, x) => {
    const rowElement: Row[] = [];
    //   const rowElement: Row[] = [];
    Array.from({ length: boardSize }, (_c, y) => {
      const element = document.createElement("div");
      // * Not needed cause of getters and setters
      element.dataset.status = "hidden";
      const tile: {
        x: number;
        element: HTMLDivElement;
        y: number;
        mine: boolean;
        getNewStat: () => void;
        status: string | undefined;
      } = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        getNewStat() {
          return this.x + this.y;
        },
        // set newStatus(value: string) {
        //   [this.firstName, this.lastName] = value.split("");
        // },

        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      //   tile.newStatus = "hell";
      rowElement.push(tile);
    });
    board.push(rowElement);
  });
  return board;
  //   return board;
}

export const checkWin = (board: Row[][]) => {
  return board.every((row) =>
    row.every(
      (tiles) =>
        tiles.status === STATUS.NUMBER ||
        (tiles.mine &&
          (tiles.status === STATUS.HIDDEN || tiles.status === STATUS.MARKED))
    )
  );
};
export const checkLose = (board: Row[][]) => {
  return board.some((row) => {
    return row.some((t) => t.status === STATUS.MINE);
  });
};

export const revealTile = (board: Row[][], tile: Row) => {
  if (tile.status !== STATUS.HIDDEN) {
    return;
  }
  if (tile.mine) {
    tile.status = STATUS.MINE;
    return;
  }
  tile.status = STATUS.NUMBER;
  //   console.log(board);
  const adjacentTiles = nearbyTiles(board, tile);
  const mineCount = adjacentTiles.filter((p) => p.mine).length;
  if (mineCount > 0) {
    tile.element.textContent = `${mineCount}`;
  } else {
    adjacentTiles.forEach(revealTile.bind(null, board));
  }
};
const nearbyTiles = (board: Row[][], { x, y }: Row) => {
  const tiles = [];
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffest = -1; yOffest <= 1; yOffest++) {
      const tile = board[x + xOffset]?.[y + yOffest];
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
};

export const MarkTile = (
  tile: {
    x: number;
    element: HTMLDivElement;
    y: number;
    mine: boolean;
    getNewStat: () => void;
    status: string | undefined;
  }
  //   row: Row
) => {
  //   console.log(tile.x);
  if (tile.status !== STATUS.HIDDEN && tile.status !== STATUS.MARKED) {
    return;
  }
  if (tile.status === STATUS.HIDDEN) {
    tile.status = STATUS.MARKED;
  } else {
    tile.status = STATUS.HIDDEN;
  }
};

function getMinePositions(boardSize: number, numberOfMines: number) {
  const positions: Position[] = [];
  console.log(numberOfMines);

  while (positions.length < numberOfMines) {
    const position: Position = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
    // console.log(!positions.some((p) => positionMatch(p, position)));
    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }
  return positions;
}
type Position = {
  x: number;
  y: number;
};

function positionMatch(a: Position, b: Position) {
  return a.x === b.x && a.y === b.y;
}

const arrays = [1, 2];

if (!arrays.some((a) => a === a + 1)) {
  console.log(arrays.some((a) => a === a));
}
