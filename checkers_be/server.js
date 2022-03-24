require("dotenv").config();
const io = require("socket.io")();
const mongoose = require("mongoose");
const connect = require("./db/connect_db");
const port = 8000;

// const { isRegularMove, isRegularKillMove } = require("./utils/moveFunctions");
const { setClickedPiece } = require("./utils/function");
const {
  handleRegularMove,
  handleRegularKillMove,
  handleKingMove,
  handleKingKillMove,
  createNewLobby,
  getLobbyWithRoomId,
  updateLobby,
} = require("./game");

const lobbies = [];

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("multiplayer_newgame", async (msg) => {
    console.log("You sent", msg);
    const lobby = await createNewLobby();
    socket.join(lobby.roomId);
    socket.to(lobby.roomId);
  });
  socket.on("join-game", (roomId) => {
    // const numOfParticipant = io.sockets.adapter.rooms[room];
    // console.log("numOfParticipant", numOfParticipant);
    // if (numOfParticipant && numOfParticipant >= 2) return;
    // socket.join(room);
    // io.emit("gameState", initialGameState);
    // console.log("room", room);
    const lobby = getLobbyWithRoomId(roomId);
    if (!lobby || lobby.participant >= 2) return;
    updateLobby(roomId);
    socket.join(lobby.roomId);
    socket.to(roomId);
  });
  // socket.emit("gameState", gameState);
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

const start = async () => {
  try {
    // await connect(process.env.MONGO_URI);
    await connect("mongodb://localhost:27017/CheckersDB");
    io.listen(8000, {
      cors: {
        origin: ["http://localhost:3000"],
      },
    });
  } catch (error) {
    console.log(error);
  }
};
start();
