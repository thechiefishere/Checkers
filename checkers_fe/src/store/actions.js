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

export const setTurn = (turn) => {
  return {
    type: "SET_TURN",
    payload: turn,
  };
};

export const switchTurn = () => {
  return {
    type: "SWITCH_TURN",
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

export const updatePiece = (clickedPiece) => {
  return {
    type: "UPDATE_PIECE",
    payload: clickedPiece,
  };
};

export const updateBox = (box) => {
  return {
    type: "UPDATE_BOX",
    payload: box,
  };
};

export const setAllBoxPiece = (pieceSet) => {
  return {
    type: "SET_ALL_BOX_PIECE",
    payload: pieceSet,
  };
};

export const setPiecesThatMustKill = (piecesThatMustKill) => {
  return {
    type: "SET_PIECES_THAT_MUST_KILL",
    payload: piecesThatMustKill,
  };
};

export const setIsKillMove = (isKillMove) => {
  return {
    type: "SET_IS_KILL_MOVE",
    payload: isKillMove,
  };
};

export const setPieceThatMadeLastKill = (pieceThatMadeLastKill) => {
  return {
    type: "SET_PIECE_THAT_MADE_LAST_KILL",
    payload: pieceThatMadeLastKill,
  };
};
