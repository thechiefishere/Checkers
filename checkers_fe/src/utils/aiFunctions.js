import { getNextTurn } from "./functions";
import { isRegularMove } from "./moveFunctions";

let allMoves = [];
let singleMove = [];
let aiMoveRating = {};
let playerMovesRating = [];
let aiCounterMoveRating = [];
let secondAIMoveFragment = [];

export const calculateMove = (allBoxes, turn, callNumber = 1) => {
  const copyOfAllBoxes = JSON.parse(JSON.stringify(allBoxes));
  for (let i = 0; i < copyOfAllBoxes.length; i++) {
    const box = copyOfAllBoxes[i];
    if (callNumber === 1 && box.boxNumber === 0) allMoves = [];
    const passedChecks = initialChecksPass(copyOfAllBoxes, box, turn);
    if (!passedChecks) {
      if (callNumber === 1 && box.boxNumber === 99) {
        // console.log("allMoves A", allMoves);
        return getBestMove(allMoves);
      }
      continue;
    }
    const validMoves = getPieceValidMoves(box, copyOfAllBoxes);
    validMoves.forEach((toBox) => {
      //   if (callNumber === 1) {
      //     console.log(".......call 1", box);
      //     console.log(".......validMoves", validMoves);
      //     console.log("turn is", turn);
      //   }
      //   if (callNumber === 2) {
      //     console.log("call 2", box);
      //     console.log("validMoves", validMoves);
      //     console.log("turn is", turn);
      //   }
      //   if (callNumber === 3) {
      //     console.log("-------call 3", box);
      //     console.log("-------validMoves", validMoves);
      //     console.log("turn is", turn);
      //   }
      tryValidMove(box, toBox, copyOfAllBoxes, turn, callNumber);
    });
    if (callNumber === 1 && box.boxNumber === 99) {
      //   console.log("allMoves B", allMoves);
      return getBestMove(allMoves);
    }
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

const tryValidMove = (box, toBox, copyOfAllBoxes, turn, callNumber) => {
  const fakedBoxes = fakeTheBoxes(box, toBox, copyOfAllBoxes);
  const nextTurn = getNextTurn(turn);
  //   const move = { fromBox: box, toBox };
  if (callNumber === 1) {
    // console.log(".......call 1 fakedBoxes", fakedBoxes);
    calculateMove(fakedBoxes, nextTurn, 2);
    if (playerMovesRating) {
      const rating = getAiBestRating(playerMovesRating);
      aiMoveRating = { box, toBox, rating };
      singleMove = { aiMoveRating, playerMovesRating, aiCounterMoveRating };
      playerMovesRating = [];
      aiCounterMoveRating = [];
      allMoves.push(singleMove);
      singleMove = {};
    }
    // aiMoveRating = fakedBoxes;
  }
  if (callNumber === 2) {
    // console.log("call 2 fakedBoxes", fakedBoxes);
    calculateMove(fakedBoxes, nextTurn, 3);
    if (secondAIMoveFragment) {
      aiCounterMoveRating.push(secondAIMoveFragment);
      const bestRatingInFragment = getPlayerBestRating(secondAIMoveFragment);
      playerMovesRating.push(bestRatingInFragment);
      secondAIMoveFragment = [];
    }
  }
  if (callNumber === 3) {
    // console.log("-------call 3 fakedBoxes", fakedBoxes);
    const rating = calculateRating(fakedBoxes, nextTurn);
    secondAIMoveFragment.push(rating);
  }
};

const calculateRating = (fakedBoxes, turn) => {
  const pieceCount = countPieces(fakedBoxes, turn);
  return pieceCount.playerPiecesCount - pieceCount.aiPiecesCount;
};

const getPlayerBestRating = (secondAIMoveFragment) => {
  const playerBestRating = 0;
  secondAIMoveFragment.forEach((val) => {
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
    if (box.piece.pieceColor === turn) aiPiecesCount++;
    else playerPiecesCount++;
  });
  return { aiPiecesCount, playerPiecesCount };
};

const fakeTheBoxes = (box, toBox, copyOfAllBoxes) => {
  const fakedBoxes = JSON.parse(JSON.stringify(copyOfAllBoxes));
  const pieceInBox = box.piece;
  fakedBoxes[toBox.boxNumber].isFilled = true;
  fakedBoxes[toBox.boxNumber].piece = pieceInBox;
  fakedBoxes[box.boxNumber].isFilled = false;
  fakedBoxes[box.boxNumber].piece = null;
  return fakedBoxes;
};

const getBestMove = (allMoves) => {
  const bestMoveRating = allMoves[0].aiMoveRating.rating;
  const bestMove = allMoves[0].aiMoveRating;
  allMoves.map((move) => {
    const rating = move.aiMoveRating.rating;
    if (rating < bestMoveRating) {
      bestMoveRating = rating;
      bestMove = move;
    }
  });
  return bestMove;
};

// const playerReactionToFakedMove = (fakedBoxes) => {
//   for (let i = 0; i < fakedBoxes; i++) {
//     const box = copyOfAllBoxes[i];
//     const validBox = validateBox(box, playerTurn);
//     if (!validBox) continue;
//   }
// };
