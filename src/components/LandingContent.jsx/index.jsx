import React, { useState, useRef, useEffect } from "react";
import RevealText from "components/RevealText";
import "./styles.scss";

const LandingContent = () => {
  const [section, setSection] = useState(0);
  const [sectionChanging, setSectionChanging] = useState(false);

  const handleChange = (sectionNumber) => {
    setSection(sectionNumber);
    setSectionChanging(true);
    setTimeout(() => {
      setSectionChanging(false);
    }, 5000);
  };

  const handleScroll = (e) => {
    if (!sectionChanging) {
      if (e.deltaY < 0) {
        // scroll up
        if (section !== 0) {
          handleChange(section - 1);
        }
      } else {
        // scroll down
        handleChange(section + 1);
      }
    }
  };

  return (
    <div className="landing-content" onWheel={(e) => handleScroll(e)}>
      <RevealText
        isOpen={section === 0}
        text="SYNTHESIEST"
        className="landing-header"
      />
      <div className="top-left-container">
        <RevealText
          isOpen={section === 1}
          text="This site is intended to promote audio visual and generative art."
          className="landing-text"
        />
      </div>
    </div>
  );
};

export default LandingContent;
