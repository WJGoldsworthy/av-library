import React from "react";
import "./styles.scss";

// BackgroundChanging images ? based on peakDetect

const RevealButton = ({ link, text, isOpen }) => {
  return (
    <>
      <div className={`reveal-button ${isOpen && "active"}`}>
        <p className="reveal-button__text">{text}</p>
      </div>
    </>
  );
};

export default RevealButton;
