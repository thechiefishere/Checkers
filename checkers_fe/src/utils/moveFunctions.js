export const arrayOfPossibleMoves = (fromBoxNumber, direction) => {
  const possibleMovesArray = [];
  if (
    fromBoxNumber % 10 !== 0 &&
    fromBoxNumber % 10 !== 9 &&
    direction === "DOWN"
  ) {
    possibleMovesArray.push(fromBoxNumber + 9);
    possibleMovesArray.push(fromBoxNumber + 11);
  } else if (
    fromBoxNumber % 10 !== 0 &&
    fromBoxNumber % 10 !== 9 &&
    direction === "UP"
  ) {
    possibleMovesArray.push(fromBoxNumber - 9);
    possibleMovesArray.push(fromBoxNumber - 11);
  } else if (fromBoxNumber % 10 === 0 && direction === "DOWN")
    possibleMovesArray.push(fromBoxNumber + 11);
  else if (fromBoxNumber % 10 === 0 && direction === "UP")
    possibleMovesArray.push(fromBoxNumber - 9);
  else if (fromBoxNumber % 10 === 9 && direction === "DOWN")
    possibleMovesArray.push(fromBoxNumber + 9);
  else if (fromBoxNumber % 10 === 9 && direction === "UP")
    possibleMovesArray.push(fromBoxNumber - 11);

  return possibleMovesArray;
};

export const isValidRegularMove = (fromBox, toBox, direction) => {
  if (toBox.isFilled) return false;
  const validMovesFromBox = arrayOfPossibleMoves(fromBox.boxNumber, direction);
  const moveExist = validMovesFromBox.find((move) => move === toBox.boxNumber);
  if (moveExist) return true;
  return false;
};

export const isValidKillMove = (fromBox, toBox, direction) => {};
