import React, { useState } from "react";
import "./PieceChoice.css";
import Piece from "../Piece/Piece";
import { useDispatch } from "react-redux";
import { updatePlayersDetails } from "../../store/actions";

const PieceChoice = () => {
  const [playerOnePiece, setPlayerOnePiece] = useState();
  const dispatch = useDispatch();

  return (
    <section className="piecechoice">
      <h2 className="piecechoice__heading">Pick Player 1's Piece Color</h2>
      <div className="piecechoice__form">
        <div
          onClick={() => {
            setPlayerOnePiece("WHITE");
            dispatch(
              updatePlayersDetails({
                player1Color: "WHITE",
                player2Color: "GREEN",
              })
            );
          }}
          className={`piecechoice__box ${
            playerOnePiece === "WHITE" && "clickedPiece"
          }`}
        >
          <Piece pieceValue={1} />
        </div>
        <div
          onClick={() => {
            setPlayerOnePiece("GREEN");
            dispatch(
              updatePlayersDetails({
                player1Color: "GREEN",
                player2Color: "WHITE",
              })
            );
          }}
          className={`piecechoice__box ${
            playerOnePiece === "GREEN" && "clickedPiece"
          }`}
        >
          <Piece pieceValue={60} />
        </div>
      </div>
    </section>
  );
};

export default PieceChoice;
