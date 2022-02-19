export const setBoardWidth = (width) => {
  return {
    type: "SET_BOARD_WIDTH",
    payload: width,
  };
};

export const addPiece = (piece) => {
  return {
    type: "ADD_PIECE",
    payload: piece,
  };
};

export const addBox = (box) => {
  return {
    type: "ADD_BOX",
    payload: box,
  };
};

export const updatePlayersDetails = (detail) => {
  return {
    type: "UPDATE_PLAYERS_DETAILS",
    payload: detail,
  };
};
