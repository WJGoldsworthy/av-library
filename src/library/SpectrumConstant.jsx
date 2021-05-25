import "p5/lib/addons/p5.sound";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";

function SpectrumConstant() {
  let song;
  let amp;
  let maxLevel = 0;
  let drawIteration = 0;

  // Controlled Variables
  let backgroundFill = true;
  let opacityFill = 1; // 0.04 1
  let backgroundOpacity = 0.03;
  let fftSize = 64; // 2, 4, 8, 32, 64, 128, 256, 512
  let curve = true;
  let colorSelect = 0;
  let drawFreq = 1;

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

  const [sketch, setSketch] = useState({});
  let currentSong = "fredAgain";

  // Unmount clean up
  useEffect(() => {
    return function cleanup() {
      if (sketch.isLoaded && sketch.song) {
        sketch.song.pause();
      }
    };
  });

  const preload = (p5) => {
    amp = new p5.constructor.Amplitude();
    setSketch(
      new SketchInstance(p5, {
        amp: amp,
        currentSong: currentSong,
      }),
      () => {
        song = sketch.song;
        return;
      }
    );
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
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
      p5.background(1);
    });

    let spectrum = sketch.fft.analyze();
    p5.noFill();
    if (backgroundFill) {
      p5.background(`rgba(0, 0, 0, ${backgroundOpacity})`);
    }
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

  const changeColors = (e) => {
    colorSelect = e.target.value - 1;
  };

  return (
    <>
      <Controls sketch={sketch} />
      <Sketch
        windowResized={windowResized}
        preload={preload}
        setup={setup}
        draw={draw}
      />
      <div className="variable-controls">
        <div className="variable-controls-container">
          <label for="background-opacity">Background</label>
          <input
            id="background-opacity"
            name="background-opacity"
            type="range"
            max="100"
            min="0"
            defaultValue="40"
            step="20"
            onChange={(e) => changeBackgroundOpacity(e)}
          ></input>
          <label for="line-opacity">Line Opacity</label>
          <input
            id="line-opacity"
            name="line-opacity"
            type="range"
            max="100"
            min="0"
            defaultValue="40"
            step="20"
            onChange={(e) => changeLineOpacity(e)}
          ></input>
          <label>Line Colors</label>
          <input
            id="line-colors"
            name="line-colors"
            type="range"
            max={colors.length}
            min="1"
            defaultValue="1"
            step="1"
            onChange={(e) => changeColors(e)}
          ></input>
          <label>Draw Frequency</label>
          <input
            id="draw-freq"
            name="draw-freq"
            type="range"
            max="6"
            min="1"
            defaultValue="1"
            step="1"
            onChange={(e) => {
              drawFreq = e.target.value;
            }}
          ></input>
          <label for="backgroundFill">Fill Background</label>
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => {
              backgroundFill = e.target.checked;
            }}
          ></input>
          <p
            onClick={() => {
              maxLevel = 0;
            }}
          >
            Reset Max Level
          </p>
        </div>
      </div>
    </>
  );
}

export default SpectrumConstant;
