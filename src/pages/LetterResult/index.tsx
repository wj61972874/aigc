import { apiGeneratePoem } from "@/services";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { FANS_LETTER_PROMPTS } from "@/contants";
import orderBy from "lodash/orderBy";
import domtoimage from "dom-to-image";
import Button from "@/components/Button";
import CircularProgressBar from "@/components/CircularProgressBar";
import { useRecoilValue } from "recoil";
import { questionState } from "@/store/fansLetter";
import result_bg from "@/assets/image/letterRes_bg.png";
import GeneratePanel from "./GeneratePanel";
import classNames from "classnames";
import { get, set } from "idb-keyval";

export default function LetterResult() {
  const navigator = useNavigate();

  const resultRef = useRef<HTMLDivElement>();

  const questionAnswer = useRecoilValue(questionState);

  const [letterContents, setLetterContents] = useState<string>("");

  const [progress, setProgress] = useState<number>(0);

  const [timer, setTimer] = useState<any>(null);

  const [image, setimage] = useState<string>("");

  useEffect(() => {
    if (questionAnswer) {
      generateLetter();
    }
  }, [questionAnswer]);

  const generateLetter = async () => {
    try {
      setProgress(0); // 重置进度为 0
      const _answers = questionAnswer.filter((i) => !!i.promptSort);
      const finalAnswer = orderBy(_answers, ["promptSort"], "desc");
      let info = "";
      finalAnswer.forEach((i, index) => {
        if (i.promptSort) {
          info += `${i?.prePrompt}`;
        }
        if (i.chooseAnswer.answer) {
          info += `${i.chooseAnswer.answer}`;
        }
        if (i.sufPrompt) {
          info += `${i?.sufPrompt}`;
        }
        if (index !== finalAnswer.length - 1) {
          info += `,`;
        }
      });
      const messages = `${FANS_LETTER_PROMPTS},${info}`;
      const data = {
        type: 2,
        messages,
      };
      // 启动定时器，每 500 毫秒更新一次进度
      const progressTimer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 200);
      setTimer(progressTimer);
      const res = await apiGeneratePoem(data);
      setLetterContents(res.result);
      setProgress(100); // 请求完成，设置进度为 100%
      clearInterval(progressTimer); // 清除定时器
      setTimeout(() => {
        doHtmlToCanvas();
      }, 500);
    } catch (err) {
      console.log("generateLetter--err-", err);
    }
  };

  useEffect(() => {
    // 组件卸载时清除定时器
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  // 生成图片
  const doHtmlToCanvas = () => {
    const docEl = resultRef.current;
    domtoimage
      .toPng(docEl, {
        height: docEl.offsetHeight,
        width: docEl.offsetWidth,
        scale: 2,
      })
      .then(async function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;

        let _generatedImgs = await get("generatedImgs");

        if (!_generatedImgs) {
          _generatedImgs = [];
        }

        _generatedImgs.push(dataUrl);

        // localStorage.setItem("generatedImgs", JSON.stringify(_generatedImgs));

        setimage(dataUrl);

        console.log("杰哥测试p----", _generatedImgs);
        set("generatedImgs", _generatedImgs)
          .then(() => console.log("It worked!"))
          .catch((err) => console.log("It failed!", err));
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  //重新生成-在现有问题选择上
  const handleDoGenerateAgain = () => {
    setimage("");
    setProgress(0);
    generateLetter();
  };

  //重新生成-重新选择问题
  // const handleDoGenerateAgain = () => {};

  return (
    <div className={(styles["letter_result"], "w-full h-full bg-[#F7F8FA]")}>
      {!image ? (
        <>
          <div className="h-full w-full flex flex-col items-center absolute z-10">
            <CircularProgressBar
              progress={progress}
              size={300}
              strokeWidth={4}
              circleColor="#EF6F6F"
              backgroundColor="#EEDFCD"
              className={"mt-40"}
            >
              <div
                style={{
                  color: "#333",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {progress}%
              </div>
            </CircularProgressBar>
            <Button
              className={(styles["do_letter_btn"], "absolute bottom-7")}
              onClick={() => {
                navigator("/letterQuestion");
              }}
            >
              停止并返回
            </Button>
          </div>
          <div className="relative">
            <div className="relative w-[375px] h-[730px]" ref={resultRef}>
              <img src={result_bg} className="w-full h-full object-fill " />
              <div
                className={classNames(
                  styles["letter_text"],
                  "py-[90px] px-[50px] text-[14px]"
                )}
                dangerouslySetInnerHTML={{
                  __html: letterContents.replace(/\n/g, "<br>"),
                }}
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[#F7F8FA]" />
          </div>
        </>
      ) : (
        <GeneratePanel doGenerateAgain={handleDoGenerateAgain} />
      )}
    </div>
  );
}
