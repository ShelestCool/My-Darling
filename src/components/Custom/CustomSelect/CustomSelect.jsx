import React from "react";

import "./CustomSelect.css";

const CustomSelect = ({ options, placeholder, handleChange, value, fieldName }) => {

  return (
    <>
      <select
        className="product-select"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e, fieldName)}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default CustomSelect;

