export const initialState = {
  boardWidth: 0,
  allPiece: JSON.parse(localStorage.getItem("pieces")) || [],
  allBoxes: JSON.parse(localStorage.getItem("boxes")) || [],
  playersDetails: JSON.parse(localStorage.getItem("playerDetails")) || {
    player1: "HUMAN",
    player2: "HUMAN",
    player1Color: "WHITE",
    player2Color: "GREEN",
  },
  turn: localStorage.getItem("turn") || "WHITE",
  clickedPiece: null,
  clickedBox: null,
  allBoxPieceSet: localStorage.getItem("allBoxPieceSet") || false,
  piecesThatMustKill:
    JSON.parse(localStorage.getItem("piecesThatMustKill")) || null,
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
    case "SET_TURN": {
      localStorage.setItem("turn", action.payload);
      return {
        ...state,
        turn: action.payload,
      };
    }
    case "SWITCH_TURN": {
      const presentTurn = localStorage.getItem("turn") || state.turn;
      const nextTurn = presentTurn === "WHITE" ? "GREEN" : "WHITE";
      localStorage.setItem("turn", nextTurn);
      return {
        ...state,
        turn: nextTurn,
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
    case "UPDATE_PIECE": {
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
    case "SET_ALL_BOX_PIECE": {
      localStorage.setItem("allBoxPieceSet", action.payload);
      return {
        ...state,
        allBoxPieceSet: action.payload,
      };
    }
    case "SET_PIECES_THAT_MUST_KILL": {
      localStorage.setItem(
        "piecesThatMustKill",
        JSON.stringify(action.payload)
      );
      return {
        ...state,
        piecesThatMustKill: action.payload,
      };
    }
    default:
      return state;
  }
};
