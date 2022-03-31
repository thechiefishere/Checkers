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
    localStorage.setItem("playerColor", pieceColors[0]);
    dispatch(setPlayerColor(pieceColors[0]));
    navigate("/game");
  };

  const handleJoinGame = () => {
    if (!gameId) return;
    socket.emit("join-game", gameId.trim());
    localStorage.setItem("playerColor", pieceColors[1]);
    dispatch(setPlayerColor(pieceColors[1]));
    navigate("/game");
  };

  return (
    <section className="multiplayer">
      <h1 className="multiplayer__heading">MULTIPLAYER</h1>
      <button className="btn btn--multiplayer" onClick={handleNewGame}>
        Create Game
      </button>
      <h4>OR</h4>
      <div>
        <input
          className="multiplayer__input"
          onChange={(e) => setGameId(e.target.value)}
          type="text"
          placeholder="Enter Game ID"
        />
        <button className="btn btn--multiplayer" onClick={handleJoinGame}>
          Join Game
        </button>
      </div>
    </section>
  );
};

export default Multiplayer;
