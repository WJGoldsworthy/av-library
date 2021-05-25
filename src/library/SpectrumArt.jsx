import "p5/lib/addons/p5.sound";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";

function SpectrumArt() {
  let song;
  let fft;
  let amp;
  let maxLevel = 0;
  let drawIteration = 0;
  const [sketch, setSketch] = useState({});

  // Controlled Variables
  let opacityFill = 1; // 0.04 1
  let fftSize = 1024; // 2, 4, 8, 32, 64, 128, 256, 512
  let curve = false;
  let colorSelect = 4;
  let drawFreq = 1;
  let previousValues = [];
  let songDuration;
  let lineHeight;
  let stepSize;
  let exactFft = false;
  let numLines = 8;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let heightStart = height - 100;

  const colors = [
    ["#59c9a5", "#d81e5b", "#fffd98", "#23395b"],
    ["#ff2328", "#ead2d7", "#bd6bd7", "#1d1564"],
    ["#ED3312", "#0E1428", "#7B9E89", "#FFFFFF"],
    ["#fdfc6e", "#07dfe3", "#fdf7f7", "#FFFFFF"],
    ["#fd4339", "#4f32c8", "#edddde", "#FFFFFF"],
    ["#ffffff", "#656565", "#ffffff", "#FFFFFF"],
  ];

  // Unmount clean up
  useEffect(() => {
    // Something
    return function cleanup() {
      if (sketch.isLoaded && sketch.song) {
        sketch.song.pause();
      }
    };
  });

  const preload = (p5) => {
    if (exactFft) {
      fft = new p5.constructor.FFT(0.5, fftSize);
    } else {
      fft = new p5.constructor.FFT(0.5, 1024);
    }
    amp = new p5.constructor.Amplitude();
    setSketch(new SketchInstance(p5, { amp: amp, fftSize: 1024 }), () => {
      song = sketch.song;
    });
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    songDuration = sketch.song.duration();
    const sketchWidth = width - 150;
    stepSize = sketchWidth / (songDuration * 60);
    if (!previousValues.length) {
      for (let i = 0; i < numLines; i++) {
        const sketchHeight = height - 50;
        lineHeight = Math.floor(sketchHeight / numLines);
        previousValues.push([0, lineHeight * numLines]);
      }
    }
    p5.background(1);
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    height = p5.windowHeight;
    width = p5.windowWidth;
    heightStart = p5.windowHeight - 100;
  };

  const draw = (p5) => {
    sketch.checkOptions((newSong) => {
      drawIteration = 0;
      maxLevel = 0;
      songDuration = newSong.duration();
      stepSize = width / (songDuration * 60);
      p5.background(1);
    });

    let spectrum = sketch.fft.analyze();
    p5.noFill();
    if (drawIteration % drawFreq === 0) {
      let level = sketch.options.amp.getLevel();
      if (level > maxLevel) {
        maxLevel = level;
      }
      let colorPick = 1;
      if (maxLevel > 0) {
        colorPick = Math.floor(
          p5.map(level, 0, maxLevel, 0, colors[colorSelect].length - 1)
        );
      }
      let c = hexToRgbA(colors[colorSelect][colorPick]);
      c = c.replace("1)", "" + opacityFill + ")");
      p5.stroke(c);

      for (let i = 0; i < numLines; i++) {
        let x = drawIteration * stepSize;
        let binDiff = Math.floor(fftSize / numLines);
        let y = p5.map(
          spectrum[i * binDiff],
          0,
          255,
          i * lineHeight + lineHeight + 25,
          i * lineHeight + 25
        );
        if (curve) {
          p5.curve(previousValues[i][0], previousValues[i][1], x, y);
        } else {
          p5.line(previousValues[i][0], previousValues[i][1], x, y);
        }
        previousValues[i] = [x, y];
      }
    }
    drawIteration++;
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
      <Sketch
        windowResized={windowResized}
        preload={preload}
        setup={setup}
        draw={draw}
      />
      <Controls sketch={sketch} />
    </>
  );
}

export default SpectrumArt;
