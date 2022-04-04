import React from "react";
import "./Game.css";
import Board from "../../components/Board/Board";
import GameOver from "../../components/GameOver/GameOver";
import Logo from "../../components/Logo/Logo";
import { useSelector } from "react-redux";
import WhitePiece from "../../assets/pieces/white_piece.jpg";
import BlackPiece from "../../assets/pieces/black_piece.jpg";
import { pieceColors } from "../../utils/constants";

const Game = () => {
  const gameState = useSelector((state) => state.gameState);
  const lobby = useSelector((state) => state.lobby);
  const playerColor = useSelector((state) => state.playerColor);

  return (
    <main className="game">
      <Logo />
      <h3 className="game__turn">
        {gameState && playerColor === gameState.turn
          ? lobby.gameHasStarted &&
            gameState &&
            !gameState.gameOver &&
            "Your Turn"
          : lobby.gameHasStarted &&
            gameState &&
            !gameState.gameOver &&
            "Opponent's Turn"}
      </h3>
      <img
        className="game__piece-img"
        src={
          gameState && gameState.turn === pieceColors[0]
            ? WhitePiece
            : BlackPiece
        }
        alt="Piece"
      />
      {!lobby.gameHasStarted && <h3>Game ID is {lobby.roomId}</h3>}
      <Board />
      <GameOver />
    </main>
  );
};

export default Game;
