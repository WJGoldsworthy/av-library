import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";
import "p5/lib/addons/p5.sound";

// TODO: once a second

function WaveBeat() {
  let song;
  let fft;
  let fft0;
  let trends; // 1 for increasing trend, 0 for equal or decreasing
  let fftSize = 64;
  let opacityFill = 0.8;
  let colorSelect = 3;
  let fft2;
  let drawFreq = 64;
  let numLines = 2;
  let count = 0;
  const [sketch, setSketch] = useState({});

  const width = window.innerWidth;
  const height = window.innerHeight;
  const colors = [
    ["#ff2328", "#ead2d7", "#bd6bd7", "#1d1564"],
    ["#ED3312", "#0E1428", "#7B9E89", "#FFFFFF"],
    ["#fdfc6e", "#07dfe3", "#fdf7f7", "#FFFFFF"],
    ["#fd4339", "#4f32c8", "#edddde", "#FFFFFF"],
    ["#ffffff", "#656565", "#ffffff", "#FFFFFF"],
    ["#8A2BE2", "#fd4339", "#8A2BE2", "#FFFFFF"],
  ];

  let pdBass, pdHigh;
  let bassPeak = false;
  let highPeak = false;

  let freqRanges = [
    [20, 140],
    [140, 400],
    [400, 2600],
    [2600, 5200],
    [5200, 14000],
  ];

  // Unmount clean up
  useEffect(() => {
    return function cleanup() {
      if (sketch.isLoaded && sketch.song) {
        sketch.song.pause();
      }
    };
  });

  const preload = (p5) => {
    fft = new p5.constructor.FFT(0.8, fftSize);
    fft2 = new p5.constructor.FFT(0.8, drawFreq);
    fft0 = Array.apply(null, Array(fftSize)).map(() => 0);
    trends = Array.apply(null, Array(fftSize)).map(() => 0);
    setSketch(
      new SketchInstance(p5, {
        currentSong: "Ego",
        fft2: fft2,
        fft0: fft0,
        trends: trends,
      }),
      () => {
        song = sketch.song;
        return;
      }
    );
  };

  const setup = (p5, canvasParentRef) => {
    pdBass = new p5.constructor.PeakDetect(
      freqRanges[0][0],
      freqRanges[0][1],
      0.95
    );
    pdHigh = new p5.constructor.PeakDetect(freqRanges[3][0], freqRanges[3][1]);
    pdBass.onPeak(bassPeaked);
    pdHigh.onPeak(highPeaked);

    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    // Normal not bad
    // p5.background(0);
    // p5.noFill();
    p5.blendMode(p5.DIFFERENCE);
    // Overlay is gud
    // DIfference gives differing colors
    // Hard light like an oil painting
  };

  const bassPeaked = () => {
    console.log("bass peak");
    bassPeak = true;
  };

  const highPeaked = () => {
    console.log("High peak");
    highPeak = true;
  };

  const draw = (p5) => {
    sketch.checkOptions(() => {
      p5.clear();
    });

    let spectrum = sketch.fft.analyze();
    pdBass.update(sketch.fft);
    pdHigh.update(sketch.fft);

    if (bassPeak || highPeak) {
      count++;
      if (count === 4) {
        let col = Math.floor(Math.random() * 4);
        let c = hexToRgbA(colors[colorSelect][Math.random() > 0.5 ? 2 : 0]);
        c = c.replace("1)", "" + opacityFill + ")");
        let waveform = sketch.options.fft2.waveform();
        p5.beginShape();
        p5.fill(c);
        p5.stroke(c);
        for (let i = 0; i < waveform.length; i++) {
          let x = p5.map(i, 0, waveform.length, 0, width);
          let y = p5.map(waveform[i], -0.5, 0.5, 0, height);
          p5.curveVertex(x, y);
        }
        p5.endShape();

        count = 0;
      }
      bassPeak = false;
      highPeak = false;
    }

    // if (count === 60) {
    //   let col = Math.floor(Math.random() * 4);
    //   let c = hexToRgbA(colors[colorSelect][col]);
    //   c = c.replace("1)", "" + opacityFill + ")");
    //   let waveform = sketch.options.fft2.waveform();
    //   p5.beginShape();
    //   p5.fill(c);
    //   p5.stroke(c);
    //   for (let i = 0; i < waveform.length; i++) {
    //     let x = p5.map(i, 0, waveform.length, 0, width);
    //     let y = p5.map(waveform[i], -0.5, 0.5, 0, height);
    //     p5.curveVertex(x, y);
    //   }
    //   p5.endShape();
    //   count = 0;
    // }

    // count++;
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
