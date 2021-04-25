import React, { useState } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";
import "p5/lib/addons/p5.sound";

function RectangleArt() {
  let song;
  let fft;
  let fft0;
  let trends; // 1 for increasing trend, 0 for equal or decreasing
  let fftSize = 16;
  let opacityFill = 0.05;
  const [sketch, setSketch] = useState();

  const width = window.innerWidth;
  const height = window.innerHeight;
  const colors = ["#ff2328", "#ead2d7", "#bd6bd7", "#1d1564"];

  const preload = (p5) => {
    setSketch(new SketchInstance(p5, {}), () => {
      song = sketch.song;
    });
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    fft = new p5.constructor.FFT(0.8, fftSize);
    sketch.song.play();
    fft0 = Array.apply(null, Array(fftSize)).map(() => 0);
    trends = Array.apply(null, Array(fftSize)).map(() => 0);
    p5.background(0);
  };

  const draw = (p5) => {
    sketch.checkOptions();
    let spectrum = fft.analyze();
    p5.noStroke();
    spectrum.forEach((bin, index) => {
      if (trends[index] && bin === fft0[index]) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        let c = hexToRgbA(colors[col]);
        c = c.replace("1)", "" + opacityFill + ")");
        p5.fill(c);
        p5.rect(
          Math.floor(Math.random() * width),
          Math.floor(Math.random() * width),
          Math.floor(Math.random() * bin),
          Math.floor(Math.random() * bin)
        );
      }
      trends[index] = determineTrend(bin, fft0[index]);
    });
    trends[8] = determineTrend(spectrum[8], fft0[8]);
    fft0 = spectrum;
  };

  const determineTrend = (current, previous) => {
    if (current > previous) {
      return 1;
    }
    return 0;
  };

  const hexToRgbA = function (hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      return (
        "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",1)"
      );
    }
    throw new Error("Bad Hex");
  };

  return (
    <>
      <Controls sketch={sketch} />
      <Sketch preload={preload} setup={setup} draw={draw} />
    </>
  );
}

export default RectangleArt;
