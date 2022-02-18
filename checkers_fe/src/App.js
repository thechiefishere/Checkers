import "./App.css";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
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
