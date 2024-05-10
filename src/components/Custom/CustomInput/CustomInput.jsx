import React from "react";
import "./CustomInput.css";

const CustomInput = ({
  placeholder,
  handleChange,
  value,
  fieldName,
  type,
  width,
  height,
  classNames,
}) => {
  return (
    <div className="custInput">
      <input
        className={classNames}
        placeholder={placeholder}
        onChange={(e) => handleChange(e, fieldName)}
        value={value}
        type={type}
        style={{ width: width, height: height }}
      />
    </div>
  );
};

export default CustomInput;
