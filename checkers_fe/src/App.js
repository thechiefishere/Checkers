import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // const turn = useSelector((state) => state.turn);
  // const allBoxes = useSelector((state) => state.allBoxes);

  // useEffect(() => {
  //   checkIfPieceCanKill(allBoxes);
  // }, [turn]);

  return (
    <Router>
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
