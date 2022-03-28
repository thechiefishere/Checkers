import React, { useState } from "react";
import "./Multiplayer.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerColor } from "../../store/actions";
import { pieceColors } from "../../utils/constants";

const Multiplayer = () => {
  const [gameId, setGameId] = useState("");
  const navigate = useNavigate();
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  const handleNewGame = () => {
    socket.emit("multiplayer_newgame");
    dispatch(setPlayerColor(pieceColors[0]));
    navigate("/game");
  };

  const handleJoinGame = () => {
    if (!gameId) return;
    socket.emit("join-game", gameId.trim());
    dispatch(setPlayerColor(pieceColors[1]));
    navigate("/game");
  };

  return (
    <section className="multiplayer">
      <h1 className="multiplayer__heading">Multiplayer Checkers</h1>
      <button className="btn btn--multiplayer" onClick={handleNewGame}>
        Create New Game
      </button>
      <h2>OR</h2>
      <div>
        <input
          className="multiplayer__input"
          onChange={(e) => setGameId(e.target.value)}
          type="text"
        />
        <button className="btn btn--multiplayer" onClick={handleJoinGame}>
          Join Game
        </button>
      </div>
    </section>
  );
};

export default Multiplayer;
