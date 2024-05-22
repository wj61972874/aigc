import result_bg from "@/assets/image/letterRes_bg.png";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import domtoimage from "dom-to-image";

export default function TestPage() {
  const resultRef = useRef<HTMLDivElement>();
  const [image, setImage] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = result_bg;
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (isImageLoaded) {
      setTimeout(() => {
        doHtmlToCanvas();
      }, 300);
    }
  }, [isImageLoaded]);

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
        setImage(dataUrl);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  return (
    <>
      {!image ? (
        <div className="relative w-[375px] h-[730px]" ref={resultRef}>
          <img src={result_bg} className="w-full h-full object-fill " />
          <div
            className={classNames(
              styles["letter_text"],
              "py-[90px] px-[50px] text-[14px]"
            )}
          >
            杰哥测试
          </div>
        </div>
      ) : (
        <img src={image} />
      )}
    </>
  );
}
