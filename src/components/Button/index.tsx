import classNames from "classnames";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";

interface IButtonProps {
  type?: "paimary" | "neutral";
  size?: "large" | "default" | "small";
  className?: string;
  onClick?: (e) => void;
  children: React.ReactNode | string;
}

export default function Button({
  type = "paimary",
  size = "default",
  className,
  onClick,
  children,
}: IButtonProps) {
  const [buttonTypeStyles, setButtonTypeStyles] = useState<string>("");

  useEffect(() => {
    console.log(type);
    handleSetStylesByType(type);
  }, [type]);

  //设置按钮type样式
  const handleSetStylesByType = (type: string) => {
    switch (type) {
      case "paimary":
        setButtonTypeStyles(styles["button_primary"]);
        break;
      case "neutral":
        setButtonTypeStyles(styles["button_neutral"]);
        break;
      default:
        setButtonTypeStyles("bg-blue-500 text-white");
        break;
    }
  };

  return (
    <div
      className={classNames(
        styles["cus_button"],
        "w-fit py-3 px-10 text-center",
        buttonTypeStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
