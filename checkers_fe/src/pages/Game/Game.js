import React from "react";
import "./Game.css";
import Board from "../../components/Board/Board";
import Logo from "../../components/Logo/Logo";
import { VscDebugRestart } from "react-icons/vsc";
import { useSelector } from "react-redux";

const Game = () => {
  const turn = useSelector((state) => state.turn);

  return (
    <main className="game">
      <Logo />
      <section className="game__turn">
        <div className="turn-color" style={{ backgroundColor: turn }}></div>
        <h3>Turn</h3>
        {/* <VscDebugRestart className="btn--restart" /> */}
      </section>
      <Board />
    </main>
  );
};

export default Game;
