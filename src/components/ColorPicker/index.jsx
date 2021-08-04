import React, { useState } from "react";
import { ChromePicker } from "react-color";
import "./styles.scss";

const ColorPicker = ({ defaultColor, setColor, label }) => {
  const [internalColor, setInternalColor] = useState({
    r: defaultColor[0],
    g: defaultColor[1],
    b: defaultColor[2],
  });
  const [open, setOpen] = useState(false);

  const handleColorSelect = (color) => {
    setInternalColor(color.rgb);
    setColor([color.rgb.r, color.rgb.g, color.rgb.b]);
  };

  return (
    <div>
      <div onClick={() => setOpen(!open)} className="color-picker__container">
        <label>{label}</label>
        <div>
          <div
            style={{
              backgroundColor: `rgb(${internalColor.r}, ${internalColor.g}, ${internalColor.b})`,
            }}
            className="color-picker__color-block"
          ></div>
        </div>
      </div>
      {open && (
        <>
          <div className="color-picker__controls">
            <ChromePicker
              onChangeComplete={handleColorSelect}
              color={internalColor}
            />
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="color-picker__backdrop"
          />
        </>
      )}
    </div>
  );
};

export default ColorPicker;
