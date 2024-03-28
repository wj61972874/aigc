import { useNavigate } from "react-router-dom";
import styles from "./index.less";
import { apiGeneratePoem } from "@/services";
import { useState } from "react";

export default function HomePage() {
  const [keyWord, setKeyWord] = useState<string>("");

  const generatePoem = async () => {
    try {
      const data = {
        type: 1,
        massages: keyWord,
      };
      const res = await apiGeneratePoem(data);
    } catch (err) {
      console.log(err);
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
    </div>
  );
}
