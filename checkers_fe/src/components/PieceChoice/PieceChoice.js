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
          onClick={() => setPlayerOnePiece("red")}
          className={`piecechoice__box ${
            playerOnePiece === "red" && "clickedPiece"
          }`}
        >
          <Piece bgColor={"red"} />
        </div>
        <div
          onClick={() => setPlayerOnePiece("yellow")}
          className={`piecechoice__box ${
            playerOnePiece === "yellow" && "clickedPiece"
          }`}
        >
          <Piece bgColor={"yellow"} />
        </div>
      </div>
    </section>
  );
};

export default PieceChoice;
