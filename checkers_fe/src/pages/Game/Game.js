import React from "react";
import "./Game.css";
import Board from "../../components/Board/Board";
import Logo from "../../components/Logo/Logo";
import { useSelector } from "react-redux";

const Game = () => {
  const gameState = useSelector((state) => state.gameState);
  const playerColor = useSelector((state) => state.playerColor);

  return (
    <main className="game">
      <Logo />
      <h3 className="game__turn">
        {gameState && playerColor === gameState.turn
          ? "Your Turn"
          : "Opponent's Turn"}
      </h3>
      <Board />
    </main>
  );
};

export default Game;
