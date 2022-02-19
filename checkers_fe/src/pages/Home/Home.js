import React from "react";
import "./Home.css";
import PieceChoice from "../../components/PieceChoice/PieceChoice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updatePlayersDetails } from "../../store/actions";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <main className="home">
      <h1 className="home__heading">
        Checker<span>s</span>
      </h1>
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
          // navigate("/game");
        }}
        className="btn btn--home"
      >
        New Game (VS PLAYER)
      </button>
    </main>
  );
};

export default Home;
