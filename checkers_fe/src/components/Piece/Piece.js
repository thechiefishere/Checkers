import React, { useState, useEffect } from "react";
import "./Piece.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getLeftDimension,
  getPieceByNumber,
  getTopDimension,
  isPieceInKingPosition,
  isPieceInPiecesThatMustKill,
  validateClick,
} from "../../utils/functions";
import {
  addPiece,
  setClickedPiece,
  setMoveMade,
  updateBox,
  updatePiece,
} from "../../store/actions";

const Piece = ({ index, pieceNumber }) => {
  const [pieceType, setPieceType] = useState("REGULAR");
  const [leftDimension, setLeftDimension] = useState(0);
  const [topDimension, setTopDimension] = useState(0);
  const [pieceColor, setPieceColor] = useState();
  const [isAlive, setIsAlive] = useState(true);
  const [canKill, setCanKill] = useState(false);

  const boardWidth = useSelector((state) => state.boardWidth);
  const turn = useSelector((state) => state.turn);
  const playersDetails = useSelector((state) => state.playersDetails);
  const clickedPiece = useSelector((state) => state.clickedPiece);
  const allPiece = useSelector((state) => state.allPiece);
  const piecesThatMustKill = useSelector((state) => state.piecesThatMustKill);
  const pieceThatMovedLast = useSelector((state) => state.pieceThatMovedLast);
  const moveMade = useSelector((state) => state.moveMade);
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

  useEffect(() => {
    setCanKill(false);
    if (!piecesThatMustKill) return;
    piecesThatMustKill.map((piece) => {
      if (piece.pieceNumber === pieceNumber) setCanKill(true);
    });
  }, [piecesThatMustKill]);

  useEffect(() => {
    if (!moveMade) return;
    confirmKingship();
    dispatch(setMoveMade(false));
  }, [moveMade]);

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
    if (piecesThatMustKill) {
      const pieceIsIn = isPieceInPiecesThatMustKill(piece, piecesThatMustKill);
      if (pieceIsIn) dispatch(setClickedPiece(piece));
    } else dispatch(setClickedPiece(piece));
  };

  const confirmKingship = () => {
    const isInKingPosition = isPieceInKingPosition(pieceThatMovedLast);
    if (!isInKingPosition) return;
    const pieceIsIn = isPieceInPiecesThatMustKill(
      pieceThatMovedLast,
      piecesThatMustKill
    );
    if (pieceIsIn) return;
    pieceThatMovedLast.pieceType = "KING";
    dispatch(updatePiece(pieceThatMovedLast));
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
          } ${canKill && "piece--canKill"}`}
          style={{
            backgroundColor: `${pieceColor}`,
            width: PieceWidth - 10,
            height: PieceWidth - 10,
            top: topDimension * PieceWidth,
            left: leftDimension * PieceWidth,
          }}
        >
          {pieceType === "KING" && <h1 className="piece--king">K</h1>}
        </div>
      )}
    </div>
  );
};

export default Piece;
