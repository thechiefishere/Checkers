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

export const setClicked = (number) => {
  return {
    type: "SET_CLICKED",
    payload: number,
  };
};
