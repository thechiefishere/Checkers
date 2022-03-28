import React from "react";
import "./Game.css";
import Board from "../../components/Board/Board";
import Logo from "../../components/Logo/Logo";
import { useSelector } from "react-redux";

const Game = () => {
  const gameState = useSelector((state) => state.gameState);
  const lobby = useSelector((state) => state.lobby);
  const playerColor = useSelector((state) => state.playerColor);

  return (
    <main className="game">
      <Logo />
      <h3 className="game__turn">
        {gameState && playerColor === gameState.turn
          ? lobby.gameHasStarted === "true" && "Your Turn"
          : lobby.gameHasStarted === "true" && "Opponent's Turn"}
      </h3>
      {lobby.gameHasStarted === "false" && <h3>Game ID is {lobby.roomId}</h3>}
      <Board />
    </main>
  );
};

export default Game;
