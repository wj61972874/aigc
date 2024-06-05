import classNames from "classnames";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";

interface IButtonProps {
  type?: "paimary" | "neutral" | "blur";
  size?: "large" | "default" | "small";
  className?: string;
  disabled?: boolean;
  onClick?: (e) => void;
  children: React.ReactNode | string;
}

export default function Button({
  type = "paimary",
  size = "default",
  className,
  disabled,
  onClick,
  children,
}: IButtonProps) {
  const [buttonTypeStyles, setButtonTypeStyles] = useState<string>("");
  const [buttonSizeStyles, setButtonSizeStyles] = useState<string>("");

  useEffect(() => {
    console.log(type);
    handleSetStylesByType(type);
  }, [type]);

  useEffect(() => {
    console.log(size);
    handleSetStylesBySize(size);
  }, [size]);

  //设置按钮type样式
  const handleSetStylesByType = (type: string) => {
    switch (type) {
      case "paimary":
        setButtonTypeStyles(styles["button_primary"]);
        break;
      case "neutral":
        setButtonTypeStyles(styles["button_neutral"]);
        break;
      case "blur":
        setButtonTypeStyles(styles["button_blur"]);
        break;
      default:
        setButtonTypeStyles("bg-blue-500 text-white");
        break;
    }
  };

  //设置按钮大小样式
  const handleSetStylesBySize = (size: string) => {
    switch (size) {
      case "large":
        setButtonSizeStyles(styles["button_size_large"]);
        break;
      case "default":
        setButtonSizeStyles(styles["button_size_default"]);
        break;
      case "small":
        setButtonSizeStyles("py-1 px-5 text-[14px]");
        break;
      default:
        setButtonSizeStyles("button_size_default");
        break;
    }
  };

  return (
    <div
      className={classNames(
        { [styles["btn_disabled"]]: disabled },
        styles["cus_button"],
        "w-fit py-3 px-10 text-center",
        buttonTypeStyles,
        buttonSizeStyles,
        className
      )}
      onClick={(e) => {
        if (disabled) return;
        if (onClick) onClick(e);
      }}
    >
      {children}
    </div>
  );
}
