import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import FansLetter from "./pages/FansLetter";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fansLetter" element={<FansLetter />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
};

export default App;
