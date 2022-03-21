import React from "react";
import "./Home.css";
import PieceChoice from "../../components/PieceChoice/PieceChoice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updatePlayersDetails } from "../../store/actions";
import Logo from "../../components/Logo/Logo";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <main className="home">
      <Logo />
      <PieceChoice />
      <button
        onClick={() => {
          dispatch(updatePlayersDetails({ player2: "CPU" }));
          navigate("/game");
        }}
        className="btn btn--home"
      >
        New Game (VS CPU)
      </button>
      <button
        onClick={() => {
          dispatch(updatePlayersDetails({ player2: "HUMAN" }));
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
