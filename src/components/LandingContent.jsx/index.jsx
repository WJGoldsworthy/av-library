import React, { useState, useRef, useEffect } from "react";
import RevealText from "components/RevealText";
import SectionControls from "components/SectionControls";
import ScrollIndicator from "components/ScrollIndicator";
import "./styles.scss";
import RevealButton from "components/RevealButton";

const LandingContent = ({ mouseWheel }) => {
  const [section, setSection] = useState(0);
  const [sectionChanging, setSectionChanging] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFirstLoad(false);
    }, 2000);
  }, []);

  const handleChange = (sectionNumber) => {
    setSection(sectionNumber);
    setSectionChanging(true);
    setTimeout(() => {
      setSectionChanging(false);
    }, 2000);
  };

  const handleScroll = (e) => {
    if (!sectionChanging) {
      mouseWheel(e);
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
        isOpen={section === 0 && !firstLoad}
        text="SYNTHESIEST"
        className="landing-header"
      />
      <div className="top-left-container">
        <RevealText
          isOpen={section === 1}
          text="This site is intended to "
          className="landing-text"
        />
        <RevealText
          isOpen={section === 1}
          text="promote audio visual "
          className="landing-text"
        />
        <RevealText
          isOpen={section === 1}
          text="and generative art."
          className="landing-text"
        />
        <RevealButton isOpen={section === 3} text="Visit the playground" />
      </div>
      <div className="bottom-right-container">
        <RevealText
          isOpen={section === 1}
          text="It is a playground for"
          className="landing-text"
        />
        <RevealText
          isOpen={section === 1}
          text="creative ideas and using"
          className="landing-text"
        />
        <RevealText
          isOpen={section === 1}
          text="up time over lockdown."
          className="landing-text"
        />
      </div>
      <div className="bottom-left-container">
        <RevealText
          isOpen={section === 2}
          text="I am a web developer"
          className="landing-text"
        />
        <RevealText
          isOpen={section === 2}
          text="from London with an interest in"
          className="landing-text"
        />
        <RevealText
          isOpen={section === 2}
          text="music and creative coding."
          className="landing-text"
        />
      </div>
      <SectionControls currentSection={section} />
      <div className="scroll-indicator">
        <ScrollIndicator />
      </div>
    </div>
  );
};

export default LandingContent;
