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
  isPieceInKingPosition,
  isPieceInPiecesThatMustKill,
  generateRandomRoomId,
} = require("./utils/function");
const {
  isRegularMove,
  isRegularKillMove,
  isKingMove,
  isKingKillMove,
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
} = require("./utils/moveFunctions");

const Piece = require("./models/Piece");
const Box = require("./models/Box");
const GameState = require("./models/GameState");
const Lobby = require("./models/Lobby");

const { initialGameState } = require("./utils/initializer");

const createNewLobby = async () => {
  const aLobby = {
    gameState: await createGameState(initialGameState),
    roomId: generateRandomRoomId(),
    participant: 1,
    gameHasStarted: false,
  };
  const lobby = await Lobby.create(aLobby);
  return lobby;
};

const createPiece = async (piece) => {
  const aPiece = await Piece.create(piece);
  return aPiece._id;
};

const createBox = async (box) => {
  const aPiece = await Piece.findOne({ index: box.boxNumber });
  if (aPiece) box.piece = aPiece;
  box = await Box.create(box);
  return box._id;
};

const createGameState = async (initialGameState) => {
  const { allPiece, allBoxes } = initialGameState;
  let arrayOfAllPiece = allPiece.map(async (piece) => await createPiece(piece));
  let arrayOfBoxes = allBoxes.map(async (box) => await createBox(box));
  arrayOfAllPiece = await Promise.all(arrayOfAllPiece);
  arrayOfBoxes = await Promise.all(arrayOfBoxes);
  const state = {
    ...initialGameState,
    allPiece: arrayOfAllPiece,
    allBoxes: arrayOfBoxes,
  };
  const gameState = await GameState.create(state);
  return gameState._id;
};

const getLobbyWithRoomId = async (roomId) => {
  const lobby = await Lobby.find({ roomId });
  return lobby;
};

const updateLobby = async (roomId) => {
  const lobby = await Lobby.findOneAndUpdate(
    { roomId },
    { participant: 2, gameHasStarted: true },
    { new: true }
  );
  console.log("lobby", lobby);
  // return lobby;
};

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
    confirmKingship(gameState);
    switchTurn(gameState);
    setMoveMade(true, gameState);
    setPiecesThatMustKill(null, gameState);
    updatePiecesThatMustKill(gameState);
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
    setPiecesThatMustKill(null, gameState);
    confirmKingship(gameState);
    switchTurn(gameState);
    setIsKillMove(false, gameState);
    setPieceThatMadeLastKill(null, gameState);
    updatePiecesThatMustKill(gameState);
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
    confirmKingship(gameState);
    switchTurn(gameState);
    updatePiecesThatMustKill(gameState);
    setIsKillMove(false, gameState);
    setPieceThatMadeLastKill(null, gameState);
  }
};

const updatePiecesThatMustKill = (gameState) => {
  const { allBoxes, turn } = gameState;
  // if (
  //   playersDetails.player2Color === turn &&
  //   playersDetails.player2 !== "HUMAN"
  // )
  //   return;
  // console.log("entered turn effect");
  const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
  if (!pieceExist) return;
  const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
  const pieces = boxes.map((box) => box.piece);
  setPiecesThatMustKill(pieces, gameState);
};

const confirmKingship = (gameState) => {
  const { pieceThatMovedLast, piecesThatMustKill } = gameState;
  const isInKingPosition = isPieceInKingPosition(pieceThatMovedLast);
  if (!isInKingPosition) return;
  const pieceIsIn = isPieceInPiecesThatMustKill(
    pieceThatMovedLast,
    piecesThatMustKill
  );
  if (pieceIsIn) return;
  pieceThatMovedLast.pieceType = "KING";
  updatePiece(pieceThatMovedLast, gameState);
};

module.exports = {
  makeMove,
  handleRegularMove,
  handleRegularKillMove,
  handleKingMove,
  handleKingKillMove,
  createNewLobby,
  getLobbyWithRoomId,
  updateLobby,
};
