import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Components
import Home from "./Home";
import Calculator from "./Calculator";

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
              <Link to="/calc">Calculator</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calc" element={<Calculator />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
