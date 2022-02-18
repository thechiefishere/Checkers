export const initialState = {
  boardWidth: 0,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BOARD_WIDTH": {
      return {
        ...state,
        boardWidth: action.payload,
      };
    }
    default:
      return state;
  }
};
