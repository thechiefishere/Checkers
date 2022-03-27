import React, { useState, useEffect } from "react";
import "./Box.css";
import { useSelector } from "react-redux";

const Box = ({ box, boardWidth }) => {
  const boxWidth = boardWidth / 10;
  const boxHeight = boxWidth;
  const { topDimension, leftDimension, boxColor } = box;

  const gameState = useSelector((state) => state.gameState);
  const socket = useSelector((state) => state.socket);
  const lobby = useSelector((state) => state.lobby);
  const { clickedPiece, allBoxes } = gameState;
  const { roomId } = lobby;

  const handleBoxClick = () => {
    if (clickedPiece === null || boxColor === "YELLOW") return;
    if (box.isFilled) return;
    const fromBox = allBoxes[clickedPiece.index];
    if (clickedPiece.pieceType === "REGULAR") {
      socket.emit(
        "handle-regular-move",
        fromBox,
        box,
        clickedPiece.pieceDirection,
        roomId
      );
    } else socket.emit("handle-king-move", fromBox, box, roomId);
  };

  return (
    <div
      onClick={handleBoxClick}
      className="box"
      style={{
        width: boxWidth,
        height: boxHeight,
        top: topDimension * boxHeight,
        left: leftDimension * boxWidth,
        backgroundColor: boxColor,
      }}
    ></div>
  );
};

export default Box;
