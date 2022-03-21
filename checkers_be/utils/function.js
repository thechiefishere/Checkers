const { pieceColors, boxColors } = require("../constants");

const updatePiece = (piece, gameState) => {
  gameState.allPiece[piece.pieceNumber] = piece;
};

const updateBox = (box, gameState) => {
  gameState.allBoxes[box.boxNumber] = box;
};

const setPieceThatMovedLast = (piece, gameState) => {
  gameState.pieceThatMovesLast = piece;
};

const setClickedPiece = (piece, gameState) => {
  gameState.clickedPiece = piece;
};

const setMoveMade = (isMove, gameState) => {
  gameState.moveMade = isMove;
};

const switchTurn = (gameState) => {
  const nextTurn =
    gameState.turn === pieceColors[0] ? pieceColors[1] : pieceColors[0];
  gameState.turn = nextTurn;
};

const setPiecesThatMustKill = (pieces, gameState) => {
  gameState.piecesThatMustKill = pieces;
};

const setIsKillMove = (isKill, gameState) => {
  gameState.isKillMove = isKill;
};

const setPieceThatMadeLastKill = (piece, gameState) => {
  gameState.pieceThatMadeLastKill = piece;
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
};
