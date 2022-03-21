const { boxColors, pieceColors, pieceTypes } = require("../constants");

const getAllPieces = () => {
  const allPiece = [];
  let x = 0;
  let y = 0;
  let pieceNumber = 0;
  for (let i = 0; i < 100; i++) {
    if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)) {
      if (i < 40 || i > 59) {
        let piece = makePiece(i, x, y, pieceNumber);
        allPiece[pieceNumber] = piece;
        pieceNumber++;
      }
    }
    if (x === 9) {
      x = -1;
      y++;
    }
    x++;
  }
  //   console.log("allPiece", allPiece);
  return allPiece;
};

const makePiece = (index, xPosition, yPosition, pieceNumber) => {
  return {
    leftDimension: xPosition,
    topDimension: yPosition,
    pieceColor: index < 40 ? pieceColors[0] : pieceColors[1],
    pieceNumber,
    index: index,
    isAlive: true,
    pieceType: pieceTypes[0],
    pieceDirection: index < 40 ? "DOWN" : "UP",
  };
};

const getAllBoxes = () => {
  const allBoxes = [];
  let x = 0;
  let y = 0;
  for (let i = 0; i < 100; i++) {
    const box = makeBox(i, x, y);
    if (getBoxColor(x, y, i) !== boxColors[2]) box.piece = getBoxPiece(i);
    allBoxes[i] = box;
    if (x === 9) {
      x = -1;
      y++;
    }
    x++;
  }
  //   console.log("allBoxes", allBoxes);
  return allBoxes;
};

const makeBox = (index, xPosition, yPosition) => {
  return {
    leftDimension: xPosition,
    topDimension: yPosition,
    boxNumber: index,
    boxColor: getBoxColor(xPosition, yPosition, index),
    isFilled:
      (index < 40 || index > 59) &&
      getBoxColor(xPosition, yPosition, index) !== boxColors[2]
        ? true
        : false,
  };
};

const getBoxColor = (x, y, i) => {
  if (i % 11 === 0 || i === 0) return boxColors[0];
  else if (x % 2 === 0 && y % 2 === 0) return boxColors[1];
  else if (x % 2 !== 0 && y % 2 !== 0) return boxColors[1];
  else return boxColors[2];
};

const getBoxPiece = (index) => {
  const piece = allPiece.find((piece) => piece.index === index);
  return piece || null;
};

let allPiece = getAllPieces();
let allBoxes = getAllBoxes();

module.exports = { allPiece, allBoxes };
