import React, { useState, useEffect } from "react";
import "./Box.css";
import { useSelector } from "react-redux";
import {
  getColorFromDimensions,
  getLeftDimension,
  getTopDimension,
} from "../../utils/functions";

const Box = ({ index }) => {
  const [leftDimension, setLeftDimension] = useState();
  const [topDimension, setTopDimension] = useState();
  const [boxColor, setBoxColor] = useState();
  const boardWidth = useSelector((state) => state.boardWidth);
  const boxWidth = boardWidth / 10;

  useEffect(() => {
    setLeftDimension(getLeftDimension(index));
    setTopDimension(getTopDimension(index));
    setBoxColor(getColorFromDimensions(index));
  }, []);

  return (
    <div
      className="box"
      style={{
        width: boxWidth,
        height: boxWidth,
        backgroundColor: boxColor,
      }}
    ></div>
  );
};

export default Box;
