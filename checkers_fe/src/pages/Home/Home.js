import React from "react";
import "./Home.css";
import PieceChoice from "../../components/PieceChoice/PieceChoice";

const Home = () => {
  return (
    <main className="home">
      <h1 className="home__heading">
        Checker<span>s</span>
      </h1>
      <PieceChoice />
      <button className="btn btn--home">New Game (VS CPU)</button>
      <button className="btn btn--home">New Game (VS PLAYER)</button>
    </main>
  );
};

export default Home;
