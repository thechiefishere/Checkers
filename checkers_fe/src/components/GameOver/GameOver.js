import React from "react";
import "./GameOver.css";
import { useSelector } from "react-redux";
import { getBoardWidth, getWinnersColor } from "../../utils/functions";

const GameOver = () => {
  const lobby = useSelector((state) => state.lobby);
  const gameState = useSelector((state) => state.gameState);
  const playerColor = useSelector((state) => state.playerColor);
  const socket = useSelector((state) => state.socket);
  const winner = getWinnersColor(gameState);
  const width = getBoardWidth(window.innerWidth);

  const handleRestart = () => {
    socket.emit("restart", lobby.roomId);
  };

  return (
    <aside>
      {gameState && gameState.gameOver && (
        <aside className="game-over" style={{ width: width }}>
          <h1>Game</h1>
          <h1>Over</h1>
          <h3 className="game-over__text">
            {playerColor === winner ? "You Won" : "You Lost"}
          </h3>
          <button onClick={handleRestart} className="btn btn--game-over">
            Restart
          </button>
        </aside>
      )}
    </aside>
  );
};

export default GameOver;
