const { pieceColors, boxColors } = require("../constants");
const { isRegularKillMove } = require("./moveFunctions");

const updatePiece = (piece, gameState) => {
  // console.log("gameState", gameState);
  // gameState = gameState.allPiece.map((aPiece) => {
  //   if (piece.pieceNumber === aPiece.pieceNumber) return piece;
  //   return aPiece;
  // });
  // return newGameState;
  gameState.allPiece[piece.pieceNumber] = piece;
};

const updateBox = (box, gameState) => {
  //   const newGameState = gameState.allBoxes((aBox) => {
  //     if (box.boxNumber === aBox.boxNumber) return box;
  //     return aBox;
  //   });
  //   return newGameState;
  gameState.allBoxes[box.boxNumber] = box;
};

const setPieceThatMovedLast = (piece, gameState) => {
  //   return {
  //     ...gameState,
  //     pieceThatMovedLast: piece,
  //   };
  gameState.pieceThatMovesLast = piece;
};

const setClickedPiece = (piece, gameState) => {
  //   return {
  //     ...gameState,
  //     clickedPiece: piece,
  //   };
  gameState.clickedPiece = piece;
};

const setMoveMade = (isMove, gameState) => {
  //   return {
  //     ...gameState,
  //     moveMade: isMove,
  //   };
  gameState.moveMade = isMove;
};

const switchTurn = (gameState) => {
  //   return {
  //     ...gameState,
  //     turn: gameState.turn === pieceColors[0] ? pieceColors[1] : pieceColors[0],
  //   };
  const nextTurn =
    gameState.turn === pieceColors[0] ? pieceColors[1] : pieceColors[0];
  gameState.turn = nextTurn;
};

const setPiecesThatMustKill = (pieces, gameState) => {
  //   return {
  //     ...gameState,
  //     piecesThatMustKill: pieces,
  //   };
  gameState.piecesThatMustKill = pieces;
};

const setIsKillMove = (isKill, gameState) => {
  //   return {
  //     ...gameState,
  //     isKillMove: isKill,
  //   };
  gameState.isKillMove = isKill;
};

const setPieceThatMadeLastKill = (piece, gameState) => {
  //   return {
  //     ...gameState,
  //     pieceThatMadeLastKill: piece,
  //   };
  gameState.pieceThatMadeLastKill = piece;
};

const checkIfPiecesCanKill = (allBoxes, turn, checkSlant = false) => {
  for (let i = 0; i < allBoxes.length; i++) {
    const box = allBoxes[i];
    // if (box.boxNumber === 35) console.log("got here 1");
    if (!box.isFilled) continue;
    if (box.piece.pieceColor !== turn) continue;
    // if (box.boxNumber === 35) console.log("got here 2");
    for (let j = 0; j < allBoxes.length; j++) {
      const aBox = allBoxes[j];
      if (aBox.isFilled) continue;
      if (aBox.boxColor === boxColors[2]) continue;
      if (box.piece.pieceType === "REGULAR") {
        const regularMove = isRegularKillMove(box, aBox, allBoxes);
        if (regularMove.valid) return true;
      } else {
        // const kingMove = isKingKill(box, aBox, allBoxes, turn, checkSlant);
        // if (kingMove.valid) return true;
      }
    }
  }
  return false;
};

const getBoxesWithPieceThatCanKill = (allBoxes, turn) => {
  let boxes = [];
  for (let i = 0; i < allBoxes.length; i++) {
    const box = allBoxes[i];
    if (!box.isFilled) continue;
    if (box.piece.pieceColor !== turn) continue;
    for (let j = 0; j < allBoxes.length; j++) {
      const aBox = allBoxes[j];
      if (aBox.isFilled) continue;
      if (box.piece.pieceType === "REGULAR") {
        const regularMove = isRegularKillMove(box, aBox, allBoxes);
        if (regularMove.valid) boxes.push(box);
      } else {
        // const kingMove = isKingKill(box, aBox, allBoxes);
        // if (kingMove.valid) {
        //   boxes.push(box);
        //   break;
        // }
      }
    }
  }
  return boxes;
};

module.exports = {
  updatePiece,
  updateBox,
  setClickedPiece,
  setPieceThatMovedLast,
  setMoveMade,
  switchTurn,
  setPiecesThatMustKill,
  setIsKillMove,
  setPieceThatMadeLastKill,
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
};
