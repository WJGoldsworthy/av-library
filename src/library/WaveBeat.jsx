import React, { useState } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";
import "p5/lib/addons/p5.sound";

function WaveBeat() {
  let song;
  let fft;
  let fft0;
  let trends; // 1 for increasing trend, 0 for equal or decreasing
  let fftSize = 64;
  let opacityFill = 0.15;
  let peakDetect;
  let colorSelect = 0;
  let fft2;
  let drawFreq = 64;
  let numLines = 2;
  const [sketch, setSketch] = useState();

  const width = window.innerWidth;
  const height = window.innerHeight;
  const colors = [
    ["#ff2328", "#ead2d7", "#bd6bd7", "#1d1564"],
    ["#ED3312", "#0E1428", "#7B9E89", "#FFFFFF"],
    ["#fdfc6e", "#07dfe3", "#fdf7f7", "#FFFFFF"],
    ["#fd4339", "#4f32c8", "#edddde", "#FFFFFF"],
    ["#ffffff", "#656565", "#ffffff", "#FFFFFF"],
  ];

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
    fft2 = new p5.constructor.FFT(0.8, drawFreq);
    peakDetect = new p5.constructor.PeakDetect();
    sketch.song.play();
    fft0 = Array.apply(null, Array(fftSize)).map(() => 0);
    trends = Array.apply(null, Array(fftSize)).map(() => 0);
    p5.background(0);
  };

  const draw = (p5) => {
    sketch.checkOptions();

    let spectrum = fft.analyze();
    let lines = spectrum.filter((item, index) => !(index % numLines));
    p5.noFill();
    lines.forEach((bin, index) => {
      if (trends[index] && bin === fft0[index]) {
        let col = Math.floor(Math.random() * 4);
        let c = hexToRgbA(colors[colorSelect][col]);
        c = c.replace("1)", "" + opacityFill + ")");
        let waveform = fft2.waveform();
        p5.beginShape();
        p5.stroke(c);
        for (let i = 0; i < waveform.length; i++) {
          let x = p5.map(i, 0, waveform.length, 0, width);
          let y = p5.map(waveform[i], -1, 1, 0, height);
          p5.vertex(x, y);
        }
        p5.endShape();
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

export default WaveBeat;
