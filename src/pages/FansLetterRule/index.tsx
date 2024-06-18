import RULE_BG from "@/assets/image/rule_bg.png";
import RULEDATA from "@/contants/rule.json";
import MAINLOGO_ICON from "@/assets/icon/logo.svg";
import styles from "./index.module.scss";

export default function LetterRulePage() {
  return (
    <div className={styles["rule_page"]}>
      <img src={MAINLOGO_ICON} className="absolute top-4 left-4" />
      <img src={RULE_BG} className="w-full object-contain" />
      <div className="py-4 px-10">
        <div className="text-sm font-semibold text-center mb-3">
          {RULEDATA.title}
        </div>
        <div className="text-xs mb-3">{RULEDATA.desc}</div>
        <div>
          {RULEDATA.rules.map((ruleItem, index) => (
            <div key={index} className="mb-3">
              <div className="text-xs font-semibold mb-3">{ruleItem.title}</div>
              <div className="mb-3">
                {ruleItem.items.map((detail, idx) => (
                  <div key={idx} className="text-xs mb-3">
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
