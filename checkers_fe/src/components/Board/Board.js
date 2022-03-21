import React, { useRef, useEffect } from "react";
import "./Board.css";
import Box from "../Box/Box";
import Piece from "../Piece/Piece";
import { useDispatch, useSelector } from "react-redux";
import { setBoardWidth } from "../../store/actions";
import { getBoardWidth, getColorFromDimensions } from "../../utils/functions";

const Board = () => {
  const boardRef = useRef();
  const dispatch = useDispatch();
  const boardWidth = getBoardWidth(window.innerWidth);
  const boardHeight = boardWidth;
  // const totalNumberOfBoxes = 100;
  const gameState = useSelector((state) => state.gameState);
  // const socket = useSelector((state) => state.socket);
  console.log("gameState in Board is", gameState);

  useEffect(() => {
    // dispatch(setBoardWidth(boardRef.current.getBoundingClientRect().width));
    // socket.emit(
    //   "set_boardWidth",
    //   boardRef.current.getBoundingClientRect().width
    // );
  }, []);

  // return (
  //   <section className="board-cont">
  //     <section ref={boardRef} className="board">
  //       {Array.from({ length: totalNumberOfBoxes }).map((val, index) => {
  //         let bgColor = getColorFromDimensions(index);
  //         return (
  //           <div key={index}>
  //             <Box index={index} />
  //             {(index < 40 || index > 59) && bgColor !== "YELLOW" && (
  //               <Piece index={index} pieceNumber={index} />
  //             )}
  //           </div>
  //         );
  //       })}
  //     </section>
  //   </section>
  // );
  return (
    <section className="board-cont" style={{ width: boardWidth }}>
      {gameState && (
        <section className="board">
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
