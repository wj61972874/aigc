import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import FansLetter from "./pages/FansLetter";
import LetterQuestion from "./pages/LetterQuestion";
import LetterResult from "./pages/LetterResult";
import Test from "./pages/Test";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fansLetter" element={<FansLetter />} />
      <Route path="/letterQuestion" element={<LetterQuestion />} />
      <Route path="/letterResult" element={<LetterResult />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default App;
