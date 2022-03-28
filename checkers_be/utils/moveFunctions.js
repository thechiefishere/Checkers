const { boxColors } = require("../constants");
// const { checkIfPiecesCanKill } = require("./function");

const isValidAtEdge = (fromBoxNumber, toBoxNumber, boxDifference) => {
  if (toBoxNumber > fromBoxNumber) {
    if (fromBoxNumber % 10 === 0 && boxDifference % 9 === 0) return false;
    if (fromBoxNumber % 10 === 9 && boxDifference % 11 === 0) return false;
  } else {
    if (fromBoxNumber % 10 === 0 && boxDifference % 11 === 0) return false;
    if (fromBoxNumber % 10 === 9 && boxDifference % 9 === 0) return false;
  }
  return true;
};

const checkRegularMove = (toBoxNumber, fromBoxNumber, direction) => {
  let boxDifference = toBoxNumber - fromBoxNumber;
  if (direction === "UP") boxDifference = fromBoxNumber - toBoxNumber;
  if (boxDifference < 0) return false;
  if (!isValidAtEdge(toBoxNumber, fromBoxNumber, boxDifference)) return false;
  if (boxDifference === 9 || boxDifference === 11) return true;
  return false;
};

const isRegularMove = (fromBox, toBox, direction) => {
  if (toBox.isFilled) return false;
  let validMove = false;
  validMove = checkRegularMove(toBox.boxNumber, fromBox.boxNumber, direction);
  return validMove;
};

const isSamePieceColor = (fromBox, middleBox) => {
  const pieceOne = fromBox.piece;
  const pieceTwo = middleBox.piece;
  if (pieceOne.pieceColor === pieceTwo.pieceColor) return true;
  return false;
};

const getMiddleBox = (fromBox, toBox, allBoxes) => {
  const middleBoxAddOn = Math.abs(fromBox.boxNumber - toBox.boxNumber) / 2;
  if (middleBoxAddOn !== 9 && middleBoxAddOn !== 11) return null;
  const middleBoxIndex =
    toBox.boxNumber > fromBox.boxNumber
      ? fromBox.boxNumber + middleBoxAddOn
      : fromBox.boxNumber - middleBoxAddOn;
  const middleBox = allBoxes[middleBoxIndex];
  return middleBox;
};

const isRegularKillMove = (fromBox, toBox, allBoxes) => {
  if (toBox.isFilled) return { valid: false, middleBox: null };
  const middleBox = getMiddleBox(fromBox, toBox, allBoxes);
  if (
    !middleBox ||
    !middleBox.isFilled ||
    middleBox.boxNumber % 10 === 9 ||
    middleBox.boxNumber % 10 === 0
  )
    return { valid: false, middleBox: null };
  if (isSamePieceColor(fromBox, middleBox))
    return { valid: false, middleBox: null };
  return { valid: true, middleBox };
};

const isKingMove = (fromBox, toBox, allBoxes) => {
  const boxDifference = getBoxDifference(fromBox, toBox);
  if (!boxDifferencePass(fromBox, toBox, boxDifference)) return false;
  const boxAddOn = boxDifference % 11 === 0 ? 11 : 9;
  const emptyMiddleBoxes = areMiddleBoxesEmpty(
    fromBox,
    toBox,
    boxAddOn,
    allBoxes
  );
  if (emptyMiddleBoxes) return true;
  return false;
};

const boxDifferencePass = (fromBox, toBox, boxDifference) => {
  if (toBox.isFilled) return false;
  if (toBox.boxColor === boxColors[2]) return false;
  if (boxDifference % 9 !== 0 && boxDifference % 11 !== 0) return false;
  if (boxDifference === 11 || boxDifference === 9) {
    if (!isValidAtEdge(toBox.boxNumber, fromBox.boxNumber, boxDifference))
      return false;
  }
  return true;
};

const areMiddleBoxesEmpty = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) return true;
    const box = allBoxes[i];
    if (box.isFilled) return false;
    i += boxAddOn;
  }
  return true;
};

const isKingKillMove = (fromBox, toBox, allBoxes, turn, checkSlant) => {
  const boxDifference = getBoxDifference(fromBox, toBox);
  if (!boxDifferencePass(fromBox, toBox, boxDifference))
    return { valid: false, middleBox: null };
  const boxAddOn = boxDifference % 11 === 0 ? 11 : 9;
  const pieceCanDie = canOneMiddleBoxBeKilled(
    fromBox,
    toBox,
    boxAddOn,
    allBoxes
  );

  if (pieceCanDie) {
    const middleBox = getMiddleBoxForKingKill(
      fromBox,
      toBox,
      boxAddOn,
      allBoxes
    );
    if (!checkSlant) return { valid: true, middleBox };
    const inSlantKillPosition = isInSlantKillPosition(
      allBoxes,
      fromBox,
      toBox,
      middleBox,
      turn
    );
    if (inSlantKillPosition) return { valid: true, middleBox };
  }
  return { valid: false, middleBox: null };
};

const canOneMiddleBoxBeKilled = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  let filledBoxesCount = 0;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) break;
    const box = allBoxes[i];
    if (box.isFilled) {
      if (isSamePieceColor(fromBox, box)) return false;
      else filledBoxesCount++;
    }
    if (filledBoxesCount === 2) return false;
    i += boxAddOn;
  }
  if (filledBoxesCount === 1) return true;
  return false;
};

const getMiddleBoxForKingKill = (fromBox, toBox, boxAddOn, allBoxes) => {
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  for (let i = fromBox.boxNumber + boxAddOn; ; ) {
    if (i === toBox.boxNumber) break;
    const box = allBoxes[i];
    if (box.isFilled) return box;
    i += boxAddOn;
  }
  return null;
};

const canKingMakeSlantKill = (allBoxes, fromBox, toBox, middleBox, turn) => {
  let copyOfAllBoxes = JSON.parse(JSON.stringify(allBoxes));
  const boxDifference = Math.abs(toBox.boxNumber - fromBox.boxNumber);
  let boxAddOn = boxDifference % 11 === 0 ? 11 : 9;
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  copyOfAllBoxes[middleBox.boxNumber].isFilled = false;
  copyOfAllBoxes[middleBox.boxNumber].piece = null;
  copyOfAllBoxes[fromBox.boxNumber].piece = null;
  copyOfAllBoxes[fromBox.boxNumber].isFilled = false;
  for (let i = middleBox.boxNumber + boxAddOn; ; i += boxAddOn) {
    if (i <= 0 || i >= 100) break;
    const box = copyOfAllBoxes[i];
    if (box.isFilled) break;
    copyOfAllBoxes[i].piece = fromBox.piece;
    copyOfAllBoxes[i].isFilled = true;
    if (checkIfPiecesCanKill(copyOfAllBoxes, turn)) {
      const pieceCanStillKill = getBoxesWithPieceThatCanKill(
        copyOfAllBoxes,
        turn
      ).some((aBox) => aBox.boxNumber === box.boxNumber);
      if (pieceCanStillKill) return true;
    }
    copyOfAllBoxes[i].piece = null;
    copyOfAllBoxes[i].isFilled = false;
    if (i % 10 === 0 || i % 9 === 0) break;
  }
  return false;
};

const isInSlantKillPosition = (allBoxes, fromBox, toBox, middleBox, turn) => {
  const slantKillPossible = canKingMakeSlantKill(
    allBoxes,
    fromBox,
    toBox,
    middleBox,
    turn
  );
  if (slantKillPossible) {
    const slantKillPositions = getSlantKillPositions(
      allBoxes,
      fromBox,
      toBox,
      middleBox,
      turn
    );
    const validMove = slantKillPositions.some(
      (aBox) => aBox.boxNumber === toBox.boxNumber``
    );
    if (validMove) return true;
  } else return true;
  return false;
};

const checkIfPiecesCanKill = (allBoxes, turn, checkSlant = false) => {
  for (let i = 0; i < allBoxes.length; i++) {
    const box = allBoxes[i];
    if (!box.isFilled) continue;
    if (box.piece.pieceColor !== turn) continue;
    for (let j = 0; j < allBoxes.length; j++) {
      const aBox = allBoxes[j];
      if (aBox.isFilled) continue;
      if (aBox.boxColor === boxColors[2]) continue;
      if (box.piece.pieceType === "REGULAR") {
        const regularMove = isRegularKillMove(box, aBox, allBoxes);
        if (regularMove.valid) return true;
      } else {
        const kingMove = isKingKillMove(box, aBox, allBoxes, turn, checkSlant);
        if (kingMove.valid) return true;
      }
    }
  }
  return false;
};

const getBoxesWithPieceThatCanKill = (allBoxes, turn) => {
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
        const kingMove = isKingKillMove(box, aBox, allBoxes);
        if (kingMove.valid) {
          boxes.push(box);
          break;
        }
      }
    }
  }
  return boxes;
};

const getSlantKillPositions = (allBoxes, fromBox, toBox, middleBox, turn) => {
  let copyOfAllBoxes = JSON.parse(JSON.stringify(allBoxes));
  const boxDifference = Math.abs(toBox.boxNumber - fromBox.boxNumber);
  let boxAddOn = boxDifference % 11 === 0 ? 11 : 9;
  boxAddOn = fromBox.boxNumber > toBox.boxNumber ? -boxAddOn : boxAddOn;
  const slantKillPositions = [];
  copyOfAllBoxes[middleBox.boxNumber].isFilled = false;
  copyOfAllBoxes[middleBox.boxNumber].piece = null;
  copyOfAllBoxes[fromBox.boxNumber].piece = null;
  copyOfAllBoxes[fromBox.boxNumber].isFilled = false;
  for (let i = middleBox.boxNumber + boxAddOn; ; i += boxAddOn) {
    if (i <= 0 || i >= 100) break;
    const box = copyOfAllBoxes[i];
    if (box.isFilled) break;
    copyOfAllBoxes[i].piece = fromBox.piece;
    copyOfAllBoxes[i].isFilled = true;
    if (checkIfPiecesCanKill(copyOfAllBoxes, turn)) {
      const pieceCanStillKill = getBoxesWithPieceThatCanKill(
        copyOfAllBoxes,
        turn
      ).some((aBox) => aBox.boxNumber === box.boxNumber);
      if (pieceCanStillKill) slantKillPositions.push(box);
    }
    copyOfAllBoxes[i].piece = null;
    copyOfAllBoxes[i].isFilled = false;
    if (i % 10 === 0 || i % 9 === 0) break;
  }
  return slantKillPositions;
};

const getBoxDifference = (fromBox, toBox) => {
  return Math.abs(toBox.boxNumber - fromBox.boxNumber);
};

const getAIMiddleBox = (fromBox, toBox, allBoxes) => {
  const boxDifference = getBoxDifference(fromBox, toBox);
  const boxAddOn = getBoxAddOn(boxDifference);
  if (fromBox.piece.pieceType === "REGULAR")
    return getMiddleBox(fromBox, toBox, allBoxes);
  return getMiddleBoxForKingKill(fromBox, toBox, boxAddOn, allBoxes);
};

const pieceIsClosingRanks = (box, toBox, allBoxes) => {
  if (box.piece.pieceType === "KING") return false;
  if (toBox.boxNumber / 10 < 1) return true;
  const boxOneAtTheFrontOfToBox = allBoxes[toBox.boxNumber - 9];
  const boxTwoAtTheFrontOfToBox = allBoxes[toBox.boxNumber - 11];
  if (
    boxOneAtTheFrontOfToBox.isFilled &&
    isSamePieceColor(box, boxOneAtTheFrontOfToBox)
  )
    return true;
  if (
    boxTwoAtTheFrontOfToBox.isFilled &&
    isSamePieceColor(box, boxTwoAtTheFrontOfToBox)
  )
    return true;
  return false;
};

const getBoxAddOn = (boxDifference) => {
  return boxDifference % 11 === 0 ? 11 : 9;
};

module.exports = {
  isRegularMove,
  isRegularKillMove,
  getMiddleBox,
  isKingMove,
  isKingKillMove,
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
  getAIMiddleBox,
  pieceIsClosingRanks,
};
