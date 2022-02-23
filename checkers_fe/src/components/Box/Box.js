import React, { useState, useEffect } from "react";
import "./Box.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getBoxByNumber,
  getColorFromDimensions,
  getLeftDimension,
  getPieceByNumber,
  getTopDimension,
} from "../../utils/functions";
import {
  addBox,
  setClickedBox,
  setClickedPiece,
  switchTurn,
  updateBox,
  updatePiece,
} from "../../store/actions";
import {
  isRegularMove,
  isRegularKillMove,
  isKingMove,
} from "../../utils/moveFunctions";

const Box = ({ index }) => {
  const [boxColor, setBoxColor] = useState();
  const [pieceSet, setPieceSet] = useState(false);
  const boardWidth = useSelector((state) => state.boardWidth);
  const clickedPiece = useSelector((state) => state.clickedPiece);
  const allBoxes = useSelector((state) => state.allBoxes);
  const allPiece = useSelector((state) => state.allPiece);
  const dispatch = useDispatch();
  const boxWidth = boardWidth / 10;
  const boxNumber = index;

  useEffect(() => {
    const left = getLeftDimension(index);
    const top = getTopDimension(index);
    const color = getColorFromDimensions(index);
    const filled =
      (index < 40 || index > 59) && color !== "YELLOW" ? true : false;
    setBoxColor(color);
    const box = { boxNumber, left, top, isFilled: filled };
    dispatch(addBox(box));
  }, []);

  useEffect(() => {
    if (allPiece.length !== 40 || pieceSet) return;
    const piece = getPieceByNumber(index, allPiece);
    const box = getBoxByNumber(index, allBoxes);
    if (!box || !piece) return;
    box.piece = piece;
    dispatch(updateBox(box));
    setPieceSet(true);
  }, [allPiece]);

  const handleBoxClick = () => {
    if (clickedPiece === null || boxColor === "YELLOW") return;
    const box = getBoxByNumber(index, allBoxes);
    const fromBox = getBoxByNumber(clickedPiece.index, allBoxes);
    dispatch(setClickedBox(box));
    if (clickedPiece.pieceType === "REGULAR") {
      handleRegularMove(fromBox, box, clickedPiece.pieceDirection);
      handleRegularKillMove(fromBox, box);
    } else {
      handleKingMove(fromBox, box, allBoxes);
    }
  };

  const handleKingMove = (fromBox, box, allBoxes) => {
    const validKingMove = isKingMove(fromBox, box, allBoxes);
    if (validKingMove) makeMove(clickedPiece, fromBox, null, box);
  };

  const handleRegularMove = (fromBox, box, direction) => {
    const validRegularMove = isRegularMove(fromBox, box, direction);
    if (validRegularMove) makeMove(clickedPiece, fromBox, null, box);
  };

  const handleRegularKillMove = (fromBox, box) => {
    const middleBoxAddOn = Math.abs(fromBox.boxNumber - box.boxNumber) / 2;
    const middleBoxIndex =
      box.boxNumber > fromBox.boxNumber
        ? fromBox.boxNumber + middleBoxAddOn
        : fromBox.boxNumber - middleBoxAddOn;
    if (middleBoxAddOn === 9 || middleBoxAddOn === 11) {
      const middleBox = getBoxByNumber(middleBoxIndex, allBoxes);
      const validKillMove = isRegularKillMove(fromBox, middleBox, box);
      if (validKillMove) makeMove(clickedPiece, fromBox, middleBox, box);
    }
  };

  const makeMove = (clickedPiece, fromBox, middleBox = null, box) => {
    setNewStates(clickedPiece, fromBox, middleBox, box);
    dispatch(updatePiece(clickedPiece));
    dispatch(updateBox(fromBox));
    dispatch(updateBox(box));
    dispatch(switchTurn());
    dispatch(setClickedPiece(null));
    dispatch(setClickedBox(null));
  };

  const setNewStates = (clickedPiece, fromBox, middleBox, box) => {
    fromBox.isFilled = false;
    fromBox.piece = null;
    box.isFilled = true;
    box.piece = clickedPiece;
    clickedPiece.index = box.boxNumber;
    if (middleBox !== null) setMiddleBoxState(middleBox);
  };

  const setMiddleBoxState = (middleBox) => {
    const pieceInMiddleBox = middleBox.piece;
    pieceInMiddleBox.isAlive = false;
    middleBox.isFilled = false;
    middleBox.piece = null;
    dispatch(updatePiece(pieceInMiddleBox));
    dispatch(updateBox(middleBox));
  };

  return (
    <div
      onClick={handleBoxClick}
      className="box"
      style={{
        width: boxWidth,
        height: boxWidth,
        backgroundColor: boxColor,
      }}
    ></div>
  );
};

export default Box;
