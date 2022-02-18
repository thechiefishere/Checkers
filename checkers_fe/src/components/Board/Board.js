import React, { useRef, useEffect } from "react";
import "./Board.css";
import Box from "../Box/Box";
import Piece from "../Piece/Piece";
import { useDispatch } from "react-redux";
import { setBoardWidth } from "../../store/actions";
import { getColorFromDimensions } from "../../utils/functions";

const Board = () => {
  const boardRef = useRef();
  const dispatch = useDispatch();
  const totalNumberOfBoxes = 100;

  useEffect(() => {
    dispatch(setBoardWidth(boardRef.current.getBoundingClientRect().width));
  }, []);

  return (
    <section className="board-cont">
      <section ref={boardRef} className="board">
        {Array.from({ length: totalNumberOfBoxes }).map((val, index) => {
          let bgColor = getColorFromDimensions(index);
          return (
            <div key={index}>
              <Box index={index} />
              {(index < 40 || index > 59) && bgColor != "yellow" && (
                <Piece index={index} />
              )}
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default Board;
