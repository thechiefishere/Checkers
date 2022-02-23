import React, { useState, useEffect } from "react";
import "./Piece.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getLeftDimension,
  getPieceByNumber,
  getTopDimension,
  validateClick,
} from "../../utils/functions";
import { addPiece, setClickedPiece, updateBox } from "../../store/actions";

const Piece = ({ index, pieceNumber }) => {
  const [pieceType, setPieceType] = useState("Regular");
  const [leftDimension, setLeftDimension] = useState(0);
  const [topDimension, setTopDimension] = useState(0);
  const [pieceColor, setPieceColor] = useState();
  const [isAlive, setIsAlive] = useState(true);

  const boardWidth = useSelector((state) => state.boardWidth);
  const turn = useSelector((state) => state.turn);
  const playersDetails = useSelector((state) => state.playersDetails);
  const clickedPiece = useSelector((state) => state.clickedPiece);
  const allPiece = useSelector((state) => state.allPiece);
  const dispatch = useDispatch();
  const PieceWidth = boardWidth / 10;

  useEffect(() => {
    const left = getLeftDimension(index) || 0;
    const top = getTopDimension(index) || 0;
    const color = pieceNumber < 40 ? "WHITE" : "GREEN";
    const piece = {
      pieceNumber,
      index,
      pieceColor: color,
      isAlive,
      pieceType,
      pieceDirection: pieceNumber < 40 ? "DOWN" : "UP",
    };
    setLeftDimension(left);
    setTopDimension(top);
    setPieceColor(color);
    dispatch(addPiece(piece));
  }, []);

  useEffect(() => {
    savedData();
  }, [allPiece]);

  const savedData = () => {
    const piece = getPieceByNumber(pieceNumber, allPiece);
    if (!piece) return;
    const left = getLeftDimension(piece.index) || 0;
    const top = getTopDimension(piece.index) || 0;
    setIsAlive(piece.isAlive);
    setPieceType(piece.pieceType);
    setLeftDimension(left);
    setTopDimension(top);
  };

  const handlePieceClick = () => {
    const validClick = validateClick(turn, playersDetails, pieceColor);
    if (!validClick) return;
    const piece = getPieceByNumber(pieceNumber, allPiece);
    dispatch(setClickedPiece(piece));
  };

  return (
    <div>
      {isAlive && (
        <div
          onClick={handlePieceClick}
          className={`piece ${
            clickedPiece !== null &&
            clickedPiece.pieceNumber === pieceNumber &&
            "piece--clicked"
          }`}
          style={{
            backgroundColor: `${pieceColor}`,
            width: PieceWidth - 10,
            height: PieceWidth - 10,
            top: topDimension * PieceWidth,
            left: leftDimension * PieceWidth,
          }}
        ></div>
      )}
    </div>
  );
};

export default Piece;
