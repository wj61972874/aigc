import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function AboutPage() {
  const navigator = useNavigate();
  const [generatedImage, setGeneratedImage] = useState("");
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const [prompts, setPrompts] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const getTouchPos = (canvas, touchEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      isDrawing.current = true;
      let pos;
      if (e.touches) {
        pos = getTouchPos(canvasRef.current, e);
        e.preventDefault(); // 阻止默认的触摸滚动行为
      } else {
        pos = { x: e.offsetX, y: e.offsetY };
      }
      lastX.current = pos.x;
      lastY.current = pos.y;
    };

    const draw = (e) => {
      if (!isDrawing.current) return;
      let pos;
      if (e.touches) {
        pos = getTouchPos(canvasRef.current, e);
        e.preventDefault(); // 阻止默认的触摸滚动行为
      } else {
        pos = { x: e.offsetX, y: e.offsetY };
      }

      const context = canvasRef.current.getContext("2d");
      context.lineWidth = 5;
      context.lineCap = "round";
      context.strokeStyle = "black";

      context.beginPath();
      context.moveTo(lastX.current, lastY.current);
      context.lineTo(pos.x, pos.y);
      context.stroke();

      lastX.current = pos.x;
      lastY.current = pos.y;
    };
    const stopDrawing = () => {
      isDrawing.current = false;
    };

    // 添加鼠标事件监听器
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // 添加触摸事件监听器
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    // 移除事件监听器的清理函数
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
      canvas.removeEventListener("touchcancel", stopDrawing);
    };
  }, []);

  function saveCanvas() {
    console.log("saveCanvas");
    // 将Canvas内容转换为Blob对象
    canvasRef.current.toBlob(function (blob) {
      // 创建一个新的File对象
      const file = new File([blob], "canvas_image.png", {
        type: "image/png",
      });
      // 创建一个FormData对象
      const engineId = "stable-diffusion-v1-6";
      const apiHost = "https://api.stability.ai";
      const apiKey = "sk-QSNQStsTBe04obyWhYcnafzBmu8U501g64DL6XWWYMK578QL";

      if (!apiKey) throw new Error("Missing Stability API key.");

      // NOTE: This example is using a NodeJS FormData library.
      // Browsers should use their native FormData class.
      // React Native apps should also use their native FormData class.
      const formData = new FormData();
      formData.append("init_image", file);
      formData.append("init_image_mode", "IMAGE_STRENGTH");
      formData.append("text_prompts[0][text]", prompts);
      formData.append("image_strength", "0.35");
      formData.append("cfg_scale", "7");
      formData.append("samples", "1");
      formData.append("steps", "30");
      formData.append("style_preset", "cinematic");

      // 调用API接口
      fetch(`${apiHost}/v1/generation/${engineId}/image-to-image`, {
        method: "POST",
        headers: {
          // ...formData.getHeaders(),
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((buffer) => {
          setGeneratedImage(
            `data:image/png;base64,${buffer.artifacts[0].base64}`
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, "image/png");
  }

  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage:
          "url(https://static.ws.126.net/163/f2e/news/2019_poem/static/images/loading_bg.40a0a4a.jpg)",
      }}
    >
      <div className="text-2xl p-4 text-center">玩一玩涂鸦生图</div>
      <button
        className="p-2 bg-orange-300 rounded-lg"
        onClick={() => {
          navigator("/");
        }}
      >
        切换页面
      </button>
      <div className="w-full flex justify-center">
        <canvas ref={canvasRef} id="drawing-board" width="360" height="360" />
      </div>
      <div>涂鸦描述</div>
      <input
        className="w-80 p-2 border-2 border-gray-300 rounded-md"
        type="text"
        value={prompts}
        onChange={(e) => setPrompts(e.target.value)}
      />
      <button className="p-2 bg-orange-300 rounded-lg" onClick={saveCanvas}>
        生成图片
      </button>
      {generatedImage && (
        <img
          id="saved-image"
          src={generatedImage}
          alt="Saved Canvas Image"
          className="block mt-10 border-1 border-indigo-500/50"
        />
      )}
    </div>
  );
}
