import React, { useState, useEffect } from "react";
import "./Piece.css";
import { useSelector } from "react-redux";
import { getLeftDimension, getTopDimension } from "../../utils/functions";

const Piece = ({ index }) => {
  const [pieceNumber, setPieceNumber] = useState(index);
  const [leftDimension, setLeftDimension] = useState(0);
  const [topDimension, setTopDimension] = useState(0);
  const [pieceColor, setPieceColor] = useState();
  const [isAlive, setIsAlive] = useState(true);

  const boardWidth = useSelector((state) => state.boardWidth);
  const PieceWidth = boardWidth / 10;

  useEffect(() => {
    setLeftDimension(getLeftDimension(index));
    setTopDimension(getTopDimension(index));
    setPieceColor(index < 40 ? "white" : "green");
  }, []);

  return (
    <div
      className="piece"
      style={{
        backgroundColor: `${pieceColor}`,
        width: PieceWidth - 10,
        height: PieceWidth - 10,
        top: topDimension * PieceWidth,
        left: leftDimension * PieceWidth,
      }}
    ></div>
  );
};

export default Piece;
