const {
  updatePiece,
  updateBox,
  setClickedPiece,
  setPieceThatMovedLast,
  setMoveMade,
  switchTurn,
  setPiecesThatMustKill,
  setIsKillMove,
  setPieceThatMadeLastKill,
} = require("./utils/function");
const {
  isRegularMove,
  isRegularKillMove,
  isKingMove,
  isKingKillMove,
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
} = require("./utils/moveFunctions");

const handleRegularMove = (
  fromBox,
  box,
  direction,
  gameState,
  io,
  moveTaken
) => {
  const { piecesThatMustKill, clickedPiece } = gameState;
  if (piecesThatMustKill) return;
  const validRegularMove = isRegularMove(fromBox, box, direction);
  if (validRegularMove) {
    moveTaken.moveMade = true;
    makeMove(gameState, clickedPiece, fromBox, box);
    io.emit("gameState", gameState);
  }
};

const handleRegularKillMove = (fromBox, box, gameState, io) => {
  const { clickedPiece, allBoxes } = gameState;
  const validKillMove = isRegularKillMove(fromBox, box, allBoxes);
  if (validKillMove.valid) {
    makeMove(
      gameState,
      clickedPiece,
      fromBox,
      box,
      validKillMove.middleBox,
      "KILL"
    );
    io.emit("gameState", gameState);
  }
};

const handleKingMove = (fromBox, box, gameState, io, moveTaken) => {
  const { piecesThatMustKill, allBoxes, clickedPiece } = gameState;
  if (piecesThatMustKill) return;
  const validKingMove = isKingMove(fromBox, box, allBoxes);
  if (validKingMove) {
    moveTaken.moveMade = true;
    makeMove(gameState, clickedPiece, fromBox, box);
    io.emit("gameState", gameState);
  }
};

const handleKingKillMove = (fromBox, box, gameState, io) => {
  const { allBoxes, clickedPiece, turn } = gameState;
  const validKingKill = isKingKillMove(fromBox, box, allBoxes, turn, true);
  if (validKingKill.valid) {
    makeMove(
      gameState,
      clickedPiece,
      fromBox,
      box,
      validKingKill.middleBox,
      "KILL"
    );
    io.emit("gameState", gameState);
  }
};

const makeMove = (
  gameState,
  clickedPiece,
  fromBox,
  box,
  middleBox = null,
  moveType = "NORMAL"
) => {
  //   moveTaken = true;

  setNewStates(clickedPiece, fromBox, middleBox, box, gameState);
  moveDispatch(clickedPiece, fromBox, box, moveType, gameState);
};

const setNewStates = (clickedPiece, fromBox, middleBox, box, gameState) => {
  fromBox.isFilled = false;
  fromBox.piece = null;
  box.isFilled = true;
  box.piece = clickedPiece;
  clickedPiece.index = box.boxNumber;
  clickedPiece.topDimension = box.topDimension;
  clickedPiece.leftDimension = box.leftDimension;
  if (middleBox !== null) setMiddleBoxState(middleBox, gameState);
};

const moveDispatch = (clickedPiece, fromBox, box, moveType, gameState) => {
  updatePiece(clickedPiece, gameState);
  setPieceThatMovedLast(clickedPiece, gameState);
  updateBox(fromBox, gameState);
  updateBox(box, gameState);
  setClickedPiece(null, gameState);
  if (moveType === "NORMAL") {
    switchTurn(gameState);
    setMoveMade(true, gameState);
    setPiecesThatMustKill(null, gameState);
  } else {
    setIsKillMove(true, gameState);
    setPieceThatMadeLastKill(clickedPiece, gameState);
    checkMultipleKills(gameState);
  }
};

const setMiddleBoxState = (middleBox, gameState) => {
  const pieceInMiddleBox = middleBox.piece;
  pieceInMiddleBox.isAlive = false;
  middleBox.isFilled = false;
  middleBox.piece = null;
  updatePiece(pieceInMiddleBox, gameState);
  updateBox(middleBox, gameState);
};

const checkMultipleKills = (gameState) => {
  const { isKillMove, pieceThatMadeLastKill, allBoxes, turn } = gameState;
  if (!isKillMove || !pieceThatMadeLastKill) return;
  setMoveMade(true, gameState);
  const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
  if (!pieceExist) {
    switchTurn(gameState);
    setIsKillMove(false, gameState);
    setPieceThatMadeLastKill(null, gameState);
    setPiecesThatMustKill(null, gameState);
    return;
  }
  const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
  const pieces = boxes.map((box) => box.piece);
  const pieceIsIn = pieces.some(
    (piece) => piece.pieceNumber === pieceThatMadeLastKill.pieceNumber
  );
  if (pieceIsIn) {
    setPiecesThatMustKill([pieceThatMadeLastKill], gameState);
    setIsKillMove(false, gameState);
    setPieceThatMadeLastKill(null, gameState);
  } else {
    switchTurn(gameState);
    setIsKillMove(false, gameState);
    setPieceThatMadeLastKill(null, gameState);
  }
};

module.exports = {
  makeMove,
  handleRegularMove,
  handleRegularKillMove,
  handleKingMove,
  handleKingKillMove,
};
