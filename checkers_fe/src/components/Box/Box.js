import React, { useState, useEffect } from "react";
import "./Box.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getColorFromDimensions,
  getLeftDimension,
  getTopDimension,
} from "../../utils/functions";
import { addBox } from "../../store/actions";

const Box = ({ index }) => {
  const [leftDimension, setLeftDimension] = useState();
  const [topDimension, setTopDimension] = useState();
  const [boxColor, setBoxColor] = useState();
  const [isFilled, setIsFilled] = useState();
  const boardWidth = useSelector((state) => state.boardWidth);
  const boxes = useSelector((state) => state.allBoxes);
  const dispatch = useDispatch();
  const boxWidth = boardWidth / 10;

  useEffect(() => {
    const left = getLeftDimension(index);
    const top = getTopDimension(index);
    const color = getColorFromDimensions(index);
    const filled =
      (index < 40 || index > 59) && color !== "YELLOW" ? true : false;
    setLeftDimension(left);
    setTopDimension(top);
    setBoxColor(color);
    setIsFilled(filled);
    const box = { left, top, isFilled: filled };
    dispatch(addBox(box));
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
