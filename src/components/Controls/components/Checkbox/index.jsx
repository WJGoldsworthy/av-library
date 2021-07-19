import React, { useState } from "react";
import "./styles.scss";
import { ReactComponent as Tick } from "assets/images/tick.svg";

const Checkbox = ({ label, onChange, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    onChange(!checked);
    setChecked(!checked);
  };

  return (
    <div onClick={() => handleChange()} className="checkbox">
      <p className="checkbox__label">{label}</p>
      <div className="checkbox__box">{checked && <Tick />}</div>
    </div>
  );
};

export default Checkbox;
