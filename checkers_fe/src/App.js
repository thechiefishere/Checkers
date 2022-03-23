import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import Multiplayer from "./pages/Multiplayer/Multiplayer";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  checkIfPiecesCanKill,
  getAllMiddleBoxes,
  getBoxesWithPieceThatCanKill,
} from "./utils/functions";
import {
  setAllBoxPiece,
  setIsKillMove,
  setMoveMade,
  setPiecesThatMustKill,
  setPieceThatMadeLastKill,
  setPieceThatMovedLast,
  setSocket,
  switchTurn,
  updateBox,
  updatePiece,
  setGameState,
} from "./store/actions";
import { calculateMove } from "./utils/aiMoves/aiRegularMoves";
import { io } from "socket.io-client";

function App() {
  const turn = useSelector((state) => state.turn);
  const allBoxes = useSelector((state) => state.allBoxes);
  const isKillMove = useSelector((state) => state.isKillMove);
  const playersDetails = useSelector((state) => state.playersDetails);
  const pieceThatMadeLastKill = useSelector(
    (state) => state.pieceThatMadeLastKill
  );
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const socket = io("http://localhost:8000");
  //   dispatch(setSocket(socket));
  //   socket.on("connect", () => {
  //     console.log("connected");
  //   });
  // }, []);

  useEffect(() => {
    socket.on("gameState", (state) => {
      dispatch(setGameState(state));
      // gameState = state;
      // console.log("state is", state);
    });
  });

  // useEffect(() => {
  // if (
  //   playersDetails.player2Color === turn &&
  //   playersDetails.player2 !== "HUMAN"
  // )
  //   return;
  // // console.log("entered turn effect");
  // const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
  // if (!pieceExist) return;
  // const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
  // // console.log("boxes with pieceThatMustKill", boxes);
  // const pieces = boxes.map((box) => box.piece);
  // dispatch(setPiecesThatMustKill(pieces));
  // }, [turn]);

  // useEffect(() => {
  //   if (
  //     playersDetails.player2 === "CPU" &&
  //     turn === playersDetails.player2Color
  //   ) {
  //     const aiBestMove = calculateMove(allBoxes, turn);
  //     // console.log("aiBestMove", aiBestMove);
  //     setTimeout(() => {
  //       if (aiBestMove.moveType === "REGULAR MOVE")
  //         makeAIRegularMove(aiBestMove.trend[0].box, aiBestMove.trend[0].toBox);
  //       if (aiBestMove.moveType === "REGULAR KILL")
  //         makeAIRegularKill(aiBestMove);
  //     }, 1000);
  //   }
  // }, [turn]);

  // useEffect(() => {
  //   if (allBoxes.length === 100) dispatch(setAllBoxPiece(true));
  // }, [allBoxes]);

  // useEffect(() => {
  // if (!isKillMove || !pieceThatMadeLastKill) return;
  // dispatch(setMoveMade(true));
  // const pieceExist = checkIfPiecesCanKill(allBoxes, turn);
  // if (!pieceExist) {
  //   dispatch(switchTurn());
  //   dispatch(setIsKillMove(false));
  //   dispatch(setPieceThatMadeLastKill(null));
  //   dispatch(setPiecesThatMustKill(null));
  //   return;
  // }
  // const boxes = getBoxesWithPieceThatCanKill(allBoxes, turn);
  // const pieces = boxes.map((box) => box.piece);
  // const pieceIsIn = pieces.some(
  //   (piece) => piece.pieceNumber === pieceThatMadeLastKill.pieceNumber
  // );
  // if (pieceIsIn) {
  //   dispatch(setPiecesThatMustKill([pieceThatMadeLastKill]));
  //   dispatch(setIsKillMove(false));
  //   dispatch(setPieceThatMadeLastKill(null));
  // } else {
  //   dispatch(switchTurn());
  //   dispatch(setIsKillMove(false));
  //   dispatch(setPieceThatMadeLastKill(null));
  // }
  // }, [isKillMove]);

  const makeAIRegularMove = (box, toBox) => {
    const pieceInBox = box.piece;
    pieceInBox.index = toBox.boxNumber;
    box.isFilled = false;
    box.piece = null;
    toBox.isFilled = true;
    toBox.piece = pieceInBox;
    dispatch(updatePiece(pieceInBox));
    dispatch(updateBox(box));
    dispatch(updateBox(toBox));
    dispatch(setPieceThatMovedLast(pieceInBox));
    dispatch(setMoveMade(true));
    dispatch(switchTurn());
  };

  const makeAIRegularKill = (aiBestMove) => {
    // console.log("aiBestMove", aiBestMove);
    const box = aiBestMove.trend[0].box;
    const toBox = aiBestMove.trend[aiBestMove.trend.length - 1].toBox;
    const middleBoxes = getAllMiddleBoxes(aiBestMove.trend, allBoxes);
    updateAllMiddleBoxes(middleBoxes);
    makeAIRegularMove(box, toBox);
  };

  const updateAllMiddleBoxes = (middleBoxes) => {
    // console.log("middleBoxes", middleBoxes);
    middleBoxes.map((box) => {
      const pieceInBox = box.piece;
      pieceInBox.isAlive = false;
      // console.log("pieceInBox", pieceInBox);
      box.isFilled = false;
      box.piece = null;
      dispatch(updatePiece(pieceInBox));
      dispatch(updateBox(box));
    });
  };

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
