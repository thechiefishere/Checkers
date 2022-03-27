import React from "react";
import "./Home.css";
import PieceChoice from "../../components/PieceChoice/PieceChoice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerColor } from "../../store/actions";
import Logo from "../../components/Logo/Logo";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket);

  const handleNewGameVsAi = () => {
    socket.emit("singleplayer_newgame");
    dispatch(setPlayerColor("WHITE"));
    navigate("/game");
  };

  return (
    <main className="home">
      <Logo />
      <PieceChoice />
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
          // dispatch(updatePlayersDetails({ player2: "HUMAN" }));
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
