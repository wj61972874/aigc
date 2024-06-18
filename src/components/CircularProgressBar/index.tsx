import React from "react";

interface CircularProgressBarProps {
  progress: number; // 进度值,范围为 0 到 100
  size: number; // 进度条的大小,单位为像素
  strokeWidth: number; // 进度条的宽度,单位为像素
  circleColor: string; // 进度条的颜色
  backgroundColor: string; // 背景圆环的颜色
  children?: React.ReactNode; // 接收自定义的 React 节点
  className?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size,
  strokeWidth,
  circleColor,
  backgroundColor,
  className,
  children,
}) => {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // 旋转背景圆环
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // 旋转进度条
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: size - strokeWidth,
          height: size - strokeWidth,
          backgroundColor: "#ffffff",
          borderRadius: "50%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CircularProgressBar;
