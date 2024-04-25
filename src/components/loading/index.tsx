import { useImperativeHandle, useRef } from "react";

export default function loading() {
  return (
    <div className="load-view">
      <div className="load-an-view">
        <div className="load-circle">
          <div className="load-container load-container1">
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="circle3"></div>
            <div className="circle4"></div>
          </div>
          <div className="load-container load-container2">
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="circle3"></div>
            <div className="circle4"></div>
          </div>
          <div className="load-container load-container3">
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="circle3"></div>
            <div className="circle4"></div>
          </div>
        </div>
      </div>
      <div className="load-tip">加载中...</div>
    </div>
  );
}
