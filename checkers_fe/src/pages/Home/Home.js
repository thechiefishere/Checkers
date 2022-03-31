import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerColor } from "../../store/actions";
import Logo from "../../components/Logo/Logo";
import { pieceColors } from "../../utils/constants";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket);

  const handleNewGameVsAi = () => {
    socket.emit("singleplayer_newgame");
    localStorage.setItem("playerColor", pieceColors[0]);
    dispatch(setPlayerColor(pieceColors[0]));
    navigate("/game");
  };

  return (
    <main className="home">
      <Logo />
      <button
        onClick={() => {
          handleNewGameVsAi();
        }}
        className="btn btn--home"
      >
        New Game (VS CPU)
      </button>
      <button
        onClick={() => {
          navigate("/multiplayer");
        }}
        className="btn btn--home"
      >
        New Game (VS PLAYER)
      </button>
    </main>
  );
};

export default Home;
