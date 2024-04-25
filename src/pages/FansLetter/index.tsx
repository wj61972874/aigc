import { apiGeneratePoem } from "@/services";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/utils/loading";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { FANS_LETTER_PROMPTS, FANS_LETTER_QUESTIONS } from "@/contants";
import orderBy from "lodash/orderBy";

export default function LetterPage() {
  const [answers, setAnswers] = useState<any>([]);

  const [letterContents, setLetterContents] = useState<string>("");

  const [isAnimated, setIsAnimated] = useState(false);

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

  const preResolvePrompts = async () => {
    showLoading();
    const _answers = answers.filter((i) => !!i.promptSort);
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
    console.log("preResolvePrompts----222", info);
    const data = {
      type: 2,
      messages,
    };

    try {
      const res = await apiGeneratePoem(data);
      setLetterContents(res.result);
      hideLoading();
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
                >
                  {i.option}：{i.answer}
                  {isChoosed && <span>√</span>}
                </div>
              );
            })}
          </div>
        );
      case "textarea":
        return (
          <textarea
            className={styles["cus_textarea"]}
            maxLength={item.maxLength}
          />
        );
      case "options":
        return (
          <div>
            {item.answers.map((i) => (
              <div>{i.value}</div>
            ))}
          </div>
        );
      default:
        return (
          <input
            type="text"
            className={styles["cus_input"]}
            maxLength={item.maxLength}
          />
        );
    }
  };

  const backgroundImage = letterContents
    ? "https://images.unsplash.com/photo-1708710301741-bc45608e51b1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxNDA0MjUwMg&ixlib=rb-4.0.3&q=80&w=375"
    : "https://static.ws.126.net/163/f2e/news/2019_poem/static/images/loading_bg.40a0a4a.jpg";

  return (
    <div
      className="w-screen h-screen "
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="text-2xl p-4">粉丝信件生成</div>
      {!letterContents ? (
        <>
          <div className={styles["question_body"]}>
            {FANS_LETTER_QUESTIONS.map((item, index) => {
              return (
                <div key={index} className={styles["question_item"]}>
                  <div className={styles["item_title"]}>{item.question}</div>
                  {renderAnswerPenal(item)}
                </div>
              );
            })}
          </div>
          <div className="w-full flex justify-center pb-12">
            <button
              className="p-2 bg-orange-300 rounded-lg"
              onClick={preResolvePrompts}
            >
              生成信件
            </button>
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
  );
}
