import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { checkIfPieceCanKill } from "./utils/functions";
import {
  setAllBoxPiece,
  setClickedPiece,
  setPieceThatMustKill,
} from "./store/actions";

function App() {
  const turn = useSelector((state) => state.turn);
  const allBoxes = useSelector((state) => state.allBoxes);

  const dispatch = useDispatch();

  useEffect(() => {
    const pieceExist = checkIfPieceCanKill(allBoxes, turn);
    if (!pieceExist.canKill) return;
    const piece = pieceExist.box.piece;
    dispatch(setClickedPiece(piece));
  }, [turn]);

  useEffect(() => {
    if (allBoxes.length === 100) dispatch(setAllBoxPiece(true));
  }, [allBoxes]);

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
