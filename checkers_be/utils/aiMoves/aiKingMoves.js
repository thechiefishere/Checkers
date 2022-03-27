const { isKingMove, isKingKillMove } = require("../moveFunctions");

const getKingPieceValidMoves = (box, copyOfAllBoxes) => {
  const validMoves = [];
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const toBox = copyOfAllBoxes[i];
    const validMove = isKingMove(box, toBox, copyOfAllBoxes);
    if (validMove) validMoves.push(toBox);
  }
  //   console.log("box", box);
  //   console.log("validMoves", validMoves);
  return validMoves;
};

const getKingPieceValidKills = (box, copyOfAllBoxes, turn) => {
  const validKills = [];
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const toBox = copyOfAllBoxes[i];
    const validKill = isKingKillMove(box, toBox, copyOfAllBoxes, turn, true);
    if (validKill.valid) validKills.push(toBox);
  }
  return validKills;
};

module.exports = { getKingPieceValidMoves, getKingPieceValidKills };
