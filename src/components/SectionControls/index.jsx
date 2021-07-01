import React from "react";
import RevealText from "components/RevealText";
import "./styles.scss";

const SectionControls = ({ currentSection }) => {
  return (
    <div className="section-controls">
      <div
        style={{
          transform: `rotate(${90 * currentSection}deg)`,
        }}
        className="section-controls__boxes"
      >
        <div className="line-one">
          <div className={`box ${currentSection === 2 && "active"}`}></div>
          <div className={`box ${currentSection === 1 && "active"}`}></div>
        </div>
        <div className="line-two">
          <div className={`box ${currentSection === 3 && "active"}`}></div>
          <div className={`box ${currentSection === 0 && "active"}`}></div>
        </div>
      </div>
      <div className={`section-text ${currentSection === 0 && "active"}`}>
        <span className="text">Welcome</span>
      </div>
      <div className={`section-text ${currentSection === 1 && "active"}`}>
        <span className="text">This site</span>
      </div>
      <div className={`section-text ${currentSection === 2 && "active"}`}>
        <span className="text">About me</span>
      </div>
      <div className={`section-text ${currentSection === 3 && "active"}`}>
        <span className="text">The playground</span>
      </div>
    </div>
  );
};

export default SectionControls;
