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
  setIsKillMove,
  setMoveMade,
  setPiecesThatMustKill,
  setPieceThatMadeLastKill,
  setPieceThatMovedLast,
  switchTurn,
  updateBox,
  updatePiece,
} from "../../store/actions";
import {
  isRegularMove,
  isRegularKillMove,
  isKingMove,
  isKingKill,
  canKingMakeSlantKill,
  getSlantKillPositions,
} from "../../utils/moveFunctions";

const Box = ({ index }) => {
  const [boxColor, setBoxColor] = useState();

  const boardWidth = useSelector((state) => state.boardWidth);
  const clickedPiece = useSelector((state) => state.clickedPiece);
  const allBoxPieceSet = useSelector((state) => state.allBoxPieceSet);
  const allBoxes = useSelector((state) => state.allBoxes);
  const allPiece = useSelector((state) => state.allPiece);
  const piecesThatMustKill = useSelector((state) => state.piecesThatMustKill);
  const turn = useSelector((state) => state.turn);

  const dispatch = useDispatch();
  const boxWidth = boardWidth / 10;
  const boxNumber = index;
  let moveTaken = false;

  useEffect(() => {
    const left = getLeftDimension(index);
    const top = getTopDimension(index);
    const color = getColorFromDimensions(index);
    const filled =
      (index < 40 || index > 59) && color !== "YELLOW" ? true : false;
    setBoxColor(color);
    const box = { boxNumber, left, top, isFilled: filled, boxColor: color };
    dispatch(addBox(box));
  }, []);

  useEffect(() => {
    if (allPiece.length !== 40 || allBoxPieceSet) return;
    const piece = getPieceByNumber(index, allPiece);
    const box = getBoxByNumber(index, allBoxes);
    if (!box || !piece) return;
    box.piece = piece;
    dispatch(updateBox(box));
  }, [allPiece]);

  const handleBoxClick = () => {
    if (clickedPiece === null || boxColor === "YELLOW") return;
    const box = getBoxByNumber(index, allBoxes);
    if (box.isFilled) return;
    const fromBox = getBoxByNumber(clickedPiece.index, allBoxes);
    dispatch(setClickedBox(box));
    if (clickedPiece.pieceType === "REGULAR") {
      handleRegularMove(fromBox, box, clickedPiece.pieceDirection);
      if (!moveTaken) handleRegularKillMove(fromBox, box);
    } else {
      handleKingMove(fromBox, box, allBoxes);
      if (!moveTaken) handleKingKill(fromBox, box, allBoxes);
    }
  };

  const handleRegularMove = (fromBox, box, direction) => {
    if (piecesThatMustKill) return;
    const validRegularMove = isRegularMove(fromBox, box, direction);
    if (validRegularMove) makeMove(clickedPiece, fromBox, null, box);
  };

  const handleRegularKillMove = (fromBox, box) => {
    const validKillMove = isRegularKillMove(fromBox, box, allBoxes);
    if (validKillMove.valid)
      makeMove(clickedPiece, fromBox, validKillMove.middleBox, box, "KILL");
  };

  const handleKingMove = (fromBox, box, allBoxes) => {
    if (piecesThatMustKill) return;
    const validKingMove = isKingMove(fromBox, box, allBoxes);
    if (validKingMove) makeMove(clickedPiece, fromBox, null, box);
  };

  const handleKingKill = (fromBox, box, allBoxes) => {
    const validKingKill = isKingKill(fromBox, box, allBoxes);
    if (validKingKill.valid) {
      const slantKillPossible = canKingMakeSlantKill(
        allBoxes,
        fromBox,
        box,
        validKingKill.middleBox,
        turn
      );
      if (slantKillPossible) {
        const slantKillPositions = getSlantKillPositions(
          allBoxes,
          fromBox,
          box,
          validKingKill.middleBox,
          turn
        );
        const validMove = slantKillPositions.some(
          (aBox) => aBox.boxNumber === box.boxNumber
        );
        if (!validMove) return;
      }
      makeMove(clickedPiece, fromBox, validKingKill.middleBox, box, "KILL");
    }
  };

  const makeMove = (
    clickedPiece,
    fromBox,
    middleBox = null,
    box,
    moveType = "NORMAL"
  ) => {
    moveTaken = true;
    setNewStates(clickedPiece, fromBox, middleBox, box);
    moveDispatch(clickedPiece, fromBox, box, moveType);
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

  const moveDispatch = (clickedPiece, fromBox, box, moveType) => {
    dispatch(updatePiece(clickedPiece));
    dispatch(setPieceThatMovedLast(clickedPiece));
    dispatch(updateBox(fromBox));
    dispatch(updateBox(box));
    dispatch(setClickedPiece(null));
    dispatch(setClickedBox(null));
    if (moveType === "NORMAL") {
      dispatch(switchTurn());
      dispatch(setMoveMade(true));
      dispatch(setPiecesThatMustKill(null));
    } else {
      dispatch(setIsKillMove(true));
      dispatch(setPieceThatMadeLastKill(clickedPiece));
    }
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
