import {
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
  getNextTurn,
} from "../functions";
import {
  getAIMiddleBox,
  getMiddleBox,
  isRegularKillMove,
  isRegularMove,
} from "../moveFunctions";
import { getKingPieceValidMoves, getKingPieceValidKills } from "./aiKingMoves";

let allMoves = [];
let aiMoveRating = {};
let playerMovesRating = [];
let secondAIMoveRatings = [];
let killTrend = [];
let allAiKillTrends = [];
let validMovesCount = 0;

export const calculateMove = (
  allBoxes,
  turn,
  callNumber = 1,
  fromBox = -1,
  multiKill = false
) => {
  const copyOfAllBoxes = JSON.parse(JSON.stringify(allBoxes));
  const piecesCanKill = checkIfPiecesCanKill(copyOfAllBoxes, turn);
  //   console.log("piecesCanKill", piecesCanKill);
  if (piecesCanKill) {
    const piecesThatCanKill = getBoxesWithPieceThatCanKill(
      copyOfAllBoxes,
      turn
    );
    // console.log("piecesThatCanKill", piecesThatCanKill);
    const bestMove = whenKillIsPossible(
      copyOfAllBoxes,
      turn,
      callNumber,
      fromBox,
      multiKill
    );
    // console.log("bestMove", bestMove);
    return bestMove;
  } else {
    const bestMove = noPossibleKill(copyOfAllBoxes, turn, callNumber);
    return bestMove;
  }
  //   const bestMove = noPossibleKill(copyOfAllBoxes, turn, callNumber);
  //   return bestMove;
};

const whenKillIsPossible = (
  copyOfAllBoxes,
  turn,
  callNumber,
  fromBox,
  multiKill
) => {
  //   console.log("in whenKillIsPossible");
  const piecesThatCanKill = getBoxesWithPieceThatCanKill(copyOfAllBoxes, turn);
  // console.log("piecesThatCanKill", piecesThatCanKill);
  for (let i = 0; i < piecesThatCanKill.length; i++) {
    if (callNumber === 1 && i === 0) allMoves = [];
    const box = piecesThatCanKill[i];
    if (multiKill && fromBox !== box.boxNumber) continue;
    const validKills = getPieceValidKills(box, copyOfAllBoxes, turn);
    // console.log("box", box);
    // console.log("validKills", validKills);
    validMovesCount += validKills.length;
    validKills.forEach((toBox) => {
      validMovesCount--;
      tryValidKill(box, toBox, copyOfAllBoxes, turn, callNumber);
      if (validMovesCount === 0) allAiKillTrends = [];
    });
    if (callNumber === 1 && i === piecesThatCanKill.length - 1) {
      // console.log("allMoves", allMoves);
      return getBestMove(allMoves);
    }
  }
};

const noPossibleKill = (copyOfAllBoxes, turn, callNumber) => {
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const box = copyOfAllBoxes[i];
    // console.log("i is ", i);
    // console.log("box before passed checks", box);
    if (callNumber === 1 && box.boxNumber === 0) allMoves = [];
    const passedChecks = initialChecksPass(copyOfAllBoxes, box, turn);
    if (!passedChecks) {
      if (callNumber === 1 && box.boxNumber === 99)
        return getBestMove(allMoves);
      continue;
    }
    // console.log("box after passed checks", box);
    const validMoves = getPieceValidMoves(box, copyOfAllBoxes);
    validMoves.forEach((toBox) => {
      tryValidMove(box, toBox, copyOfAllBoxes, turn, callNumber);
    });
    if (callNumber === 1 && box.boxNumber === 99) return getBestMove(allMoves);
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

const getRegularPieceValidMoves = (box, copyOfAllBoxes) => {
  const validMoves = [];
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const toBox = copyOfAllBoxes[i];
    const validMove = isRegularMove(box, toBox, box.piece.pieceDirection);
    if (validMove) validMoves.push(toBox);
  }
  return validMoves;
};

const getPieceValidKills = (box, copyOfAllBoxes, turn) => {
  let validKills = [];
  if (box.piece.pieceType === "REGULAR")
    validKills = getRegularPieceValidKills(box, copyOfAllBoxes);
  else validKills = getKingPieceValidKills(box, copyOfAllBoxes, turn);
  return validKills;
};

const getRegularPieceValidKills = (box, copyOfAllBoxes) => {
  const validKills = [];
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const toBox = copyOfAllBoxes[i];
    const validKill = isRegularKillMove(box, toBox, copyOfAllBoxes);
    if (validKill.valid) validKills.push(toBox);
  }
  return validKills;
};

const tryValidMove = (box, toBox, copyOfAllBoxes, turn, callNumber) => {
  const fakedBoxes = fakeTheBoxes(box, toBox, null, copyOfAllBoxes);
  const nextTurn = getNextTurn(turn);
  if (callNumber === 1) {
    // console.log("++++++call 1 box in move", box);
    // console.log("++++++call 1 toBox in move", toBox);
    calculateMove(fakedBoxes, nextTurn, 2);
    if (playerMovesRating) {
      const rating = getAiBestRating(playerMovesRating);
      aiMoveRating = {
        trend: [{ box, toBox }],
        rating,
        moveType: "REGULAR MOVE",
      };
      playerMovesRating = [];
      allMoves.push(aiMoveRating);
      // console.log("++++++call 1 in move");
      // console.log("++++++aiMoveRating", aiMoveRating);
    }
  }
  if (callNumber === 2) {
    // console.log("call 2 box in move", box);
    // console.log("call 2 toBox in move", toBox);
    calculateMove(fakedBoxes, nextTurn, 3);
    if (secondAIMoveRatings) {
      const playerBestRating = getPlayerBestRating(secondAIMoveRatings);
      playerMovesRating.push(playerBestRating);
      secondAIMoveRatings = [];
      // console.log("call 2 in move");
      // console.log("playerMovesRating", playerMovesRating);
    }
  }
  if (callNumber === 3) {
    // console.log("=====call 3 box in move", box);
    // console.log("=====call 3 toBox in move", toBox);
    const rating = calculateRating(fakedBoxes, nextTurn);
    secondAIMoveRatings.push(rating);
    // console.log("======call 3 in move");
    // console.log("======secondAIMoveRatings", secondAIMoveRatings);
  }
};

const tryValidKill = (box, toBox, copyOfAllBoxes, turn, callNumber) => {
  const middleBox = getAIMiddleBox(box, toBox, copyOfAllBoxes);
  const fakedBoxes = fakeTheBoxes(box, toBox, middleBox, copyOfAllBoxes);
  const nextTurn = getNextTurn(turn);
  if (callNumber === 1) {
    // console.log("...................call 1 box in kill", box);
    // console.log("...................call 1 toBox in kill", toBox);
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    // console.log("pieceCanStillKill", pieceCanStillKill);
    if (pieceCanStillKill) {
      allAiKillTrends.push({ box, toBox });
      calculateMove(fakedBoxes, turn, 1, toBox.boxNumber, true);
      return;
    } else {
      killTrend.push(...allAiKillTrends, { box, toBox });
      calculateMove(fakedBoxes, nextTurn, 2);
    }
    if (playerMovesRating) {
      const rating = getAiBestRating(playerMovesRating);
      aiMoveRating = {
        trend: [...killTrend],
        rating,
        moveType: "REGULAR KILL",
      };
      killTrend = [];
      playerMovesRating = [];
      allMoves.push(aiMoveRating);
      // console.log("...................call 1 in kill");
      // console.log("...................aiMoveRating", aiMoveRating);
      // console.log("...................box in call 1", box);
      // console.log("...................toBox in call 1", toBox);
    }
  }
  if (callNumber === 2) {
    // console.log("call 2 box in kill", box);
    // console.log("call 2 toBox in kill", toBox);
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      calculateMove(fakedBoxes, turn, 2, toBox.boxNumber, true);
      return;
    } else calculateMove(fakedBoxes, nextTurn, 3);
    if (secondAIMoveRatings) {
      const playerBestRating = getPlayerBestRating(secondAIMoveRatings);
      playerMovesRating.push(playerBestRating);
      secondAIMoveRatings = [];
      // console.log("call 2 in kill");
      // console.log("playerMovesRating", playerMovesRating);
      // console.log("box in call 2", box);
      // console.log("toBox in call 2", toBox);
    }
  }
  if (callNumber === 3) {
    // console.log("------call 3 box in kill", box);
    // console.log("------call 3 toBox in kill", toBox);
    const pieceCanStillKill = turnCanMakeMultipleKills(toBox, fakedBoxes, turn);
    if (pieceCanStillKill) {
      calculateMove(fakedBoxes, turn, 3, toBox.boxNumber, true);
      return;
    }
    const rating = calculateRating(fakedBoxes, nextTurn);
    secondAIMoveRatings.push(rating);
    // console.log("------call 3 in kill");
    // console.log("------secondAIMoveRatings", secondAIMoveRatings);
    // console.log("------box in call 3", box);
    // console.log("------toBox in call 3", toBox);
  }
};

const turnCanMakeMultipleKills = (toBox, fakedBoxes, turn) => {
  // console.log("fakedBoxes", fakedBoxes);
  let pieceCanStillKill = false;
  const piecesCanKill = checkIfPiecesCanKill(fakedBoxes, turn);
  if (piecesCanKill) {
    const piecesThatCanKill = getBoxesWithPieceThatCanKill(fakedBoxes, turn);
    // console.log("piecesThatCanKill", piecesThatCanKill);
    pieceCanStillKill = piecesThatCanKill.some(
      (aBox) => aBox.boxNumber === toBox.boxNumber
    );
  }
  return pieceCanStillKill;
};

const calculateRating = (fakedBoxes, turn) => {
  const pieceCount = countPieces(fakedBoxes, turn);
  return pieceCount.playerPiecesCount - pieceCount.aiPiecesCount;
};

const getPlayerBestRating = (secondAIMoveRatings) => {
  let playerBestRating = secondAIMoveRatings[0];
  secondAIMoveRatings.forEach((val) => {
    if (val > playerBestRating) {
      playerBestRating = val;
    }
  });
  return playerBestRating;
};

const getAiBestRating = (playerBestRating) => {
  const aiBestRating = playerBestRating[0];
  playerBestRating.forEach((val) => {
    if (val < aiBestRating) {
      playerBestRating = val;
    }
  });
  return aiBestRating;
};

const countPieces = (fakeTheBoxes, turn) => {
  let aiPiecesCount = 0;
  let playerPiecesCount = 0;
  fakeTheBoxes.forEach((box) => {
    if (!box.isFilled) return;
    if (box.piece.pieceColor === turn) playerPiecesCount++;
    else aiPiecesCount++;
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

const getBestMove = (allMoves) => {
  const lowestRating = getLowestRating(allMoves);
  const bestMoves = allMoves.filter((move) => move.rating === lowestRating);
  const closestToCrown = getMovesThatAreClosestToCrown(bestMoves);
  // console.log("closestToCrown", closestToCrown);
  const random = Math.floor(Math.random() * closestToCrown.length);
  return closestToCrown[random];
};

const getLowestRating = (allMoves) => {
  let lowestRating = allMoves[0].rating;
  allMoves.map((move) => {
    const rating = move.rating;
    if (rating < lowestRating) lowestRating = rating;
  });
  return lowestRating;
};

const getMovesThatAreClosestToCrown = (bestMoves) => {
  const leastDistanceToCrown = getLeastDistanceToCrown(bestMoves);
  if (leastDistanceToCrown === 10) return bestMoves;
  const closestToCrown = bestMoves.filter((move) => {
    const { trend } = move;
    const toBox = trend[trend.length - 1].toBox;
    const distanceFromCrown = parseInt(toBox.boxNumber / 10);
    if (distanceFromCrown === leastDistanceToCrown) return move;
  });
  return closestToCrown;
};

const getLeastDistanceToCrown = (bestMoves) => {
  // console.log("bestMoves", bestMoves);
  let leastDistance = 10;
  bestMoves.map((move) => {
    const { trend } = move;
    // console.log("trend", trend);
    const boxInLastMove = trend[trend.length - 1].box;
    const toBox = trend[trend.length - 1].toBox;
    if (boxInLastMove.piece.pieceType !== "REGULAR") return;
    const distanceFromCrown = parseInt(toBox.boxNumber / 10);
    // console.log("distanceFromCrown", distanceFromCrown);
    if (distanceFromCrown < leastDistance) leastDistance = distanceFromCrown;
  });
  return leastDistance;
};
