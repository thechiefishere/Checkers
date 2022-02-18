import React from "react";
import "./Piece.css";
import { useSelector } from "react-redux";

const Piece = ({ bgColor, dimension }) => {
  const { leftDimension: left, topDimension: top } = dimension;
  const boardWidth = useSelector((state) => state.boardWidth);
  const PieceWidth = boardWidth / 10;

  return (
    <div
      className="piece"
      style={{
        backgroundColor: `${bgColor}`,
        width: PieceWidth - 10,
        height: PieceWidth - 10,
        top: top * PieceWidth,
        left: left * PieceWidth,
      }}
    ></div>
  );
};

export default Piece;
