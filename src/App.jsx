import ISL_To_Text from "./isl-to-text/ISL_To_Text";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Text_To_ISL from "./text-to-isl/Text_To_ISL";
import About from "./About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/isl-to-text" element={<ISL_To_Text />} />
        <Route path="/text-to-isl" element={<Text_To_ISL />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
