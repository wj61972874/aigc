import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import FansLetter from "./pages/FansLetter";
import FansLetterRule from "./pages/FansLetterRule";
import LetterQuestion from "./pages/LetterQuestion";
import LetterResult from "./pages/LetterResult";
import Test from "./pages/Test";
import wx from "./utils/wx";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fansLetter" element={<FansLetter />} />
      <Route path="/fansLetterRule" element={<FansLetterRule />} />
      <Route path="/letterQuestion" element={<LetterQuestion />} />
      <Route path="/letterResult" element={<LetterResult />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default App;
