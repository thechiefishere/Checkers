import React, { useRef, useEffect } from "react";
import "./Board.css";
import Box from "../Box/Box";
import Piece from "../Piece/Piece";
import { useSelector } from "react-redux";
import { getBoardWidth } from "../../utils/functions";

const Board = () => {
  const boardWidth = getBoardWidth(window.innerWidth);
  const gameState = useSelector((state) => state.gameState);

  return (
    <section>
      {gameState && (
        <section
          className="board"
          style={{ width: boardWidth + 10, height: boardWidth + 10 }}
        >
          {gameState.allBoxes.map((box, index) => (
            <Box key={index} box={box} boardWidth={boardWidth} />
          ))}
          {gameState.allPiece.map((piece, index) => (
            <Piece key={index} piece={piece} boardWidth={boardWidth} />
          ))}
        </section>
      )}
    </section>
  );
};

export default Board;
