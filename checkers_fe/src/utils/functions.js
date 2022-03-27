export const getBoardWidth = (windowWidth) => {
  if (windowWidth >= 600) return 500;
  let boardWidth = parseInt(windowWidth * 0.8);
  return Math.round(boardWidth / 100) * 100;
};

export const validateClick = (turn, playerColor, pieceColor) => {
  if (turn === playerColor && pieceColor === playerColor) return true;
  return false;
};

export const isPieceInPiecesThatMustKill = (piece, piecesThatMustKill) => {
  if (!piecesThatMustKill || !piece) return false;
  const pieceIsIn = piecesThatMustKill.some(
    (aPiece) => aPiece.pieceNumber === piece.pieceNumber
  );
  if (pieceIsIn) return true;
  return false;
};
