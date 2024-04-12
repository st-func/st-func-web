import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Components
import Home from "./Home";
import SecProperty from "./SecProperty";

const App: React.FC = () => {
  return (
    <Router basename="/st-func-web">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/section">断面性能計算</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section" element={<SecProperty />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
