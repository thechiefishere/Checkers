import { isRegularMove } from "./moveFunctions";

export const computerMove = (allBoxes, turn) => {
  const copyOfAllBoxes = JSON.parse(JSON.stringify(allBoxes));
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const box = copyOfAllBoxes[i];
    const validBox = validateBox(box, turn);
    if (!validBox) continue;
    const validMoves = getPieceValidMoves(box, copyOfAllBoxes);
    if (validMoves.length === 0) continue;
    // console.log("...........validMoves", validMoves);
    validMoves.forEach((toBox) => {
      tryValidMove(box, toBox, copyOfAllBoxes);
    });
  }
};

const tryValidMove = (box, toBox, copyOfAllBoxes) => {
  const fakedBoxes = fakeTheMove(box, toBox, copyOfAllBoxes);
};

const fakeTheMove = (box, toBox, copyOfAllBoxes) => {
  const fakedBoxes = JSON.parse(JSON.stringify(copyOfAllBoxes));
  const pieceInBox = box.piece;
  fakedBoxes[toBox.boxNumber].isFilled = true;
  fakedBoxes[toBox.boxNumber].piece = pieceInBox;
  fakedBoxes[box.boxNumber].isFilled = false;
  fakedBoxes[box.boxNumber].piece = null;
  return fakedBoxes;
};

const validateBox = (box, turn) => {
  if (!box.isFilled) return false;
  if (box.piece.pieceColor !== turn) return false;
  return true;
};

const getPieceValidMoves = (box, copyOfAllBoxes) => {
  let validMoves = [];
  if (box.piece.pieceType === "REGULAR")
    validMoves = getRegularPieceValidMoves(box, copyOfAllBoxes);
  return validMoves;
};

const getRegularPieceValidMoves = (box, copyOfAllBoxes) => {
  const validMoves = [];
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const toBox = copyOfAllBoxes[i];
    const validMove = isRegularMove(box, toBox, box.piece.pieceDirection);
    if (validMove) validMoves.push(toBox);
  }
  return validMoves;
};
