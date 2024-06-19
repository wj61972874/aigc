import { apiGeneratePoem } from "@/services";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import {
  FANS_LETTER_PROMPTS,
  RESULT_BG_MAP,
  RESULT_PERSON_MAP,
  TONE_FOR_NAME,
} from "@/contants";
import orderBy from "lodash/orderBy";
import domtoimage from "dom-to-image";
import Button from "@/components/Button";
import CircularProgressBar from "@/components/CircularProgressBar";
import { useRecoilValue } from "recoil";
import { questionState } from "@/store/fansLetter";
import MAINLOGO_ICON from "@/assets/icon/mianLogo.svg";
import WRITEICON from "@/assets/icon/write_icon.png";
import GeneratePanel from "./GeneratePanel";
import classNames from "classnames";
import { clear, get, set } from "idb-keyval";
import { isString } from "lodash";

// const RESULT_BG_MAP = {
//   A: { imgSrc: result_bg_a, padding: { x: 56, y: 106 } },
//   B: { imgSrc: result_bg_b, padding: { x: 56, y: 106 } },
//   C: { imgSrc: result_bg_c, padding: { x: 56, y: 106 } },
// };

export default function LetterResult() {
  const navigator = useNavigate();

  const resultRef = useRef<HTMLDivElement>();

  const questionAnswer = useRecoilValue(questionState);

  const [letterContents, setLetterContents] = useState<string>("");

  const [progress, setProgress] = useState<number>(0);

  const [timer, setTimer] = useState<any>(null);

  const [generate, setGenerate] = useState<boolean>(false);

  const [loadingText, setLoadingText] = useState<string>("生成中...");

  useEffect(() => {
    const fetchData = async () => {
      const value = await get("generatedImgs");
      setGenerate(value && value.length === 3);
    };

    fetchData();
  }, []);

  const [choosedBg, setChoosedBg] = useState<string>("");
  const [choosedPerson, setChoosedPerson] = useState<string>("");

  const [writter, setWritter] = useState<string>("一个默默支持你的粉丝");

  useEffect(() => {
    if (questionAnswer) {
      console.log("questionAnswer----", questionAnswer);
      generateLetter();
      const questionPerson = questionAnswer.find((i) => i.id === 2);
      const questionTemplate = questionAnswer.find((i) => i.id === 4);

      setChoosedBg(questionTemplate?.chooseAnswer?.option);
      setChoosedPerson(questionPerson?.chooseAnswer?.option);
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

      // info +=
      //   "。第一次观看话剧时间和最喜欢的话剧并无关联。祝福语希望能提到感谢或者祝福刘岩和白兰氏这个品牌";
      info += "，祝福语希望能感谢或者祝福刘岩和白兰氏这个品牌";

      const questionTone = questionAnswer.find((i) => i.id === 3);

      const letterName = `信件的称谓用${
        TONE_FOR_NAME[questionTone?.chooseAnswer?.option]
      }`;

      const preMessages = FANS_LETTER_PROMPTS.replace("{writter}", writter);

      const messages = `${preMessages},${letterName},${info}`;
      const data = {
        type: 2,
        messages,
      };
      // 启动定时器，每 500 毫秒更新一次进度
      const progressTimer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress === 99) {
            setLoadingText("网络速度缓慢，请稍等或刷新页面重新生成");
          }
          return newProgress > 99 ? 99 : newProgress;
        });
      }, 150);
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

  //重新选择问题
  const handleReAnswer = async () => {
    await clear();
    navigator("/letterQuestion");
  };

  return (
    <div className={(styles["letter_result"], "w-full h-full bg-[#F7F8FA]")}>
      {!generate ? (
        <div>
          <div
            style={{
              backgroundImage: `url(${require("@/assets/image/loading_bg.svg")})`,
              backgroundPosition: "center bottom",
              height: "100vh",
            }}
          >
            <img src={MAINLOGO_ICON} className="fixed top-6 left-4" />
            <div className="h-full w-full flex flex-col items-center absolute z-10">
              <CircularProgressBar
                progress={progress}
                size={300}
                strokeWidth={4}
                circleColor="#EF6F6F"
                backgroundColor="#EEDFCD"
                className={"mt-40"}
              >
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      color: "#936E43",
                      fontSize: "60px",
                      lineHeight: "normal",
                    }}
                  >
                    {progress}%
                  </div>
                  <img src={WRITEICON} className="w-[140px]" />
                  <div className="text-base text-[#936E43] font-medium mt-4 text-center max-w-[175px]">
                    {loadingText}
                  </div>
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
          </div>

          {letterContents && (
            <div className="relative">
              <div className="relative w-[375px] h-[730px]" ref={resultRef}>
                <img
                  src={RESULT_BG_MAP[choosedBg]?.imgSrc}
                  className="w-full h-full object-fill"
                />
                <img
                  src={RESULT_PERSON_MAP[choosedPerson]?.imgSrc}
                  className="w-[64%] object-cover absolute bottom-0 left-0"
                />

                <div
                  className={classNames(
                    styles["letter_text"],
                    `py-[106px] px-[56px] text-[14px]`
                  )}
                  dangerouslySetInnerHTML={{
                    __html:
                      letterContents
                        .replace(/\n\n——.*$/, "")
                        .replace(
                          /\n\n/g,
                          "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                        ) +
                      `<span style="text-align: right; display:inline-block;width:100% ">—— ${writter}</span>`,
                  }}
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-[#F7F8FA]" />
            </div>
          )}
        </div>
      ) : (
        <GeneratePanel
          doGenerateAgain={handleDoGenerateAgain}
          doReAnswer={handleReAnswer}
        />
      )}
    </div>
  );
}
