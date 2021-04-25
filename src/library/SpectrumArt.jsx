import "p5/lib/addons/p5.sound";
import React, { useState } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";
import songNames from "../data/songNames";

function SpectrumArt() {
  let song;
  let fft;
  let amp;
  let fft2;
  let maxLevel = 0;
  let drawIteration = 0;
  const [sketch, setSketch] = useState();

  // Controlled Variables
  let backgroundFill = true;
  let opacityFill = 1; // 0.04 1
  let backgroundOpacity = 0.03;
  let fftSize = 16; // 2, 4, 8, 32, 64, 128, 256, 512
  let curve = true;
  let colorSelect = 0;
  let drawFreq = 1;
  let clearCanvas = false;
  let shouldChangeSong = false;
  let currentSong = "fredAgain.mp3";
  let previousValues = new Array(fftSize);

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
  const backgroundOpacityValues = [0.01, 0.02, 0.03, 0.04, 0.05, 1];
  const fftSizes = [8, 32, 64, 128, 256];

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
    amp = new p5.constructor.Amplitude();
    sketch.song.play();
    p5.background(1);
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    height = p5.windowHeight;
    width = p5.windowWidth;
    heightStart = p5.windowHeight - 100;
  };

  const draw = (p5) => {
    sketch.checkOptions();

    let spectrum = fft.analyze();
    p5.noFill();
    if (backgroundFill) {
      p5.background(`rgba(0, 0, 0, ${backgroundOpacity})`);
    }
    if (drawIteration % drawFreq === 0) {
      let level = amp.getLevel();
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
      p5.beginShape();
      p5.stroke(c);
      for (let i = 0; i < spectrum.length * 2; i++) {
        if (i < spectrum.length) {
          let x = p5.map(fftSize - i + 1, 0, spectrum.length, 0, width / 2);
          let y = p5.map(
            spectrum[i],
            0,
            255,
            heightStart,
            height / 2 - height / 4
          );
          if (curve) {
            p5.curveVertex(x, y);
          } else {
            p5.vertex(x, y);
          }
        } else {
          let x = p5.map(
            fftSize * 2 - i - 2,
            0,
            spectrum.length,
            width / 2,
            width
          );
          let y = p5.map(
            spectrum[fftSize * 2 - 1 - i],
            0,
            255,
            heightStart,
            height / 2 - height / 4
          );
          if (curve) {
            p5.curveVertex(x, y);
          } else {
            p5.vertex(x, y);
          }
        }
      }
      p5.endShape();
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

  const changeBackgroundOpacity = (e) => {
    backgroundOpacity =
      backgroundOpacityValues[Math.floor(100 / e.target.value)];
  };

  const changeLineOpacity = (e) => {
    opacityFill = backgroundOpacityValues[Math.floor(100 / e.target.value)];
  };

  const changeFftSize = (e) => {
    fftSize = fftSizes[e.target.value];
  };

  const changeColors = (e) => {
    colorSelect = e.target.value - 1;
  };

  const setClearCanvas = () => {
    clearCanvas = true;
  };

  const pausePlaySong = () => {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
  };

  const changeSong = (e) => {
    currentSong = e.target.value;
    shouldChangeSong = true;
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
