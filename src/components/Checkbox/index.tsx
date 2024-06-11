import classNames from "classnames";
import styles from "./index.module.scss";

// Checkbox组件接受checked和onChange等props
const Checkbox = ({ checked, onChange, label, name, className, ...props }) => {
  return (
    <label
      className={classNames("flex justify-center items-center", className)}
    >
      <input
        type="checkbox"
        name={name}
        className={styles["cus_checkbox"]}
        checked={checked}
        onChange={onChange}
        {...props} // 其他props将直接传递给input元素
      />
      {label}
    </label>
  );
};

export default Checkbox;
