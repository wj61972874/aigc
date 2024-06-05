import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import CLOSE_ICON from "@/assets/icon/close_icon.svg";
import styles from "./index.module.scss";

interface IModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = forwardRef((props: IModalProps, ref) => {
  const { title, open, children, onClose } = props;

  return (
    <>
      {/* {open && ( */}
      <div
        className={`${styles["modal-overlay"]} ${
          open ? styles["modal-overlay_show"] : ""
        }`}
      >
        <div
          className={`${styles["modal-content"]} ${
            open ? styles["modal-content_show"] : ""
          }`}
        >
          <div className={styles["modal-warp"]}>
            {title && <div className={styles["modal-header"]}>{title}</div>}

            <div className={styles["modal-body"]}>{children}</div>
            <img
              src={CLOSE_ICON}
              className={styles["close_icon"]}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
});
export default Modal;
