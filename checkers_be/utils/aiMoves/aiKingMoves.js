const {
  isKingMove,
  isKingKillMove,
  possibleKingMovesPositions,
  possibleKingKillPositions,
} = require("../moveFunctions");

const getKingPieceValidMoves = (box, copyOfAllBoxes) => {
  const validMoves = [];
  const possibleKingMoves = possibleKingMovesPositions(copyOfAllBoxes, box);
  for (let i = 0; i < possibleKingMoves.length; i++) {
    const toBox = possibleKingMoves[i];
    const validMove = isKingMove(box, toBox, copyOfAllBoxes);
    if (validMove) validMoves.push(toBox);
  }
  return validMoves;
};

const getKingPieceValidKills = (box, copyOfAllBoxes, turn) => {
  const validKills = [];
  const possibleKingKills = possibleKingKillPositions(copyOfAllBoxes, box);
  for (let i = 0; i < possibleKingKills.length; i++) {
    const toBox = possibleKingKills[i];
    const validKill = isKingKillMove(box, toBox, copyOfAllBoxes, turn, true);
    if (validKill.valid) validKills.push(toBox);
  }
  return validKills;
};

module.exports = { getKingPieceValidMoves, getKingPieceValidKills };
