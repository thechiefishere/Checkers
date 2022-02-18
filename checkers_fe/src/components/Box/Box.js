import React from "react";
import "./Box.css";
import { useSelector } from "react-redux";

const Box = ({ bgColor }) => {
  //   const { leftDimension: left, topDimension: top } = dimension;
  const boardWidth = useSelector((state) => state.boardWidth);
  const boxWidth = boardWidth / 10;

  return (
    <div
      className="box"
      style={{
        width: boxWidth,
        backgroundColor: bgColor,
      }}
    ></div>
  );
};

export default Box;
