import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import "p5/lib/addons/p5.sound";
import Controls, { SketchInstance } from "components/Controls";

function Lines() {
  let song;
  let amp;
  let y = 0;
  const [sketch, setSketch] = useState({});

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
        currentSong: "saku",
        amp: amp,
      }),
      () => {
        song = sketch.song;
      }
    );
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    p5.background(0);
    p5.blendMode(p5.LIGHTEST);
  };

  const draw = (p5) => {
    sketch.checkOptions(() => {
      p5.background(1);
    });
    let level = 0;
    level = sketch.options.amp.getLevel();
    p5.stroke(
      `rgba(${255 - Math.round(level * 255)}, ${Math.round(
        level * 255
      )}, ${Math.round(level * 255)}, ${level / 2})`
    );
    let lineSize = Math.round(level * 400);
    p5.line(p5.width / 2 - lineSize, y, p5.width / 2 + lineSize, y);
    y++;
    if (y > p5.height - 100) {
      y = 0;
    }
  };

  return (
    <>
      <Controls sketch={sketch} />
      <Sketch preload={preload} setup={setup} draw={draw} />
    </>
  );
}

export default Lines;
