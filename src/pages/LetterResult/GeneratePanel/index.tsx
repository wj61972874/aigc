import { useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import Button from "@/components/Button";

export default function GeneratePanel() {
  const generatedImgArr = JSON.parse(localStorage.getItem("generatedImgs"));

  const [currentImg, setCurrentImg] = useState<string>(generatedImgArr[0]);

  return (
    <div className={classNames(styles["generate_panel"], "p-5 w-full h-full")}>
      <div className={classNames(styles["img_container"])}>
        <div
          className={classNames(
            styles["main_img"],
            "w-full overflow-scroll rounded"
          )}
        >
          <img src={currentImg} className="w-full rounded" />
        </div>
        <div className={classNames(styles["select_body"], "mt-[16px]")}>
          {generatedImgArr.map((item, index) => (
            <div key={index} className="rounded">
              <img src={item} className="w-full h-full object-cover rounded" />
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
          <Button className="mr-3 w-[50%]" type="neutral">
            再次生成
          </Button>
          <Button className="w-[50%]">完成</Button>
        </div>
      </div>
    </div>
  );
}
