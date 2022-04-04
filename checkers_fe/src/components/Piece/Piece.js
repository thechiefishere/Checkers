import React, { useState, useEffect } from "react";
import "./Piece.css";
import { useSelector, useDispatch } from "react-redux";
import {
  isPieceInPiecesThatMustKill,
  validateClick,
} from "../../utils/functions";
import { pieceColors, pieceTypes } from "../../utils/constants";
import WhitePiece from "../../assets/pieces/white_piece.jpg";
import WhiteKing from "../../assets/pieces/white_king.jpg";
import BlackPiece from "../../assets/pieces/black_piece.jpg";
import BlackKing from "../../assets/pieces/black_king.jpg";
import { setClicked } from "../../store/actions";

const Piece = ({ piece, boardWidth }) => {
  const {
    pieceNumber,
    pieceType,
    pieceColor,
    leftDimension,
    topDimension,
    isAlive,
  } = piece;
  const [canKill, setCanKill] = useState(false);
  const dispatch = useDispatch();

  const pieceWidth = boardWidth / 10;
  const pieceHeight = pieceWidth;
  const gameState = useSelector((state) => state.gameState);
  const playerColor = useSelector((state) => state.playerColor);
  const socket = useSelector((state) => state.socket);
  const lobby = useSelector((state) => state.lobby);
  const clicked = useSelector((state) => state.clicked);

  const { clickedPiece, turn, piecesThatMustKill } = gameState;
  const { roomId, gameHasStarted } = lobby;

  useEffect(() => {
    setCanKill(false);
    if (!piecesThatMustKill) return;
    piecesThatMustKill.map((piece) => {
      if (piece.pieceNumber === pieceNumber) setCanKill(true);
    });
  }, [piecesThatMustKill]);

  useEffect(() => {
    dispatch(setClicked(-1));
  }, [turn]);

  const handlePieceClick = () => {
    if (!gameHasStarted) return;
    const validClick = validateClick(turn, playerColor, pieceColor);
    if (!validClick) return;
    if (piecesThatMustKill) {
      const pieceIsIn = isPieceInPiecesThatMustKill(piece, piecesThatMustKill);
      if (pieceIsIn) {
        dispatch(setClicked(piece.pieceNumber));
        socket.emit("clicked-piece", piece, roomId);
      }
    } else {
      dispatch(setClicked(piece.pieceNumber));
      socket.emit("clicked-piece", piece, roomId);
    }
  };

  return (
    <div>
      {isAlive && (
        <img
          src={
            pieceColor === pieceColors[0]
              ? pieceType === pieceTypes[0]
                ? WhitePiece
                : WhiteKing
              : pieceType === pieceTypes[0]
              ? BlackPiece
              : BlackKing
          }
          alt="Piece"
          onClick={handlePieceClick}
          className={`piece ${
            clickedPiece !== null &&
            clickedPiece.pieceNumber === pieceNumber &&
            "piece--clicked"
          } ${canKill && "piece--canKill"} ${
            clicked === piece.pieceNumber && "piece--clicked"
          }`}
          style={{
            backgroundColor: `${pieceColor}`,
            width: pieceWidth - 10,
            height: pieceWidth - 10,
            top: topDimension * pieceHeight,
            left: leftDimension * pieceWidth,
          }}
        />
      )}
    </div>
  );
};

export default Piece;
