import React from "react";
import Sketch from "react-p5";
import "p5/lib/addons/p5.sound";

function Base() {
  const preload = (p5) => {};

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
  };

  const draw = (p5) => {};

  return <Sketch preload={preload} setup={setup} draw={draw} />;
}

export default Base;
