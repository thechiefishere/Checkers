import React, { useState } from "react";
import "./PieceChoice.css";
import Piece from "../Piece/Piece";

const PieceChoice = () => {
  const [playerOnePiece, setPlayerOnePiece] = useState();

  return (
    <section className="piecechoice">
      <h2 className="piecechoice__heading">Pick Player 1's Piece Color</h2>
      <div className="piecechoice__form">
        <div
          onClick={() => setPlayerOnePiece("green")}
          className={`piecechoice__box ${
            playerOnePiece === "green" && "clickedPiece"
          }`}
        >
          <Piece bgColor={"green"} />
        </div>
        <div
          onClick={() => setPlayerOnePiece("white")}
          className={`piecechoice__box ${
            playerOnePiece === "white" && "clickedPiece"
          }`}
        >
          <Piece bgColor={"white"} />
        </div>
      </div>
    </section>
  );
};

export default PieceChoice;
