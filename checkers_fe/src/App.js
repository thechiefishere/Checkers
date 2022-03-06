import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  checkIfPiecesCanKill,
  getBoxesWithPieceThatCanKill,
} from "./utils/functions";
import {
  setAllBoxPiece,
  setIsKillMove,
  setMoveMade,
  setPiecesThatMustKill,
  setPieceThatMadeLastKill,
  switchTurn,
  updateBox,
  updatePiece,
} from "./store/actions";
import { calculateMove } from "./utils/aiFunctions";

function App() {
  const turn = useSelector((state) => state.turn);
  const allBoxes = useSelector((state) => state.allBoxes);
  const isKillMove = useSelector((state) => state.isKillMove);
  const playersDetails = useSelector((state) => state.playersDetails);
  const pieceThatMadeLastKill = useSelector(
    (state) => state.pieceThatMadeLastKill
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
    if (!pieceExist) return;
    const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
    const pieces = boxes.map((box) => box.piece);
    dispatch(setPiecesThatMustKill(pieces));
  }, [turn]);

  useEffect(() => {
    if (
      playersDetails.player2 === "CPU" &&
      turn === playersDetails.player2Color
    ) {
      const aiBestMove = calculateMove(allBoxes, turn);
      setTimeout(() => {
        makeAIMove(aiBestMove.box, aiBestMove.toBox);
      }, 1000);
    }
  }, [turn]);

  useEffect(() => {
    if (allBoxes.length === 100) dispatch(setAllBoxPiece(true));
  }, [allBoxes]);

  useEffect(() => {
    if (!isKillMove || !pieceThatMadeLastKill) return;
    dispatch(setMoveMade(true));
    const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
    if (!pieceExist) {
      dispatch(switchTurn());
      dispatch(setIsKillMove(false));
      dispatch(setPieceThatMadeLastKill(null));
      dispatch(setPiecesThatMustKill(null));
      return;
    }
    const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
    const pieces = boxes.map((box) => box.piece);
    const pieceIsIn = pieces.some(
      (piece) => piece.pieceNumber === pieceThatMadeLastKill.pieceNumber
    );
    if (pieceIsIn) {
      dispatch(setPiecesThatMustKill([pieceThatMadeLastKill]));
      dispatch(setIsKillMove(false));
      dispatch(setPieceThatMadeLastKill(null));
    } else {
      dispatch(switchTurn());
      dispatch(setIsKillMove(false));
      dispatch(setPieceThatMadeLastKill(null));
    }
  }, [isKillMove]);

  const makeAIMove = (box, toBox) => {
    const pieceInBox = box.piece;
    pieceInBox.index = toBox.boxNumber;
    box.isFilled = false;
    box.piece = null;
    toBox.isFilled = true;
    toBox.piece = pieceInBox;
    dispatch(updatePiece(pieceInBox));
    dispatch(updateBox(box));
    dispatch(updateBox(toBox));
    dispatch(switchTurn());
  };

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
