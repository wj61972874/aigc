import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./index.module.scss"; // 引入样式文件

const Select = ({ options, style, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  const handleDocumentClick = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option?.value);
  };

  return (
    <div
      ref={selectRef}
      className={styles["select-container"]}
      style={style}
      onClick={handleToggle}
    >
      <div className={styles["select-selected"]}>
        {selectedOption ? selectedOption.label : "请选择"}
        <span className={styles["select-arrow"]}>&#x25BC;</span>
      </div>
      <div
        className={classNames(styles["select-items"], {
          [styles["select-items_opened"]]: isOpen,
        })}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={styles["select-item"]}
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
};

export default Select;
