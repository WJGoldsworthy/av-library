import "p5/lib/addons/p5.sound";
import React, { useState } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";

function PeakDetect() {
  let song;
  let fft;
  let amp;
  let fft2;
  let maxLevel = 0;
  let drawIteration = 0;
  const [sketch, setSketch] = useState();

  // Controlled Variables
  let opacityFill = 1; // 0.04 1
  let fftSize = 1024; // 2, 4, 8, 32, 64, 128, 256, 512
  let curve = false;
  let colorSelect = 1;
  let drawFreq = 1;
  let previousValues = [];
  let songDuration;
  let lineHeight;
  let stepSize;
  let exactFft = false;
  let numLines = 5;
  let yDropOff = 1;

  let bassPeak = false;
  let lowMidPeak = false;

  let peakObj = [
    { label: "bass", value: false },
    { label: "lowMid", value: false },
    { label: "mid", value: false },
    { label: "highMid", value: false },
    { label: "treble", value: false },
  ];

  let pdBass, pdLowMid, pdMid, pdHigh, pdTreble;

  let freqRanges = [
    [20, 140],
    [140, 400],
    [400, 2600],
    [2600, 5200],
    [5200, 14000],
  ];

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

  const preload = (p5) => {
    setSketch(new SketchInstance(p5, {}), () => {
      song = sketch.song;
    });
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    if (exactFft) {
      fft = new p5.constructor.FFT(0.5, fftSize);
    } else {
      fft = new p5.constructor.FFT(0.5, 1024);
    }
    pdBass = new p5.constructor.PeakDetect(
      freqRanges[0][0],
      freqRanges[0][1],
      0.95
    );
    pdLowMid = new p5.constructor.PeakDetect(
      freqRanges[1][0],
      freqRanges[1][1],
      0.6
    );
    pdMid = new p5.constructor.PeakDetect(freqRanges[2][0], freqRanges[2][1]);
    pdHigh = new p5.constructor.PeakDetect(freqRanges[3][0], freqRanges[3][1]);
    pdTreble = new p5.constructor.PeakDetect(
      freqRanges[4][0],
      freqRanges[4][1]
    );

    pdBass.onPeak(bassPeaked);
    pdLowMid.onPeak(lowMidPeaked);
    pdMid.onPeak(midPeaked);
    pdHigh.onPeak(highMidPeaked);
    pdTreble.onPeak(treblePeaked);

    amp = new p5.constructor.Amplitude();
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
    sketch.song.play();
    p5.background(1);
  };

  const bassPeaked = () => {
    peakObj[0].value = true;
  };

  const lowMidPeaked = () => {
    peakObj[1].value = true;
    console.log("peak");
  };

  const midPeaked = () => {
    peakObj[2].value = true;
  };

  const highMidPeaked = () => {
    peakObj[3].value = true;
  };

  const treblePeaked = () => {
    peakObj[4].value = true;
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

    let spectrum = fft.analyze();
    pdBass.update(fft);
    pdLowMid.update(fft);
    pdMid.update(fft);
    pdHigh.update(fft);
    pdTreble.update(fft);

    p5.noFill();
    if (drawIteration % drawFreq === 0) {
      let level = amp.getLevel();
      if (level > maxLevel) {
        maxLevel = level;
      }
      let colorPick = 1;

      for (let i = 0; i < peakObj.length; i++) {
        let x = drawIteration * stepSize;
        let binDiff = Math.floor(fftSize / numLines);
        let bin = Math.floor(p5.map(i, 0, numLines, 0, numLines * 0.8));
        colorPick = Math.floor(
          p5.map(
            spectrum[binDiff * i],
            0,
            255,
            0,
            colors[colorSelect].length - 1
          )
        );
        let c = hexToRgbA(colors[colorSelect][colorPick]);
        c = c.replace("1)", "" + opacityFill + ")");
        p5.stroke(c);
        let y;
        if (peakObj[i].value) {
          y = p5.map(
            fft.getEnergy(peakObj[i].label),
            0,
            255,
            i * lineHeight + lineHeight + 25,
            i * lineHeight + 25
          );
          peakObj[i].value = false;
        } else {
          if (
            previousValues[i][1] + yDropOff >=
            i * lineHeight + lineHeight + 25
          ) {
            y = i * lineHeight + lineHeight + 25;
          } else {
            y = previousValues[i][1] + yDropOff;
          }
        }

        p5.line(previousValues[i][0], previousValues[i][1], x, y);
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

export default PeakDetect;
