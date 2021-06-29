import React from "react";
import "./styles.scss";

const RevealText = ({ text, className, isOpen }) => {
  return (
    <div className={`reveal-text-container ${className}`}>
      <span className={`${isOpen ? "open" : ""}`}>{text}</span>
    </div>
  );
};

export default RevealText;
