export const initialState = {
  boardWidth: 0,
  allPiece: JSON.parse(localStorage.getItem("pieces")) || [],
  allBoxes: JSON.parse(localStorage.getItem("boxes")) || [],
  playersDetails: JSON.parse(localStorage.getItem("playerDetails")) || {
    player1: "HUMAN",
    player2: "CPU",
    player1Color: "WHITE",
    player2Color: "GREEN",
  },
  turn: localStorage.getItem("turn") || "WHITE",
  clickedPiece: null,
  clickedBox: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BOARD_WIDTH": {
      return {
        ...state,
        boardWidth: action.payload,
      };
    }
    case "ADD_PIECE": {
      if (state.allPiece.length === 40) return state;
      const pieces = [...state.allPiece, action.payload];
      localStorage.setItem("pieces", JSON.stringify(pieces));
      return {
        ...state,
        allPiece: pieces,
      };
    }
    case "ADD_BOX": {
      if (state.allBoxes.length === 100) return state;
      const boxes = [...state.allBoxes, action.payload];
      localStorage.setItem("boxes", JSON.stringify(boxes));
      return {
        ...state,
        allBoxes: boxes,
      };
    }
    case "UPDATE_PLAYERS_DETAILS": {
      const details = { ...state.playersDetails, ...action.payload };
      localStorage.setItem("playerDetails", JSON.stringify(details));
      return {
        ...state,
        playersDetails: details,
      };
    }
    case "SWITCH_TURN": {
      localStorage.setItem("turn", action.payload);
      return {
        ...state,
        turn: action.payload,
      };
    }
    case "SET_CLICKED_PIECE": {
      return {
        ...state,
        clickedPiece: action.payload,
      };
    }
    case "SET_CLICKED_BOX": {
      return {
        ...state,
        clickedBox: action.payload,
      };
    }
    case "UPDATE_PIECE_INDEX": {
      const updatedPieces = state.allPiece.map((piece) => {
        if (piece.pieceNumber === action.payload.pieceNumber)
          return action.payload;
        return piece;
      });
      localStorage.setItem("pieces", JSON.stringify(updatedPieces));
      return {
        ...state,
        allPiece: updatedPieces,
      };
    }
    case "UPDATE_BOX": {
      const updatedBoxes = state.allBoxes.map((box) => {
        if (box.boxNumber === action.payload.boxNumber) return action.payload;
        return box;
      });
      localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
      return {
        ...state,
        allBoxes: updatedBoxes,
      };
    }
    default:
      return state;
  }
};
