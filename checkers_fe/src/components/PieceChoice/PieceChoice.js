import React, { useState } from "react";
import "./PieceChoice.css";
import Piece from "../Piece/Piece";
import { useDispatch } from "react-redux";
import { setTurn, updatePlayersDetails } from "../../store/actions";

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
            dispatch(setTurn("WHITE"));
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
          style={{ backgroundColor: "WHITE" }}
        ></div>
        <div
          onClick={() => {
            setPlayerOnePiece("GREEN");
            dispatch(setTurn("GREEN"));
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
          style={{ backgroundColor: "GREEN" }}
        ></div>
      </div>
    </section>
  );
};

export default PieceChoice;
