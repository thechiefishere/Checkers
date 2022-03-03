import { isKingKill, isRegularKillMove } from "./moveFunctions";

export const getLeftDimension = (index) => {
  return index % 10;
};

export const getTopDimension = (index) => {
  return parseInt(index / 10);
};

export const getColorFromDimensions = (index) => {
  const leftDimension = getLeftDimension(index);
  const topDimension = getTopDimension(index);
  if (topDimension === leftDimension) return "RED";
  if (topDimension % 2 === 0 && leftDimension % 2 === 0) return "BLACK";
  else if (topDimension % 2 === 0 && leftDimension % 2 !== 0) return "YELLOW";
  else if (topDimension % 2 !== 0 && leftDimension % 2 === 0) return "YELLOW";
  else if (topDimension % 2 !== 0 && leftDimension % 2 !== 0) return "BLACK";
};

export const validateClick = (turn, playersDetails, pieceColor) => {
  if (!isHuman(turn, playersDetails)) return false;
  if (isPlayersPiece(turn, playersDetails, pieceColor)) return true;
  return false;
};

const isHuman = (turn, playersDetails) => {
  if (playersDetails.player1Color === turn) return true;
  if (playersDetails.player2 === "HUMAN") return true;
  return false;
};

const isPlayersPiece = (turn, playersDetails, pieceColor) => {
  if (
    playersDetails.player1Color === turn &&
    playersDetails.player1Color === pieceColor
  )
    return true;
  if (
    playersDetails.player2Color === turn &&
    playersDetails.player2Color === pieceColor
  )
    return true;
  return false;
};

export const getPieceByNumber = (pieceNumber, allPiece) => {
  const piece = allPiece.find((piece) => piece.pieceNumber === pieceNumber);
  return piece;
};

export const getBoxByNumber = (boxNumber, allBoxes) => {
  const box = allBoxes.find((box) => box.boxNumber === boxNumber);
  return box;
};

export const checkIfPiecesCanKill = (allBoxes, turn) => {
  for (let i = 0; i < allBoxes.length; i++) {
    const box = allBoxes[i];
    if (!box.isFilled) continue;
    if (box.piece.pieceColor !== turn) continue;
    for (let j = 0; j < allBoxes.length; j++) {
      const aBox = allBoxes[j];
      if (aBox.isFilled) continue;
      if (aBox.boxColor === "YELLOW") continue;
      if (box.piece.pieceType === "REGULAR") {
        const regularMove = isRegularKillMove(box, aBox, allBoxes);
        if (regularMove.valid) return true;
      } else {
        const kingMove = isKingKill(box, aBox, allBoxes);
        if (kingMove.valid) return true;
      }
    }
  }
  return false;
};

export const getBoxesWithPieceThatCanKill = (allBoxes, turn) => {
  let boxes = [];
  for (let i = 0; i < allBoxes.length; i++) {
    const box = allBoxes[i];
    if (!box.isFilled) continue;
    if (box.piece.pieceColor !== turn) continue;
    for (let j = 0; j < allBoxes.length; j++) {
      const aBox = allBoxes[j];
      if (aBox.isFilled) continue;
      if (box.piece.pieceType === "REGULAR") {
        const regularMove = isRegularKillMove(box, aBox, allBoxes);
        if (regularMove.valid) boxes.push(box);
      } else {
        const kingMove = isKingKill(box, aBox, allBoxes);
        if (kingMove.valid) {
          boxes.push(box);
          break;
        }
      }
    }
  }
  return boxes;
};

export const isPieceInPiecesThatMustKill = (piece, piecesThatMustKill) => {
  if (!piecesThatMustKill || !piece) return false;
  const pieceIsIn = piecesThatMustKill.some(
    (aPiece) => aPiece.pieceNumber === piece.pieceNumber
  );
  if (pieceIsIn) return true;
  return false;
};

export const isPieceInKingPosition = (piece) => {
  if (!piece) return false;
  const isWhitePieceAKing = piece.pieceNumber < 40 && piece.index > 89;
  const isGreenPieceAKing = piece.pieceNumber > 40 && piece.index < 10;
  if (isWhitePieceAKing || isGreenPieceAKing) return true;
  return false;
};
