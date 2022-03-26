const { pieceColors, boxColors } = require("../constants");
const Box = require("../models/Box");
const GameState = require("../models/GameState");
const Piece = require("../models/Piece");

const updatePiece = async (piece) => {
  await Piece.findByIdAndUpdate(piece._id, getPieceUpdate(piece), {
    new: true,
  });
};

const getPieceUpdate = (piece) => {
  return {
    pieceColor: piece.pieceColor,
    pieceNumber: piece.pieceNumber,
    index: piece.index,
    isAlive: piece.isAlive,
    leftDimension: piece.leftDimension,
    topDimension: piece.topDimension,
    pieceDirection: piece.pieceDirection,
    pieceType: piece.pieceType,
  };
};

const updateBox = async (box) => {
  await Box.findByIdAndUpdate(box._id, getUPdatedBox(box), {
    new: true,
  });
};

const getUPdatedBox = (box) => {
  const update = {
    boxColor: box.boxColor,
    boxNumber: box.boxNumber,
    isFilled: box.isFilled,
    leftDimension: box.leftDimension,
    topDimension: box.topDimension,
    piece: box.piece,
  };
  // if (box.piece) update.piece = box.piece;
  return update;
};

const setPieceThatMovedLast = async (piece, gameState) => {
  // gameState.pieceThatMovedLast = piece;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { setPieceThatMovedLast: piece },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
};

const setClickedPiece = async (piece, gameState) => {
  // gameState.clickedPiece = piece;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { clickedPiece: piece },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
};

const setMoveMade = async (isMove, gameState) => {
  // gameState.moveMade = isMove;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { moveMade: isMove },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
};

const switchTurn = async (gameState) => {
  const nextTurn =
    gameState.turn === pieceColors[0] ? pieceColors[1] : pieceColors[0];
  // gameState.turn = nextTurn;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { turn: nextTurn },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
};

const setPiecesThatMustKill = async (pieces, gameState) => {
  // gameState.piecesThatMustKill = pieces;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { piecesThatMustKill: pieces },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
};

const setIsKillMove = async (isKill, gameState) => {
  // gameState.isKillMove = isKill;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { isKillMove: isKill },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
};

const setPieceThatMadeLastKill = async (piece, gameState) => {
  // gameState.pieceThatMadeLastKill = piece;
  gameState = await GameState.findByIdAndUpdate(
    gameState._id,
    { pieceThatMadeLastKill: piece },
    { new: true }
  ).populate(getPopulateString());
  return gameState;
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
