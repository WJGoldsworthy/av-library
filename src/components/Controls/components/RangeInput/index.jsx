import React, { useState } from "react";
import "./styles.scss";

const RangeInput = ({ max, min, step, defaultValue, onChange, label }) => {
  const [percentage, setPercentage] = useState(
    ((defaultValue - min) / (max - min)) * 100
  );
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const percentage = ((e.target.value - min) / (max - min)) * 100;
    setPercentage(percentage);
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="range-input">
      <div className="range-input__upper">
        <label>{label}</label>
        <div className="range-input__value-display">
          <p>{value}</p>
        </div>
      </div>
      <input
        style={{
          background: `linear-gradient(to right, #E8E8E8 0%, #E8E8E8 ${percentage}%, #696969 ${percentage}%, #696969 100%)`,
        }}
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        type="range"
        onChange={(e) => handleChange(e)}
      ></input>
      <div className="range-input__lower">
        <p className="range-input__min">{min}</p>
        <p>{max}</p>
      </div>
    </div>
  );
};

export default RangeInput;
