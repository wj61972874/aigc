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
import result_bg_a from "@/assets/image/result_bg_a.png";
import result_bg_b from "@/assets/image/result_bg_b.png";
import result_bg_c from "@/assets/image/result_bg_c.png";
import GeneratePanel from "./GeneratePanel";
import classNames from "classnames";
import { get, set } from "idb-keyval";
import { isString } from "lodash";

const RESULT_BG_MAP = {
  A: { imgSrc: result_bg_a, padding: { x: 56, y: 106 } },
  B: { imgSrc: result_bg_b, padding: { x: 56, y: 106 } },
  C: { imgSrc: result_bg_c, padding: { x: 56, y: 106 } },
};

export default function LetterResult() {
  const navigator = useNavigate();

  const resultRef = useRef<HTMLDivElement>();

  const questionAnswer = useRecoilValue(questionState);

  const [letterContents, setLetterContents] = useState<string>("");

  const [progress, setProgress] = useState<number>(0);

  const [timer, setTimer] = useState<any>(null);

  const [generate, setGenerate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const value = await get("generatedImgs");
      setGenerate(value && value.length === 3);
    };

    fetchData();
  }, []);

  const [choosedBg, setChoosedBg] = useState<string>("");

  const [writter, setWritter] = useState<string>("一个默默支持你的粉丝");

  useEffect(() => {
    if (questionAnswer) {
      console.log("questionAnswer----", questionAnswer);
      generateLetter();
      const questionTemplate = questionAnswer.find((i) => i.id === 4);
      setChoosedBg(questionTemplate?.chooseAnswer?.option);
    }
  }, [questionAnswer]);

  const generateLetter = async () => {
    try {
      setProgress(0); // 重置进度为 0
      const _answers = questionAnswer.filter((i) => !!i.promptSort);
      const finalAnswer = orderBy(_answers, ["promptSort"], "desc");
      console.log("发送生成信息----", finalAnswer);
      let info = "";
      finalAnswer.forEach((i, index) => {
        if (i.promptSort) {
          info += `${i?.prePrompt}`;
        }
        if (i.chooseAnswer) {
          info += isString(i.chooseAnswer)
            ? i.chooseAnswer
            : `${i.chooseAnswer.answer}`;
        }
        if (i.sufPrompt) {
          info += `${i?.sufPrompt}`;
        }
        if (index !== finalAnswer.length - 1) {
          info += `,`;
        }
      });
      const _writter = questionAnswer.find((i) => i.id === 8)?.chooseAnswer;
      console.log("发送生成信息----_writter", _writter);
      if (_writter) {
        setWritter(_writter);
      }

      info +=
        "。注意：信件正文后面不需要写信日期，不需要人名落款，不要出现你的名字，不要出现任何提示词，不要出现任何替代字符！";
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
        domtoimage
          .toPng(docEl, {
            height: docEl.offsetHeight,
            width: docEl.offsetWidth,
            scale: 2,
          })
          .then(async function (dataUrl) {
            let _generatedImgs = await get("generatedImgs");

            if (!_generatedImgs) {
              _generatedImgs = [];
            }

            _generatedImgs.push(dataUrl);

            // localStorage.setItem("generatedImgs", JSON.stringify(_generatedImgs));

            setGenerate(true);

            console.log("杰哥测试p----", _generatedImgs);
            set("generatedImgs", _generatedImgs)
              .then(() => console.log("It worked!"))
              .catch((err) => console.log("It failed!", err));
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  //重新生成-在现有问题选择上
  const handleDoGenerateAgain = () => {
    setGenerate(false);
    setProgress(0);
    generateLetter();
  };

  //重新生成-重新选择问题
  // const handleDoGenerateAgain = () => {};

  return (
    <div className={(styles["letter_result"], "w-full h-full bg-[#F7F8FA]")}>
      {!generate ? (
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
              <img
                src={RESULT_BG_MAP[choosedBg]?.imgSrc}
                className="w-full h-full object-fill "
              />
              <div
                className={classNames(
                  styles["letter_text"],
                  `py-[${RESULT_BG_MAP[choosedBg]?.padding?.y}px] px-[${RESULT_BG_MAP[choosedBg]?.padding?.x}px] text-[14px]`
                )}
                dangerouslySetInnerHTML={{
                  __html:
                    letterContents.replace(
                      /\n\n/g,
                      "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                    ) +
                    `<span style="text-align: right; display:inline-block;width:100% ">—— ${writter}</span>`,
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
