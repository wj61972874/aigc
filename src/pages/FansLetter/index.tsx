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

export default function LetterPage() {
  const navigator = useNavigate();
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
          navigator("/letterQuestion");
        }}
      >
        给刘岩写信
      </Button>
    </div>
  );
}
