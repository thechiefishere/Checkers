const {
  checkIfPiecesCanKill,
  getAIMiddleBox,
  isRegularKillMove,
  isRegularMove,
  pieceIsClosingRanks,
  possibleRegularMovesPositions,
  possibleRegularKillPositions,
} = require("../moveFunctions");
const { getNextTurn } = require("../function");
const {
  getKingPieceValidMoves,
  getKingPieceValidKills,
} = require("./aiKingMoves");
const { pieceColors, pieceTypes } = require("../../constants");

let aiMoveRating = {};
let ratingsForAiFirstMoves = [];
let ratingsForSecondAIMoves = [];
let ratingsForThirdAIMoves = [];
let ratingsForPlayerFirstCounter = [];
let ratingsForPlayerSecondCounter = [];
let killTrend = [];
let allAiKillTrends = [];
let validMovesCount = 0;
let pieceCounts;

const calculateMove = (
  allBoxes,
  turn,
  callNumber = 1,
  fromBox = -1,
  multiKill = false
) => {
  const copyOfAllBoxes = JSON.parse(JSON.stringify(allBoxes));
  const piecesThatCanKill = checkIfPiecesCanKill(copyOfAllBoxes, turn);
  if (piecesThatCanKill) {
    const bestMove = whenKillIsPossible(
      copyOfAllBoxes,
      turn,
      callNumber,
      fromBox,
      multiKill
    );
    return bestMove;
  } else {
    const bestMove = noPossibleKill(copyOfAllBoxes, turn, callNumber);
    return bestMove;
  }
};

const whenKillIsPossible = (
  copyOfAllBoxes,
  turn,
  callNumber,
  fromBox,
  multiKill
) => {
  const piecesThatCanKill = checkIfPiecesCanKill(copyOfAllBoxes, turn);
  for (let i = 0; i < piecesThatCanKill.length; i++) {
    if (callNumber === 1 && i === 0) {
      pieceCounts = countPieces(copyOfAllBoxes, pieceColors[0]);
      ratingsForAiFirstMoves = [];
    }
    const box = piecesThatCanKill[i];
    if (multiKill && fromBox !== box.boxNumber) continue;
    const validKills = getPieceValidKills(box, copyOfAllBoxes, turn);
    validMovesCount += validKills.length;
    validKills.forEach((toBox) => {
      validMovesCount--;
      tryValidKill(box, toBox, copyOfAllBoxes, turn, callNumber);
      if (validMovesCount === 0) allAiKillTrends = [];
    });
    if (callNumber === 1 && i === piecesThatCanKill.length - 1) {
      return getBestMove(ratingsForAiFirstMoves, copyOfAllBoxes);
    }
  }
};

const noPossibleKill = (copyOfAllBoxes, turn, callNumber) => {
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const box = copyOfAllBoxes[i];
    if (callNumber === 1 && box.boxNumber === 0) {
      pieceCounts = countPieces(copyOfAllBoxes, "WHITE");
      ratingsForAiFirstMoves = [];
    }
    const passedChecks = initialChecksPass(copyOfAllBoxes, box, turn);
    if (!passedChecks) {
      if (callNumber === 1 && box.boxNumber === 99)
        return getBestMove(ratingsForAiFirstMoves, copyOfAllBoxes);
      continue;
    }
    const validMoves = getPieceValidMoves(box, copyOfAllBoxes);
    validMoves.forEach((toBox) => {
      tryValidMove(box, toBox, copyOfAllBoxes, turn, callNumber);
    });
    if (callNumber === 1 && box.boxNumber === 99)
      return getBestMove(ratingsForAiFirstMoves, copyOfAllBoxes);
  }
};

const initialChecksPass = (copyOfAllBoxes, box, turn) => {
  const validBox = validateBox(box, turn);
  if (!validBox) return false;
  const validMoves = getPieceValidMoves(box, copyOfAllBoxes);
  if (validMoves.length === 0) return false;
  return true;
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
  else validMoves = getKingPieceValidMoves(box, copyOfAllBoxes);

  return validMoves;
};

const getPieceValidKills = (box, copyOfAllBoxes, turn) => {
  let validKills = [];
  if (box.piece.pieceType === "REGULAR")
    validKills = getRegularPieceValidKills(box, copyOfAllBoxes);
  else validKills = getKingPieceValidKills(box, copyOfAllBoxes, turn);
  return validKills;
};

const getRegularPieceValidMoves = (box, copyOfAllBoxes) => {
  const validMoves = [];
  const piecePossibleMoves = possibleRegularMovesPositions(
    copyOfAllBoxes,
    box,
    box.piece.pieceDirection
  );
  for (let i = 0; i < piecePossibleMoves.length; i++) {
    const toBox = piecePossibleMoves[i];
    const validMove = isRegularMove(box, toBox, box.piece.pieceDirection);
    if (validMove) validMoves.push(toBox);
  }
  return validMoves;
};

const getRegularPieceValidKills = (box, copyOfAllBoxes) => {
  const validKills = [];
  const piecePossibleKills = possibleRegularKillPositions(copyOfAllBoxes, box);
  for (let i = 0; i < piecePossibleKills.length; i++) {
    const toBox = piecePossibleKills[i];
    const validKill = isRegularKillMove(box, toBox, copyOfAllBoxes);
    if (validKill.valid) validKills.push(toBox);
  }
  return validKills;
};

const tryValidMove = (box, toBox, copyOfAllBoxes, turn, callNumber) => {
  const fakedBoxes = fakeTheBoxes(box, toBox, null, copyOfAllBoxes);
  const nextTurn = getNextTurn(turn);
  if (callNumber === 1) {
    calculateMove(fakedBoxes, nextTurn, 2);
    if (ratingsForPlayerFirstCounter) {
      const rating = getPlayerBestRating(ratingsForPlayerFirstCounter);
      aiMoveRating = {
        trend: [{ box, toBox }],
        rating,
        moveType: "REGULAR MOVE",
      };
      ratingsForPlayerFirstCounter = [];
      ratingsForAiFirstMoves.push(aiMoveRating);
    }
  }
  if (callNumber === 2) {
    calculateMove(fakedBoxes, nextTurn, 3);
    if (ratingsForSecondAIMoves) {
      const aiBestRating = getAiBestRating(ratingsForSecondAIMoves);
      ratingsForPlayerFirstCounter.push(aiBestRating);
      ratingsForSecondAIMoves = [];
    }
  }
  if (callNumber === 3) {
    calculateMove(fakedBoxes, nextTurn, 4);
    if (ratingsForPlayerSecondCounter) {
      const playerBestRating = getPlayerBestRating(
        ratingsForPlayerSecondCounter
      );
      ratingsForSecondAIMoves.push(playerBestRating);
      ratingsForPlayerSecondCounter = [];
    }
  }
  if (callNumber === 4) {
    calculateMove(fakedBoxes, nextTurn, 5);
    if (ratingsForThirdAIMoves) {
      const aiBestRating = getAiBestRating(ratingsForThirdAIMoves);
      ratingsForPlayerSecondCounter.push(aiBestRating);
      ratingsForThirdAIMoves = [];
    }
  }
  if (callNumber === 5) {
    const rating = calculateRating(fakedBoxes, nextTurn);
    ratingsForThirdAIMoves.push(rating);
  }
};

const tryValidKill = (box, toBox, copyOfAllBoxes, turn, callNumber) => {
  const middleBox = getAIMiddleBox(box, toBox, copyOfAllBoxes);
  const fakedBoxes = fakeTheBoxes(box, toBox, middleBox, copyOfAllBoxes);
  const nextTurn = getNextTurn(turn);
  if (callNumber === 1) {
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      allAiKillTrends.push({ box, toBox });
      calculateMove(fakedBoxes, turn, 1, toBox.boxNumber, true);
      return;
    } else {
      killTrend.push(...allAiKillTrends, { box, toBox });
      calculateMove(fakedBoxes, nextTurn, 2);
    }
    if (ratingsForPlayerFirstCounter) {
      const rating = getPlayerBestRating(ratingsForPlayerFirstCounter);
      aiMoveRating = {
        trend: [...killTrend],
        rating,
        moveType: "REGULAR KILL",
      };
      killTrend = [];
      ratingsForAiFirstMoves.push(aiMoveRating);
      ratingsForPlayerFirstCounter = [];
    }
  }
  if (callNumber === 2) {
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      calculateMove(fakedBoxes, turn, 2, toBox.boxNumber, true);
      return;
    } else calculateMove(fakedBoxes, nextTurn, 3);
    if (ratingsForSecondAIMoves) {
      const aiBestRating = getAiBestRating(ratingsForSecondAIMoves);
      ratingsForPlayerFirstCounter.push(aiBestRating);
      ratingsForSecondAIMoves = [];
    }
  }
  if (callNumber === 3) {
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      calculateMove(fakedBoxes, turn, 3, toBox.boxNumber, true);
      return;
    } else calculateMove(fakedBoxes, nextTurn, 4);
    if (ratingsForPlayerSecondCounter) {
      const playerBestRating = getPlayerBestRating(
        ratingsForPlayerSecondCounter
      );
      ratingsForSecondAIMoves.push(playerBestRating);
      ratingsForPlayerSecondCounter = [];
    }
  }
  if (callNumber === 4) {
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      calculateMove(fakedBoxes, turn, 4, toBox.boxNumber, true);
      return;
    } else calculateMove(fakedBoxes, nextTurn, 5);
    if (ratingsForThirdAIMoves) {
      const aiBestRating = getAiBestRating(ratingsForThirdAIMoves);
      ratingsForPlayerSecondCounter.push(aiBestRating);
      ratingsForThirdAIMoves = [];
    }
  }
  if (callNumber === 5) {
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      calculateMove(fakedBoxes, turn, 5, toBox.boxNumber, true);
      return;
    }
    const rating = calculateRating(fakedBoxes, nextTurn);
    ratingsForThirdAIMoves.push(rating);
  }
};

const turnCanMakeMultipleKills = (toBox, fakedBoxes, turn) => {
  let pieceCanStillKill = false;
  const piecesThatCanKill = checkIfPiecesCanKill(fakedBoxes, turn);
  if (piecesThatCanKill) {
    pieceCanStillKill = piecesThatCanKill.some(
      (aBox) => aBox.boxNumber === toBox.boxNumber
    );
  }
  return pieceCanStillKill;
};

const calculateRating = (fakedBoxes, turn) => {
  const pieceCountBefore = pieceCounts;
  const pieceCountAfter = countPieces(fakedBoxes, turn);
  const playerPieceDifference =
    pieceCountBefore.playerPiecesCount - pieceCountAfter.playerPiecesCount;
  const aiPieceDifference =
    pieceCountBefore.aiPiecesCount - pieceCountAfter.aiPiecesCount;
  return playerPieceDifference - aiPieceDifference;
};

const getPlayerBestRating = (aiBestRatings) => {
  let playerBestRating = aiBestRatings[0];
  aiBestRatings.forEach((val) => {
    if (val < playerBestRating) {
      playerBestRating = val;
    }
  });
  return playerBestRating;
};

const getAiBestRating = (playerBestRatings) => {
  let aiBestRating = playerBestRatings[0];
  playerBestRatings.forEach((val) => {
    if (val > aiBestRating) {
      aiBestRating = val;
    }
  });
  return aiBestRating;
};

const countPieces = (fakeTheBoxes, turn) => {
  let aiPiecesCount = 0;
  let playerPiecesCount = 0;
  fakeTheBoxes.forEach((box) => {
    if (!box.isFilled) return;
    const pieceInBox = box.piece;
    if (pieceInBox.pieceColor === turn) {
      if (pieceInBox.pieceType === pieceTypes[1]) playerPiecesCount += 3;
      else playerPiecesCount++;
    } else {
      if (pieceInBox.pieceType === pieceTypes[1]) aiPiecesCount += 3;
      else aiPiecesCount++;
    }
  });
  return { aiPiecesCount, playerPiecesCount };
};

const fakeTheBoxes = (box, toBox, middleBox = null, copyOfAllBoxes) => {
  const fakedBoxes = JSON.parse(JSON.stringify(copyOfAllBoxes));
  const pieceInBox = box.piece;
  fakedBoxes[toBox.boxNumber].isFilled = true;
  fakedBoxes[toBox.boxNumber].piece = pieceInBox;
  fakedBoxes[box.boxNumber].isFilled = false;
  fakedBoxes[box.boxNumber].piece = null;
  pieceInBox.index = toBox.boxNumber;
  if (middleBox) {
    const pieceInMiddleBox = middleBox.piece;
    pieceInMiddleBox.isAlive = false;
    fakedBoxes[middleBox.boxNumber].isFilled = false;
    fakedBoxes[middleBox.boxNumber].piece = null;
  }
  return fakedBoxes;
};

const getBestMove = (ratingsForAiFirstMoves, copyOfAllBoxes) => {
  const highestRating = getHighestRating(ratingsForAiFirstMoves);
  const bestMoves = ratingsForAiFirstMoves.filter(
    (move) => move.rating === highestRating
  );
  let safestMoves = getSafestMoves(bestMoves, copyOfAllBoxes);
  if (safestMoves.length === 0) safestMoves = bestMoves;
  const random = Math.floor(Math.random() * safestMoves.length);
  return safestMoves[random];
};

const getHighestRating = (ratingsForAiFirstMoves) => {
  let highestRating = ratingsForAiFirstMoves[0].rating;
  ratingsForAiFirstMoves.map((move) => {
    const rating = move.rating;
    if (rating > highestRating) highestRating = rating;
  });
  return highestRating;
};

const getSafestMoves = (bestMoves, allBoxes) => {
  const safestMoves = bestMoves.filter((move) => {
    const { trend } = move;
    const box = trend[trend.length - 1].box;
    const toBox = trend[trend.length - 1].toBox;
    if (toBox.boxNumber % 10 === 0 || toBox.boxNumber % 10 === 9) return move;
    else if (toBox.boxNumber % 10 !== 0 || toBox.boxNumber % 10 !== 9) {
      if (pieceIsClosingRanks(box, toBox, allBoxes)) return move;
    }
  });
  return safestMoves;
};

module.exports = { calculateMove };
