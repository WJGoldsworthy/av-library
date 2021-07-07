import React from "react";
import {useHistory} from 'react-router-dom'
import "./styles.scss";

// BackgroundChanging images ? based on peakDetect

const RevealButton = ({ link, text, isOpen }) => {

  const history = useHistory();
  return (
    <>
      <div onClick={() => history.push(link)} className={`reveal-button ${isOpen && "active"}`}>
        <p className="reveal-button__text">{text}</p>
      </div>
      {/* <div className="reveal-button__back"></div> */}
    </>
  );
};

export default RevealButton;
