import React, { useState } from "react";

const CustomButton = ({
  label,
  type,
  disabled = false,
  handleClick,
  classNames,
  data,
  color = "var(--violet-dark)",
  colorHover = "var(--violet)",
  width = "90%",
  height = "auto",
  fontSize = "18px"
}) => {
  const [backgroundColor, setBackgroundColor] = useState(color);

  const buttonStyle = {
    backgroundColor: backgroundColor,
    width: width,
    fontSize: fontSize,
    border: "0px",
    height: height,
    borderRadius: "4px",
    margin: "5px",
    padding: "5px",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.5s",
  };

  const handleMouseEnter = () => {
    setBackgroundColor(colorHover);
  };

  const handleMouseLeave = () => {
    setBackgroundColor(color);
  };

  const onClickHandler = (e, data) => {
    if (handleClick) {
      handleClick(e, data);
    }
  };

  return (
    <div>
      <button
        className={classNames}
        onClick={(e) => onClickHandler(e, data)}
        type={type}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={buttonStyle}
      >
        {label}
      </button>
    </div>
  );
};

export default CustomButton;
