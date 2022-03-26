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
  getPopulateString,
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

const createGameState = async (initialGameState) => {
  const gameState = await GameState.create(initialGameState);
  return gameState._id;
};

const getLobbyWithRoomId = async (roomId) => {
  const lobby = await Lobby.findOne({ roomId });
  return lobby;
};

const getGameStateFromLobby = async (lobby) => {
  const gameState = await GameState.findById(lobby.gameState).populate(
    getPopulateString()
  );
  return gameState;
};

const updateLobby = async (roomId) => {
  const lobby = await Lobby.findOneAndUpdate(
    { roomId },
    { participant: 2, gameHasStarted: true },
    { new: true }
  );
  return lobby;
};

const updateGameState = async (gameStateId, gameState) => {
  let update = getStateUpdate(gameState);
  const updatedGameState = await GameState.findByIdAndUpdate(
    gameStateId,
    update,
    {
      new: true,
    }
  ).populate(getPopulateString());
  return updatedGameState;
};

const getStateUpdate = (gameState) => {
  return {
    allPiece: gameState.allPiece,
    allBoxes: gameState.allBoxes,
    turn: gameState.turn,
    clickedPiece: gameState.clickedPiece,
    clickedBox: gameState.clickedBox,
    piecesThatMustKill: gameState.piecesThatMustKill,
    isKillMove: gameState.isKillMove,
    pieceThatMadeLastKill: gameState.pieceThatMadeLastKill,
    pieceThatMovedLast: gameState.pieceThatMovedLast,
    moveMade: gameState.moveMade,
  };
};

const handleRegularMove = async (
  fromBox,
  box,
  direction,
  gameState,
  io,
  moveTaken,
  roomId,
  lobby
) => {
  const { piecesThatMustKill, clickedPiece } = gameState;
  if (piecesThatMustKill) return;
  const validRegularMove = isRegularMove(fromBox, box, direction);
  if (validRegularMove) {
    moveTaken.moveMade = true;
    makeMove(gameState, clickedPiece, fromBox, box);
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
  }
};

const handleRegularKillMove = async (
  fromBox,
  box,
  gameState,
  io,
  roomId,
  lobby
) => {
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
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
  }
};

const handleKingMove = async (
  fromBox,
  box,
  gameState,
  io,
  moveTaken,
  roomId,
  lobby
) => {
  const { piecesThatMustKill, allBoxes, clickedPiece } = gameState;
  if (piecesThatMustKill) return;
  const validKingMove = isKingMove(fromBox, box, allBoxes);
  if (validKingMove) {
    moveTaken.moveMade = true;
    makeMove(gameState, clickedPiece, fromBox, box);
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
  }
};

const handleKingKillMove = async (
  fromBox,
  box,
  gameState,
  io,
  roomId,
  lobby
) => {
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
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
  }
};

const makeMove = async (
  gameState,
  clickedPiece,
  fromBox,
  box,
  middleBox = null,
  moveType = "NORMAL"
) => {
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

const setMiddleBoxState = async (middleBox, gameState) => {
  const pieceInMiddleBox = middleBox.piece;
  pieceInMiddleBox.isAlive = false;
  middleBox.isFilled = false;
  middleBox.piece = null;
  updatePiece(pieceInMiddleBox, gameState);
  updateBox(middleBox, gameState);
};

const checkMultipleKills = async (gameState) => {
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

const updatePiecesThatMustKill = async (gameState) => {
  const { allBoxes, turn } = gameState;
  // console.log("turn in update", turn);
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

const confirmKingship = async (gameState) => {
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
  getGameStateFromLobby,
  updateGameState,
};
