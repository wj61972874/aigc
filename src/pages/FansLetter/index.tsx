import { apiDoContentCensor, apiGeneratePoem } from "@/services";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/utils/loading";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { FANS_LETTER_PROMPTS, FANS_LETTER_QUESTIONS } from "@/contants";
import orderBy from "lodash/orderBy";
import Select from "@/components/Select";
import { IOtherInfo } from "@/interfaces/fansLetter";
import { isEmpty } from "lodash";
import Button from "@/components/Button";
import { useCanGenerated } from "@/utils/fensLetter";
import { clear } from "idb-keyval";
import Checkbox from "@/components/Checkbox";
import classnames from "classnames";

export default function LetterPage() {
  const navigator = useNavigate();

  const [ruleCheck, setRuleCheck] = useState<boolean>(true);

  const [shake, setShake] = useState(false); // 控制抖动

  useEffect(() => {
    // console.log("useCanGenerated()--", useCanGenerated());
    clearGeneratedResult();
  }, []);

  //进入页面清除缓存
  const clearGeneratedResult = async () => {
    await clear();
  };

  //进入活动细则页面
  const goToAvtiveRulePage = () => {
    navigator("/fansLetterRule");
  };

  return (
    <div
      className={styles["fans_letter"]}
      style={{
        backgroundImage: `url(${require("@/assets/image/fansLetter_bg.png")})`,
      }}
    >
      <Button
        className={styles["do_letter_btn"]}
        onClick={() => {
          console.log("----ruleCheck---", ruleCheck);
          if (!ruleCheck) {
            setShake(true);
            setTimeout(() => {
              setShake(false);
            }, 1500);
            return;
          }
          navigator("/letterQuestion");
        }}
      >
        给刘岩写信
      </Button>
      <div className={styles["rule_details_check"]}>
        <Checkbox
          className={classnames({
            [styles.protocol]: true,
            [styles.shake]: shake,
          })}
          checked={ruleCheck}
          onChange={() => {
            setRuleCheck((preValue) => !preValue);
          }}
          label={
            <div>
              您已默认并同意此
              <span className="underline" onClick={goToAvtiveRulePage}>
                《活动详情细则》
              </span>
            </div>
          }
          name="termsCheckbox"
        />
      </div>
    </div>
  );
}
