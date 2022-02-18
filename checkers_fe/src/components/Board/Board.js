import React, { useRef, useEffect } from "react";
import "./Board.css";
import Box from "../Box/Box";
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

          return <Box key={index} bgColor={bgColor} />;
        })}
      </section>
    </section>
  );
};

export default Board;
