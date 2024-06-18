import classNames from "classnames";
import GOU_ICON from "@/assets/icon/gou_icon.svg";
import styles from "./index.module.scss";

// Checkbox组件接受checked和onChange等props
const Checkbox = ({ checked, onChange, label, name, className, ...props }) => {
  return (
    <label
      className={classNames("flex justify-center items-center", className)}
      onClick={onChange}
    >
      {checked ? (
        <img src={GOU_ICON} className={styles["checked_status"]} />
      ) : (
        <div className={styles["unchecked_status"]} />
      )}
      <span className={styles["cus_check"]} />
      {label}
    </label>
  );
};

export default Checkbox;
