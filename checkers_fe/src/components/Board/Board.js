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
          const leftDimension = index % 10;
          const topDimension = parseInt(index / 10);
          let bgColor = getColorFromDimensions(leftDimension, topDimension);
          return (
            <div key={index}>
              <Box bgColor={bgColor} />
              {index < 40 && bgColor != "yellow" && (
                <Piece
                  bgColor={"white"}
                  dimension={{ leftDimension, topDimension }}
                />
              )}
              {index > 59 && bgColor != "yellow" && (
                <Piece
                  bgColor={"green"}
                  dimension={{ leftDimension, topDimension }}
                />
              )}
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default Board;
