const { pieceColors } = require("../constants");

const updatePiece = async (piece, gameState) => {
  gameState.allPiece[piece.pieceNumber] = piece;
};

const updateBox = async (box, gameState) => {
  gameState.allBoxes[box.boxNumber] = box;
};

const setPieceThatMovedLast = async (piece, gameState) => {
  gameState.pieceThatMovedLast = piece;
};

const setClickedPiece = async (piece, gameState) => {
  gameState.clickedPiece = piece;
};

const setMoveMade = async (isMove, gameState) => {
  gameState.moveMade = isMove;
};

const switchTurn = async (gameState) => {
  const nextTurn =
    gameState.turn === pieceColors[0] ? pieceColors[1] : pieceColors[0];
  gameState.turn = nextTurn;
};

const setPiecesThatMustKill = async (pieces, gameState) => {
  gameState.piecesThatMustKill = pieces;
};

const setIsKillMove = async (isKill, gameState) => {
  gameState.isKillMove = isKill;
};

const setPieceThatMadeLastKill = async (piece, gameState) => {
  gameState.pieceThatMadeLastKill = piece;
};

const isPieceInPiecesThatMustKill = (piece, piecesThatMustKill) => {
  if (!piecesThatMustKill || !piece) return false;
  const pieceIsIn = piecesThatMustKill.some(
    (aPiece) => aPiece.pieceNumber === piece.pieceNumber
  );
  if (pieceIsIn) return true;
  return false;
};

const isPieceInKingPosition = (piece) => {
  if (!piece) return false;
  const isWhitePieceAKing = piece.pieceNumber < 20 && piece.index > 89;
  const isGreenPieceAKing = piece.pieceNumber > 20 && piece.index < 10;
  if (isWhitePieceAKing || isGreenPieceAKing) return true;
  return false;
};

const generateRandomRoomId = () => {
  const possibleValues =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ12345abcdefghijklmnopqrstuvwxyz67890";
  let roomId = "";
  for (let i = 0; i < 7; i++) {
    const random = Math.random() * possibleValues.length;
    roomId += possibleValues.charAt(random);
  }
  console.log("roomId", roomId);
  return roomId;
};

const getPopulateString = () => {
  return "allPiece allBoxes clickedPiece clickedBox pieceThatMadeLastKill pieceThatMovedLast piecesThatMustKill";
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
  isPieceInPiecesThatMustKill,
  isPieceInKingPosition,
  generateRandomRoomId,
  getPopulateString,
};
