import { apiDoContentCensor, apiGeneratePoem } from "@/services";
import { useEffect, useRef, useState } from "react";
import { hideLoading, showLoading } from "@/utils/loading";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { FANS_LETTER_PROMPTS, FANS_LETTER_QUESTIONS } from "@/contants";
import orderBy from "lodash/orderBy";
import Select from "@/components/Select";
import { IOtherInfo } from "@/interfaces/fansLetter";
import { isEmpty } from "lodash";
import bg01_img from "@/assets/image/letterQues_1.png";
import bg02_img from "@/assets/image/letterQues_2.png";
import bg03_img from "@/assets/image/letterQues_3.png";
import classNames from "classnames";
import Button from "@/components/Button";
import CircularProgressBar from "@/components/CircularProgressBar";
import { useSetRecoilState } from "recoil";
import { questionState } from "@/store/fansLetter";
import { useCanGenerated } from "@/utils/fensLetter";
import { clear } from "idb-keyval";

export default function LetterQuestionPage() {
  const navigator = useNavigate();

  const questionRefs = useRef([]);

  const [answers, setAnswers] = useState<any>([]);

  const setQuestionState = useSetRecoilState(questionState);

  const [letterContents, setLetterContents] = useState<string>("");

  const [isAnimated, setIsAnimated] = useState(false);

  const [otherInfo, setOtherInfo] = useState<IOtherInfo>({});

  const [contentCheckError, setContentCheckError] = useState<IOtherInfo>(null);

  const [unAnsweredQuestions, setUnAnsweredQuestions] = useState<any[]>([]);

  if (useCanGenerated()) {
    navigator("/letterResult");
  }

  // useEffect(() => {
  //   clearGeneratedResult();
  // }, []);

  // //进入页面清除缓存
  // const clearGeneratedResult = async () => {
  //   await clear();
  // };

  useEffect(() => {
    if (letterContents) {
      const timeout = setTimeout(() => {
        setIsAnimated(true); // 在组件挂载后延迟一段时间来激活动画
      }, 500); // 延迟时间可以根据需要调整

      return () => clearTimeout(timeout); // 清除定时器，防止在组件卸载后仍然执行
    } else {
      setIsAnimated(false);
    }
  }, [letterContents]); // 空依赖数组确保只运行一次

  const handleSetChoose = (item, choose) => {
    setUnAnsweredQuestions((preData) => {
      const _newData = preData.filter((i) => i.id !== item.id);
      return _newData;
    });
    const _answers = [...answers];
    if (_answers.some((i) => i.id === item.id)) {
      //如果_answers有item.id,则覆盖
      _answers.forEach((i, index) => {
        if (i.id === item.id) {
          _answers[index] = { ...item, chooseAnswer: choose };
        }
      });
    } else {
      _answers.push({ ...item, chooseAnswer: choose });
    }

    setAnswers(_answers);
  };

  const checkRequiredQuestions = (): any[] => {
    const alreadyAnsweredId: any[] = answers.map((i) => i.id);
    console.log("checkRequiredQuestions----111", answers);
    const unAnsweredQuestions = FANS_LETTER_QUESTIONS.filter(
      (i) => !alreadyAnsweredId.includes(i.id) && i.require
    );

    return unAnsweredQuestions;
  };

  const preSubmitAndCheck = async () => {
    const unAnsweredQuestions = checkRequiredQuestions();
    console.log("checkRequiredQuestions----222", unAnsweredQuestions);
    setUnAnsweredQuestions(unAnsweredQuestions);
    if (unAnsweredQuestions.length) {
      const anchorId = unAnsweredQuestions[0].id;
      if (questionRefs.current[anchorId]) {
        questionRefs.current[anchorId].scrollIntoView({
          behavior: "smooth",
        });
      }
      return;
    }

    showLoading();
    setQuestionState(answers);

    try {
      const requests = Object.values(otherInfo)
        .map((value) => {
          if (value) {
            const checkData = {
              text: value,
            };
            return apiDoContentCensor(checkData);
          }
        })
        .filter((i) => !!i);
      const checkRes = await Promise.all(requests);
      let error: any = {};
      Object.keys(otherInfo).forEach((key, index) => {
        if (checkRes[index].conclusionType === 2) {
          error[key] = checkRes[index].conclusion;
        }
      });
      setContentCheckError(error);
      console.log("apiDoContentCensor----", checkRes, error);
      if (!isEmpty(error)) {
        hideLoading();
        return;
      }

      hideLoading();
      navigator("/letterResult");
    } catch (e) {
      console.log("preResolvePrompts----222", e);
      hideLoading();
    }
  };

  const renderAnswerPenal = (item) => {
    switch (item.componentType) {
      case "select":
        return (
          <div>
            {item.answers.map((i) => {
              const curChoosedQues = answers.find((i) => i.id === item.id);

              let isChoosed = false;
              if (curChoosedQues) {
                isChoosed = curChoosedQues.chooseAnswer.option === i.option;
              }

              return (
                <div
                  onClick={() => {
                    handleSetChoose(item, i);
                  }}
                  className={classNames(
                    { [styles["choosed_question"]]: isChoosed },
                    "text-sm text-[#987553] mt-3 p-2 rounded-lg border-[1px] border-[#E4D7C9]"
                  )}
                  style={{ lineHeight: "normal" }}
                >
                  {i.option}：{i.answer}
                  {/* {isChoosed && <span>√</span>} */}
                </div>
              );
            })}
          </div>
        );
      case "textarea":
        return (
          <>
            <div className="relative">
              <textarea
                className={styles["cus_textarea"]}
                maxLength={item.maxLength}
                value={otherInfo?.otherContent}
                placeholder="请输入想说的话，限30字"
                onChange={(e) => {
                  setOtherInfo({ ...otherInfo, otherContent: e.target.value });
                  handleSetChoose(item, e.target.value);
                }}
              />
              <span className={styles["max_number"]}>
                {otherInfo?.otherContent?.length || 0} / {item.maxLength}
              </span>
            </div>

            {contentCheckError?.otherContent && (
              <span style={{ color: "red" }}>
                {contentCheckError.otherContent}
              </span>
            )}
          </>
        );
      case "options":
        return (
          <Select
            options={item.answers}
            style={{ width: "100%" }}
            onChange={(value) => {
              handleSetChoose(item, value);
            }}
          />
        );
      default:
        return (
          <>
            <input
              type="text"
              className={styles["cus_input"]}
              maxLength={item.maxLength}
              value={otherInfo?.byName}
              placeholder="请输入名称，限10字"
              onChange={(e) => {
                setOtherInfo({
                  ...otherInfo,
                  byName: e.target.value,
                });
                handleSetChoose(item, e.target.value);
              }}
            />
            {contentCheckError?.byName && (
              <span style={{ color: "red" }}>{contentCheckError.byName}</span>
            )}
          </>
        );
    }
  };

  return (
    <div
      style={{
        background: `linear-gradient(181deg, #E7D8B2 0.75%, #F2E8CE 17.61%, #E6D5AA 33.58%, #F0EADB 51.94%, #E8D7AC 67.96%, #F2E5C3 82.92%, #FAF1E4 99.18%)`,
      }}
    >
      <div
        className={classNames(styles["letter_question"], "w-screen h-fit")}
        style={{
          background: `url(${bg02_img})`,
          backgroundRepeat: "no-repeat",
          // backgroundSize: "contain",
          backgroundSize: "89% auto",
          backgroundPosition: "top right",
        }}
      >
        <div className="relative">
          <img src={bg01_img} className="absolute z-[3]" />

          <img
            src={bg03_img}
            className={classNames(styles["bg_2_3"], "absolute right-0 z-[2]")}
          />
        </div>

        {!letterContents ? (
          <>
            <div className={styles["question_body"]}>
              {FANS_LETTER_QUESTIONS.map((item, index) => {
                return (
                  <div
                    key={index}
                    id={`Q${index + 1}`}
                    ref={(el) => (questionRefs.current[index + 1] = el)}
                    className={classNames(
                      {
                        [styles["question_item_error"]]:
                          !!unAnsweredQuestions.find((i) => i.id === item.id),
                      },
                      styles["question_item"]
                    )}
                  >
                    <div className="text-[34px] text-[#940A0A]">
                      Q{`${index + 1}`}
                    </div>
                    <div className={styles["divide_line"]} />
                    <div className="text-base text-[#936E43] font-medium mb-3">
                      {item.question}
                    </div>
                    {renderAnswerPenal(item)}
                  </div>
                );
              })}
              <Button onClick={preSubmitAndCheck} className="w-full">
                生成信件
              </Button>
            </div>
          </>
        ) : (
          <div
            className={`text-xl mt-6 leading-loose fade-in-from-bottom bg-no-repeat bg-cover m-6 text-[#ffffff] ${
              isAnimated ? "active" : ""
            } ${styles["content_body"]}`} // 根据状态添加 'active' 类来触发过渡效果
          >
            <div
              className=""
              dangerouslySetInnerHTML={{
                __html: letterContents.replace(/\n/g, "<br>"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
