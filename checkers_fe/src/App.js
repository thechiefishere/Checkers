import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import Multiplayer from "./pages/Multiplayer/Multiplayer";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setGameState, setLobby, setSocket } from "./store/actions";
import { io } from "socket.io-client";

function App() {
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    socket.on("gameState", (gameState) => {
      localStorage.setItem("gameState", JSON.stringify(gameState));
      dispatch(setGameState(gameState));
    });
  });

  useEffect(() => {
    if (!socket) return;
    socket.on("lobby", (lobby) => {
      localStorage.setItem("lobby", JSON.stringify(lobby));
      dispatch(setLobby(lobby));
    });
  });

  return (
    <Router>
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
