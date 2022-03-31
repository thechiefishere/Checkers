import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  reconnection: false,
});
socket.on("connect", () => {
  // console.log("connected");
});
window.onload = function () {
  const gameState = localStorage.getItem("gameState");
  if (!gameState || gameState.gameOver) return;
  const lobby = JSON.parse(localStorage.getItem("lobby"));
  const roomId = lobby.roomId;
  socket.emit("reload", roomId);
};

export const initialState = {
  lobby: JSON.parse(localStorage.getItem("lobby")) || {},
  playerColor: localStorage.getItem("playerColor") || null,
  gameState: JSON.parse(localStorage.getItem("gameState")) || null,
  socket: socket,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_GAMESTATE": {
      return {
        ...state,
        gameState: action.payload,
      };
    }
    case "SET_PLAYER_COLOR": {
      return {
        ...state,
        playerColor: action.payload,
      };
    }
    case "SET_SOCKET": {
      return {
        ...state,
        socket: action.payload,
      };
    }
    case "SET_LOBBY": {
      return {
        ...state,
        lobby: action.payload,
      };
    }
    default:
      return state;
  }
};
