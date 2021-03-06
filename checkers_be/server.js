require("dotenv").config();
const connect = require("./db/connect_db");
const port = process.env.PORT || 8000;

const { setClickedPiece } = require("./utils/function");
const {
  handleRegularMove,
  handleRegularKillMove,
  handleKingMove,
  handleKingKillMove,
  createNewLobby,
  getLobbyWithRoomId,
  updateLobby,
  getGameStateFromLobby,
  updateGameState,
} = require("./game");
const { initialGameState } = require("./utils/initializer");

var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http, {
  pingInterval: 30000,
  pingTimeout: 60000,
});

app.get("/", (req, res) => {
  res.send("");
});

io.on("connection", (socket) => {
  socket.on("disconnected", () => {
    // console.log("DISCONNECTED");
    socket.emit("disconnect");
  });
  socket.on("multiplayer_newgame", async () => {
    const lobby = await createNewLobby("MULTIPLAYER");
    socket.join(lobby.roomId);
    const gameState = await getGameStateFromLobby(lobby);
    io.to(lobby.roomId).emit("lobby", lobby);
    io.to(lobby.roomId).emit("gameState", gameState);
  });
  socket.on("singleplayer_newgame", async () => {
    const lobby = await createNewLobby("SINGLEPLAYER");
    socket.join(lobby.roomId);
    const gameState = await getGameStateFromLobby(lobby);
    io.to(lobby.roomId).emit("lobby", lobby);
    io.to(lobby.roomId).emit("gameState", gameState);
  });
  socket.on("join-game", async (roomId) => {
    let lobby = await getLobbyWithRoomId(roomId);
    if (!lobby || lobby.participant > 2) return;
    lobby = await updateLobby(roomId);
    socket.join(roomId);
    const gameState = await getGameStateFromLobby(lobby);
    io.to(roomId).emit("lobby", lobby);
    io.to(roomId).emit("gameState", gameState);
  });
  socket.on("clicked-piece", async (piece, roomId) => {
    let lobby = await getLobbyWithRoomId(roomId);
    let gameState = await getGameStateFromLobby(lobby);
    setClickedPiece(piece, gameState);
    gameState = await updateGameState(lobby.gameState, gameState);
    io.to(roomId).emit("gameState", gameState);
  });
  socket.on("handle-regular-move", async (fromBox, box, direction, roomId) => {
    let lobby = await getLobbyWithRoomId(roomId);
    let gameState = await getGameStateFromLobby(lobby);
    const moveTaken = { moveMade: false };
    handleRegularMove(
      io,
      lobby,
      gameState,
      roomId,
      fromBox,
      box,
      direction,
      moveTaken
    );
    if (moveTaken.moveMade) return;
    handleRegularKillMove(io, lobby, gameState, roomId, fromBox, box);
  });
  socket.on("handle-king-move", async (fromBox, box, roomId) => {
    let lobby = await getLobbyWithRoomId(roomId);
    let gameState = await getGameStateFromLobby(lobby);
    const moveTaken = { moveMade: false };
    handleKingMove(io, lobby, gameState, roomId, fromBox, box, moveTaken);
    if (moveTaken.moveMade) return;
    handleKingKillMove(io, lobby, gameState, roomId, fromBox, box);
  });
  socket.on("restart", async (roomId) => {
    const lobby = await getLobbyWithRoomId(roomId);
    let gameState = await getGameStateFromLobby(lobby);
    let newGameState = initialGameState;
    gameState = await updateGameState(gameState._id, newGameState);
    io.to(roomId).emit("gameState", gameState);
  });
  socket.on("reload", async (roomId) => {
    const lobby = await getLobbyWithRoomId(roomId);
    if (!lobby) return;
    let gameState = await getGameStateFromLobby(lobby);
    socket.join(roomId);
    io.to(roomId).emit("gameState", gameState);
  });
});

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    // await connect("mongodb://localhost:27017/CheckersDB");
    io.listen(port, {
      cors: {
        origin: ["http://localhost:3000", "https://checkersgame.netlify.app"],
      },
    });
  } catch (error) {
    console.log(error);
  }
};
start();
