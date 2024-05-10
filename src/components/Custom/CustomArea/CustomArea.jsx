import React from "react";
import "./CustomArea.css";

const CustomArea = ({
  placeholder,
  handleChange,
  value,
  fieldName,
  width,
  classNames,
  name="message",
  rows
}) => {
  return (
    <div className="custArea">
      <textarea
        name={name}
        rows={rows}
        className={classNames}
        placeholder={placeholder}
        onChange={(e) => handleChange(e, fieldName)}
        value={value}
        style={{ width: width }}
      />
    </div>
  );
};

export default CustomArea;
