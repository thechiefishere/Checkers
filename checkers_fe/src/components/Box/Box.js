import React, { useState, useEffect } from "react";
import "./Box.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getBoxByNumber,
  getColorFromDimensions,
  getLeftDimension,
  getTopDimension,
} from "../../utils/functions";
import {
  addBox,
  setClickedBox,
  setClickedPiece,
  updateBox,
  updatePieceIndex,
} from "../../store/actions";
import { isValidRegularMove } from "../../utils/moveFunctions";

const Box = ({ index }) => {
  const [boxColor, setBoxColor] = useState();
  const boardWidth = useSelector((state) => state.boardWidth);
  const clickedPiece = useSelector((state) => state.clickedPiece);
  const allBoxes = useSelector((state) => state.allBoxes);
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

  const handleBoxClick = () => {
    if (clickedPiece === null || boxColor === "YELLOW") return;
    const box = getBoxByNumber(index, allBoxes);
    const fromBox = getBoxByNumber(clickedPiece.index, allBoxes);
    dispatch(setClickedBox(box));
    const validRegularMove = isValidRegularMove(
      fromBox,
      box,
      clickedPiece.pieceDirection
    );
    if (validRegularMove) {
      makeMove(clickedPiece, fromBox, box);
      dispatch(setClickedPiece(null));
      dispatch(setClickedBox(null));
    }
  };

  const makeMove = (clickedPiece, fromBox, box) => {
    clickedPiece.index = box.boxNumber;
    fromBox.isFilled = false;
    box.isFilled = true;
    dispatch(updatePieceIndex(clickedPiece));
    dispatch(updateBox(fromBox));
    dispatch(updateBox(box));
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
