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
    gameState = await makeMove(gameState, clickedPiece, fromBox, box);
    // gameState = await updateGameState(lobby.gameState, gameState);
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
    gameState = await makeMove(
      gameState,
      clickedPiece,
      fromBox,
      box,
      validKillMove.middleBox,
      "KILL"
    );
    // console.log("gameState", gameState);
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
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

const makeMove = async (
  gameState,
  clickedPiece,
  fromBox,
  box,
  middleBox = null,
  moveType = "NORMAL"
) => {
  setNewStates(clickedPiece, fromBox, middleBox, box, gameState);
  gameState = await moveDispatch(
    clickedPiece,
    fromBox,
    box,
    moveType,
    gameState
  );
  // console.log("clickedPiece in makeMove", gameState.clickedPiece);
  return gameState;
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

const moveDispatch = async (
  clickedPiece,
  fromBox,
  box,
  moveType,
  gameState
) => {
  await updatePiece(clickedPiece);
  gameState = await setPieceThatMovedLast(clickedPiece, gameState);
  await updateBox(fromBox);
  await updateBox(box);
  gameState = await setClickedPiece(null, gameState);
  if (moveType === "NORMAL") {
    confirmKingship(gameState);
    gameState = await switchTurn(gameState);
    // console.log("turn", gameState.turn);
    gameState = await setMoveMade(true, gameState);
    gameState = await setPiecesThatMustKill(null, gameState);
    updatePiecesThatMustKill(gameState);
  } else {
    gameState = await setIsKillMove(true, gameState);
    gameState = await setPieceThatMadeLastKill(clickedPiece, gameState);
    checkMultipleKills(gameState);
  }
  // console.log("pieceThatMovedLast", gameState.pieceThatMovedLast);
  return gameState;
};

const setMiddleBoxState = async (middleBox, gameState) => {
  const pieceInMiddleBox = middleBox.piece;
  pieceInMiddleBox.isAlive = false;
  middleBox.isFilled = false;
  middleBox.piece = null;
  await updatePiece(pieceInMiddleBox);
  await updateBox(middleBox);
};

const checkMultipleKills = async (gameState) => {
  const { isKillMove, pieceThatMadeLastKill, allBoxes, turn } = gameState;
  if (!isKillMove || !pieceThatMadeLastKill) return;
  gameState = await setMoveMade(true, gameState);
  const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
  if (!pieceExist) {
    gameState = await setPiecesThatMustKill(null, gameState);
    confirmKingship(gameState);
    gameState = await switchTurn(gameState);
    gameState = await setIsKillMove(false, gameState);
    gameState = await setPieceThatMadeLastKill(null, gameState);
    updatePiecesThatMustKill(gameState);
    return;
  }
  const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
  const pieces = boxes.map((box) => box.piece);
  const pieceIsIn = pieces.some(
    (piece) => piece.pieceNumber === pieceThatMadeLastKill.pieceNumber
  );
  if (pieceIsIn) {
    gameState = await setPiecesThatMustKill([pieceThatMadeLastKill], gameState);
    gameState = await setIsKillMove(false, gameState);
    gameState = await setPieceThatMadeLastKill(null, gameState);
  } else {
    confirmKingship(gameState);
    gameState = await switchTurn(gameState);
    updatePiecesThatMustKill(gameState);
    gameState = await setIsKillMove(false, gameState);
    gameState = await setPieceThatMadeLastKill(null, gameState);
  }
};

const updatePiecesThatMustKill = async (gameState) => {
  const { allBoxes, turn } = gameState;
  console.log("turn in update", turn);
  // if (
  //   playersDetails.player2Color === turn &&
  //   playersDetails.player2 !== "HUMAN"
  // )
  //   return;
  // console.log("entered turn effect");
  const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
  console.log("pieceExist", pieceExist);
  if (!pieceExist) return;
  const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
  const pieces = boxes.map((box) => box.piece);
  gameState = await setPiecesThatMustKill(pieces, gameState);
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
  await updatePiece(pieceThatMovedLast);
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
