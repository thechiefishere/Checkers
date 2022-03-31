export const setGameState = (gameState) => {
  return {
    type: "SET_GAMESTATE",
    payload: gameState,
  };
};

export const setPlayerColor = (color) => {
  return {
    type: "SET_PLAYER_COLOR",
    payload: color,
  };
};

export const setLobby = (lobby) => {
  return {
    type: "SET_LOBBY",
    payload: lobby,
  };
};

export const setSocket = (socket) => {
  return {
    type: "SET_SOCKET",
    payload: socket,
  };
};
