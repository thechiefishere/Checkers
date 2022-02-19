import React, { useState, useEffect } from "react";
import "./Piece.css";
import { useSelector, useDispatch } from "react-redux";
import { getLeftDimension, getTopDimension } from "../../utils/functions";
import { addPiece } from "../../store/actions";

const Piece = ({ index, pieceValue }) => {
  const [pieceNumber, setPieceNumber] = useState(pieceValue);
  const [leftDimension, setLeftDimension] = useState(0);
  const [topDimension, setTopDimension] = useState(0);
  const [pieceColor, setPieceColor] = useState();
  const [isAlive, setIsAlive] = useState(true);

  const boardWidth = useSelector((state) => state.boardWidth);
  const dispatch = useDispatch();
  const PieceWidth = boardWidth / 10;

  useEffect(() => {
    const left = getLeftDimension(index) || 0;
    const top = getTopDimension(index) || 0;
    const piece = {
      pieceNumber,
      index,
      pieceColor,
      isAlive,
    };
    setLeftDimension(left);
    setTopDimension(top);
    setPieceColor(pieceNumber < 40 ? "WHITE" : "GREEN");
    dispatch(addPiece(piece));
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
