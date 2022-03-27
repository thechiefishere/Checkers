import { io } from "socket.io-client";

let gameState = null;
const socket = io("http://localhost:8000");
socket.on("connect", () => {
  console.log("connected");
  // socket.on("gameState", (state) => {
  //   gameState = state;
  //   console.log(gameState);
  // });
});

// console.log("gameState", gameState);

// export const initialState = {
//   boardWidth: gameState.boardWidth,
//   allPiece: gameState.allPiece,
//   allBoxes: gameState.allBoxes,
//   playersDetails: gameState.playersDetails,
//   turn: gameState.turn,
//   clickedPiece: gameState.clickedPiece,
//   clickedBox: gameState.clickedBox,
//   allBoxPieceSet: gameState.allBoxPieceSet,
//   piecesThatMustKill: gameState.piecesThatMustKill,
//   isKillMove: gameState.isKillMove,
//   pieceThatMadeLastKill: gameState.pieceThatMadeLastKill,
//   pieceThatMovedLast: gameState.pieceThatMovedLast,
//   moveMade: gameState.moveMade,
// };

// export const initialState = {
//   boardWidth: 0,
//   allPiece: JSON.parse(localStorage.getItem("pieces")) || [],
//   allBoxes: JSON.parse(localStorage.getItem("boxes")) || [],
//   playersDetails: JSON.parse(localStorage.getItem("playerDetails")) || {
//     player1: "HUMAN",
//     player2: "CPU",
//     player1Color: "WHITE",
//     player2Color: "GREEN",
//   },
//   turn: localStorage.getItem("turn") || "WHITE",
//   clickedPiece: null,
//   clickedBox: null,
//   allBoxPieceSet: localStorage.getItem("allBoxPieceSet") || false,
//   piecesThatMustKill:
//     JSON.parse(localStorage.getItem("piecesThatMustKill")) || null,
//   isKillMove: localStorage.getItem("isKillMove") || false,
//   pieceThatMadeLastKill:
//     JSON.parse(localStorage.getItem("pieceThatMadeLastKill")) || null,
//   pieceThatMovedLast:
//     JSON.parse(localStorage.getItem("pieceThatMovedLast")) || null,
//   moveMade: false,
//   socket: socket,
// };

export const initialState = {
  lobby: {},
  playerColor: null,
  gameState: null,
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
