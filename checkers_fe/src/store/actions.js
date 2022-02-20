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

export const switchTurn = (turn) => {
  return {
    type: "SWITCH_TURN",
    payload: turn,
  };
};

export const setClickedPiece = (pieceNumber) => {
  return {
    type: "SET_CLICKED_PIECE",
    payload: pieceNumber,
  };
};

export const setClickedBox = (boxNumber) => {
  return {
    type: "SET_CLICKED_BOX",
    payload: boxNumber,
  };
};

export const updatePieceIndex = (clickedPiece) => {
  return {
    type: "UPDATE_PIECE_INDEX",
    payload: clickedPiece,
  };
};

export const updateBox = (box) => {
  return {
    type: "UPDATE_PIECE_INDEX",
    payload: box,
  };
};
