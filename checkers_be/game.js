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
  getAllMiddleBoxes,
} = require("./utils/function");
const {
  isRegularMove,
  isRegularKillMove,
  isKingMove,
  isKingKillMove,
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
} = require("./utils/moveFunctions");
const { calculateMove } = require("./utils/aiMoves/aiRegularMoves");

const GameState = require("./models/GameState");
const Lobby = require("./models/Lobby");

const { initialGameState } = require("./utils/initializer");
const { pieceColors } = require("./constants");

const createNewLobby = async (gameType) => {
  const aLobby = {
    gameState: await createGameState(initialGameState),
    roomId: generateRandomRoomId(),
    participant: 1,
    gameHasStarted: gameType === "SINGLEPLAYER" ? true : false,
    gameType: gameType,
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
  const gameState = await GameState.findById(lobby.gameState);
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
  );
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
  io,
  lobby,
  gameState,
  roomId,
  fromBox,
  box,
  direction,
  moveTaken
) => {
  const { piecesThatMustKill, clickedPiece } = gameState;
  if (piecesThatMustKill) return;
  const validRegularMove = isRegularMove(fromBox, box, direction);
  if (validRegularMove) {
    moveTaken.moveMade = true;
    makeMove(lobby, gameState, clickedPiece, fromBox, box);
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
    await computerMove(io, lobby, gameState, roomId);
  }
};

const handleRegularKillMove = async (
  io,
  lobby,
  gameState,
  roomId,
  fromBox,
  box
) => {
  const { clickedPiece, allBoxes } = gameState;
  const validKillMove = isRegularKillMove(fromBox, box, allBoxes);
  if (validKillMove.valid) {
    makeMove(
      lobby,
      gameState,
      clickedPiece,
      fromBox,
      box,
      validKillMove.middleBox,
      "KILL"
    );
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
    await computerMove(io, lobby, gameState, roomId);
  }
};

const handleKingMove = async (
  io,
  lobby,
  gameState,
  roomId,
  fromBox,
  box,
  moveTaken
) => {
  const { piecesThatMustKill, allBoxes, clickedPiece } = gameState;
  if (piecesThatMustKill) return;
  const validKingMove = isKingMove(fromBox, box, allBoxes);
  if (validKingMove) {
    moveTaken.moveMade = true;
    makeMove(lobby, gameState, clickedPiece, fromBox, box);
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
    await computerMove(io, lobby, gameState, roomId);
  }
};

const handleKingKillMove = async (
  io,
  lobby,
  gameState,
  roomId,
  fromBox,
  box
) => {
  const { allBoxes, clickedPiece, turn } = gameState;
  const validKingKill = isKingKillMove(fromBox, box, allBoxes, turn, true);
  if (validKingKill.valid) {
    makeMove(
      lobby,
      gameState,
      clickedPiece,
      fromBox,
      box,
      validKingKill.middleBox,
      "KILL"
    );
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
    await computerMove(io, lobby, gameState, roomId);
  }
};

const makeMove = async (
  lobby,
  gameState,
  clickedPiece,
  fromBox,
  box,
  middleBox = null,
  moveType = "NORMAL"
) => {
  setNewStates(gameState, clickedPiece, fromBox, middleBox, box);
  moveDispatch(lobby, gameState, clickedPiece, fromBox, box, moveType);
};

const setNewStates = (gameState, clickedPiece, fromBox, middleBox, box) => {
  fromBox.isFilled = false;
  fromBox.piece = null;
  box.isFilled = true;
  box.piece = clickedPiece;
  clickedPiece.index = box.boxNumber;
  clickedPiece.topDimension = box.topDimension;
  clickedPiece.leftDimension = box.leftDimension;
  if (middleBox !== null) setMiddleBoxState(middleBox, gameState);
};

const moveDispatch = async (
  lobby,
  gameState,
  clickedPiece,
  fromBox,
  box,
  moveType
) => {
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
    updatePiecesThatMustKill(lobby, gameState);
  } else {
    setIsKillMove(true, gameState);
    setPieceThatMadeLastKill(clickedPiece, gameState);
    checkMultipleKills(lobby, gameState);
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

const checkMultipleKills = async (lobby, gameState) => {
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
    updatePiecesThatMustKill(lobby, gameState);
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
    updatePiecesThatMustKill(lobby, gameState);
    setIsKillMove(false, gameState);
    setPieceThatMadeLastKill(null, gameState);
  }
};

const updatePiecesThatMustKill = (lobby, gameState) => {
  const { allBoxes, turn } = gameState;
  const { gameType } = lobby;
  if (gameType === "SINGLEPLAYER" && turn === pieceColors[1]) return;
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

const computerMove = async (io, lobby, gameState, roomId) => {
  const { turn, allBoxes } = gameState;
  const { gameType } = lobby;
  if (gameType !== "SINGLEPLAYER") return;
  if (turn !== pieceColors[1]) return;
  const aiBestMove = calculateMove(allBoxes, turn);
  console.log("aiBestMove", aiBestMove);
  if (aiBestMove.moveType === "REGULAR MOVE")
    await makeAIRegularMove(
      io,
      lobby,
      gameState,
      roomId,
      aiBestMove.trend[0].box,
      aiBestMove.trend[0].toBox
    );
  if (aiBestMove.moveType === "REGULAR KILL")
    makeAIRegularKill(io, lobby, gameState, roomId, aiBestMove);
};

const makeAIRegularMove = async (io, lobby, gameState, roomId, box, toBox) => {
  const pieceInBox = box.piece;
  pieceInBox.index = toBox.boxNumber;
  pieceInBox.leftDimension = toBox.leftDimension;
  pieceInBox.topDimension = toBox.topDimension;
  box.isFilled = false;
  box.piece = null;
  toBox.isFilled = true;
  toBox.piece = pieceInBox;
  updatePiece(pieceInBox, gameState);
  updateBox(box, gameState);
  updateBox(toBox, gameState);
  setPieceThatMovedLast(pieceInBox, gameState);
  setMoveMade(true, gameState);
  switchTurn(gameState);
  updatePiecesThatMustKill(lobby, gameState);
  gameState = await updateGameState(lobby.gameState, gameState);
  io.to(roomId).emit("gameState", gameState);
};

const makeAIRegularKill = async (io, lobby, gameState, roomId, aiBestMove) => {
  const { allBoxes } = gameState;
  const box = aiBestMove.trend[0].box;
  const toBox = aiBestMove.trend[aiBestMove.trend.length - 1].toBox;
  const middleBoxes = getAllMiddleBoxes(aiBestMove.trend, allBoxes);
  updateAllMiddleBoxes(middleBoxes, gameState);
  await makeAIRegularMove(io, lobby, gameState, roomId, box, toBox);
};

const updateAllMiddleBoxes = (middleBoxes, gameState) => {
  middleBoxes.map((box) => {
    const pieceInBox = box.piece;
    pieceInBox.isAlive = false;
    box.isFilled = false;
    box.piece = null;
    updatePiece(pieceInBox, gameState);
    updateBox(box, gameState);
  });
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
