import React from "react";
import "./Piece.css";

const Piece = ({ bgColor }) => {
  return (
    <div className="piece" style={{ backgroundColor: `${bgColor}` }}></div>
  );
};

export default Piece;
