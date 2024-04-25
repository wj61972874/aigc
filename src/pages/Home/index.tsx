import "./index.css";
import { apiGeneratePoem } from "@/services";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/utils/loading";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigator = useNavigate();
  const [keyWord, setKeyWord] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [poem, setPoem] = useState<string>("");

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (poem) {
      const timeout = setTimeout(() => {
        setIsAnimated(true); // 在组件挂载后延迟一段时间来激活动画
      }, 500); // 延迟时间可以根据需要调整

      return () => clearTimeout(timeout); // 清除定时器，防止在组件卸载后仍然执行
    } else {
      setIsAnimated(false);
    }
  }, [poem]); // 空依赖数组确保只运行一次

  const generatePoem = async () => {
    showLoading();
    setPoem("");
    try {
      const data = {
        type: 1,
        massages: keyWord,
      };
      const res = await apiGeneratePoem(data);
      setPoem(res.result);
      hideLoading();
      console.log("generatePoem----", res);
    } catch (err) {
      console.log("generatePoem---err", err);
    }
  };
  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage:
          "url(https://static.ws.126.net/163/f2e/news/2019_poem/static/images/loading_bg.40a0a4a.jpg)",
      }}
    >
      <div className="text_test">test</div>
      <div className="text-2xl p-4">藏头诗生成</div>
      <button
        className="p-2 bg-orange-300 rounded-lg"
        onClick={() => {
          navigator("/about");
        }}
      >
        去涂鸦
      </button>
      <div className="text-2xl p-4">输入文字</div>
      <div className="w-full flex justify-center">
        <input
          type="text"
          className="w-80 p-2 border-2 border-gray-300 rounded-md"
          value={keyWord}
          onChange={(event) => {
            setKeyWord(event.target.value);
          }}
        />
        <button className="p-2 bg-orange-300 rounded-lg" onClick={generatePoem}>
          生成藏头诗
        </button>
      </div>
      <div
        className={`text-2xl mt-6 leading-loose text-center fade-in-from-bottom ${
          isAnimated ? "active" : ""
        }`} // 根据状态添加 'active' 类来触发过渡效果
        dangerouslySetInnerHTML={{ __html: poem.replace(/\n/g, "<br>") }}
      />
    </div>
  );
}
