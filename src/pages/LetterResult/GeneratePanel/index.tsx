import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import Button from "@/components/Button";
import CHECK_ICON from "@/assets/icon/check_icon.svg";
import LEFT_ICON from "@/assets/icon/left_icon.svg";
import RIGHT_ICON from "@/assets/icon/right_icon.svg";
import { get } from "idb-keyval";
import Modal from "@/components/Modal";
import MODAL_ICON from "@/assets/icon/modal_icon.svg";

export default function GeneratePanel({
  doGenerateAgain,
  doReAnswer,
}: {
  doGenerateAgain: () => void;
  doReAnswer: () => void;
}) {
  const [modalVisable, setModalVisable] = useState<boolean>(false);

  const containerRef = useRef<any>(null);

  const imageRefs = useRef([]);

  const [generatedImgArr, setGeneratedImgArr] = useState<any>([]);

  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);

  useEffect(() => {
    get("generatedImgs").then((value) => {
      setGeneratedImgArr(value);
      setCurrentImgIndex(value.length - 1);
    });
  }, []);

  useEffect(() => {
    console.log("currentImgIndex---change", currentImgIndex, imageRefs);
    if (imageRefs.current[currentImgIndex]) {
      imageRefs.current[currentImgIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentImgIndex, showFullScreen]);

  const handlePrevClick = () => {
    setCurrentImgIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentImgIndex((prevIndex) =>
      Math.min(prevIndex + 1, generatedImgArr.length - 1)
    );
  };

  const handleImageRef = (index, ref) => {
    imageRefs.current[index] = ref;
  };

  const handleComplete = () => {
    setModalVisable(true);
  };
  return (
    <div className={classNames(styles["generate_panel"], "w-full h-full")}>
      {!showFullScreen ? (
        <div className="p-5 h-full">
          {" "}
          <div className={classNames(styles["img_container"])}>
            <div className="h-[76%] relative">
              <div
                className={classNames(
                  styles["main_img"],
                  "w-full overflow-scroll rounded"
                )}
              >
                <img
                  src={generatedImgArr[currentImgIndex]}
                  className="w-full rounded"
                />
              </div>
              <Button
                type="blur"
                className={styles["fullLook_btn"]}
                onClick={() => {
                  setShowFullScreen(true);
                }}
              >
                全屏查看
              </Button>
            </div>

            <div className={classNames(styles["select_body"], "mt-[16px]")}>
              {generatedImgArr.map((item, index) => (
                <div
                  key={index}
                  className={classNames(
                    { [styles["selected_img"]]: currentImgIndex === index },
                    styles["selecte_img"],
                    "rounded relative bor"
                  )}
                  onClick={() => {
                    setCurrentImgIndex(index);
                  }}
                >
                  <img
                    src={item}
                    className={classNames(
                      styles["img_item"],
                      "w-full h-full object-cover rounded"
                    )}
                  />
                  {currentImgIndex === index && (
                    <img src={CHECK_ICON} className="absolute top-1 right-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              className={classNames(
                styles["generate_remind"],
                "text-sm text-center mt-3"
              )}
            >{`总共可生成3次（还剩${3 - generatedImgArr.length}次）`}</div>
            <div className="w-full flex justify-between mt-[10px]">
              <Button
                className={classNames(styles["again_btn"], "mr-3")}
                type="neutral"
                onClick={doReAnswer}
              >
                重新答题
              </Button>
              <Button
                className={classNames(styles["again_btn"], "mr-3")}
                type="neutral"
                onClick={doGenerateAgain}
                disabled={generatedImgArr.length === 3}
              >
                再次生成
              </Button>
              <Button
                className={styles["complete_btn"]}
                onClick={handleComplete}
              >
                完成
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles["full_img_container"]} ref={containerRef}>
          {generatedImgArr.map((item, index) => {
            return (
              <img
                ref={(ref) => handleImageRef(index, ref)}
                src={item}
                key={index}
                className={styles["full_img_item"]}
              />
            );
          })}
          <div className={styles["arrow_btn_left"]} onClick={handlePrevClick}>
            <img src={LEFT_ICON} />
          </div>
          <div className={styles["arrow_btn_right"]} onClick={handleNextClick}>
            <img src={RIGHT_ICON} />
          </div>
          <div className="w-full flex justify-between mt-[10px] fixed bottom-3 px-5">
            <Button
              className={classNames(styles["back_btn"], "mr-3")}
              type="neutral"
              onClick={() => {
                setShowFullScreen(false);
              }}
            >
              返回
            </Button>
            <Button className={styles["complete_btn"]} onClick={handleComplete}>
              完成
            </Button>
          </div>
        </div>
      )}
      <Modal
        open={modalVisable}
        onClose={() => {
          setModalVisable(false);
        }}
      >
        <div className={styles["content"]}>
          <img src={MODAL_ICON} className={styles["modal_icon"]} />
          <div className={styles["title"]}>信件已生成</div>
          <div className={styles["desc"]}>
            您的专属粉丝来信已生成，可长按图片保存或点击领取按钮领取优惠券。
          </div>
          <div className={styles["modal_footer"]}>
            <Button
              type="neutral"
              size="small"
              className={styles["save_btn"]}
              onClick={() => {
                setModalVisable(false);
              }}
            >
              长按原图保存
            </Button>
            {/* <wx-open-launch-weapp
            id="launch-btn"
            username="gh_e37d320dd621"
            path="/pages/index/index"
          >
            <script type="text/wxtag-template">
              <button
                className="btn-launch"
                // style={{ width: '100%', height: '48px', opacity: '0' }}
              >打开小程序</button>
            </script>
          </wx-open-launch-weapp> */}
            <Button
              size="small"
              className={styles["other_btn"]}
              onClick={() => {
                // console.log("杰哥测试----", window.wx);
                // window.wx.miniProgram.navigateTo({
                //   url: `/pages/index/index`,
                // });
                window.location.href = "https://d.weimob.com/d/1_11_pxwbsw";
              }}
            >
              领取专属优惠券
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
