const io = require("socket.io")(8000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const { pieceColors } = require("./constants");
const { allBoxes, allPiece } = require("./utils/initializer");
// const { isRegularMove, isRegularKillMove } = require("./utils/moveFunctions");
const { setClickedPiece } = require("./utils/function");
const {
  handleRegularMove,
  handleRegularKillMove,
  handleKingMove,
  handleKingKillMove,
} = require("./game");

const lobbies = [];
let gameState = {
  allPiece: allPiece,
  allBoxes: allBoxes,
  turn: pieceColors[0],
  clickedPiece: null,
  clickedBox: null,
  piecesThatMustKill: null,
  isKillMove: false,
  pieceThatMadeLastKill: null,
  pieceThatMovedLast: null,
  moveMade: false,
};

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("multiplayer_newgame", (msg) => {
    console.log("You sent", msg);
    lobbies[socket.id] = { gameState, isPlaying: false };
    // lobbies.push(lobby);
    // socket.broadcast.to(socket.id);
    // io.emit("gameState", initialGameState);
  });
  socket.on("join-game", (room) => {
    const numOfParticipant = io.sockets.adapter.rooms[room];
    console.log("numOfParticipant", numOfParticipant);
    if (numOfParticipant && numOfParticipant >= 2) return;
    socket.join(room);
    // io.emit("gameState", initialGameState);
    // console.log("room", room);
  });
  socket.emit("gameState", gameState);
  socket.on("clicked-piece", (piece) => {
    setClickedPiece(piece, gameState);
    io.emit("gameState", gameState);
  });
  socket.on("handle-regular-move", (fromBox, box, direction) => {
    const moveTaken = { moveMade: false };
    handleRegularMove(fromBox, box, direction, gameState, io, moveTaken);
    if (moveTaken.moveMade) return;
    handleRegularKillMove(fromBox, box, gameState, io);
  });
  socket.on("handle-king-move", (fromBox, box) => {
    const moveTaken = { moveMade: false };
    handleKingMove(fromBox, box, gameState, io, moveTaken);
    if (moveTaken.moveMade) return;
    handleKingKillMove(fromBox, box, gameState, io);
  });
});

const getGameStateFromRoomNumber = (room) => {
  const gameState = lobbies[room].gameState;
  return gameState;
};
