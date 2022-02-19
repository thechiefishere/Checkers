export const initialState = {
  boardWidth: 0,
  allPiece: [],
  allBoxes: [],
  playersDetails: {
    player1: "HUMAN",
    player1Color: "WHITE",
    player2Color: "GREEN",
  },
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
      return {
        ...state,
        allPiece: [...state.allPiece, action.payload],
      };
    }
    case "ADD_BOX": {
      return {
        ...state,
        allBoxes: [...state.allBoxes, action.payload],
      };
    }
    case "UPDATE_PLAYERS_DETAILS": {
      return {
        ...state,
        playersDetails: { ...state.playersDetails, ...action.payload },
      };
    }
    default:
      return state;
  }
};
