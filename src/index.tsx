import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { RecoilRoot } from "recoil";
import wx from "./utils/wx";

// 初始化微信 JS-SDK
// wx.init(() => {
//   // 完成初始化后的回调函数
//   ReactDOM.render(
//     <Router>
//       <RecoilRoot>
//         <App />
//       </RecoilRoot>
//     </Router>,
//     document.getElementById("app")
//   );
// });

ReactDOM.render(
  <Router>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Router>,
  document.getElementById("app")
);


