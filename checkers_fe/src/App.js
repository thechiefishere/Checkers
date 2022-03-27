import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import Multiplayer from "./pages/Multiplayer/Multiplayer";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setGameState, setLobby } from "./store/actions";

function App() {
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("gameState", (state) => {
      dispatch(setGameState(state));
    });
  });

  useEffect(() => {
    socket.on("lobby", (lobby) => {
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
