import React, { useState } from "react";
import Sketch from "react-p5";
import config from "config";
import "p5/lib/addons/p5.sound";
import LandingContent from "components/LandingContent.jsx";
import ClipText from "components/ClipText";

function Landing() {
  const [firstLoad, setFirstload] = useState(true);

  let song, amp, fft;
  let manShaders, blobShaders, manModel;
  let lastBackgroundColor = [0, 0, 0];
  let colorDifs = [0, 0, 0];
  let alpha = 0;
  let shaderPick = 0;
  let scaleGrowth = 1;
  let triggerChange = false;
  let hasShrunk = false;
  let nextShader = 0;
  let colorPick = 0;
  let isChanged = true;
  let xPos = 0;
  let yPos = 0;

  let scaleModifiers = [3, 1];
  let colors = [
    [0, 0, 0],
    [237, 51, 18],
    [114, 9, 183],
    [59, 206, 172],
    [244, 224, 77],
    [38, 38, 38],
    [44, 81, 201],
  ];

  const userGestureStart = () => {
    setFirstload(false);
  };

  const determineColorDifs = (c1, c2) => {
    return [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]];
  };

  const togglePlay = () => {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.loop();
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const preload = (p5) => {
    song = p5.loadSound(`${config.s3Url}/audio/vale.mp3`, () => {
      song.loop();
    });
    manShaders = p5.loadShader(
      "assets/shaders/man.vert",
      "assets/shaders/man.frag"
    );
    blobShaders = p5.loadShader(
      "assets/shaders/blob.vert",
      "assets/shaders/blob.frag"
    );
    manModel = p5.loadModel("assets/models/man2.obj", true);
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL).parent(
      canvasParentRef
    );
    amp = new p5.constructor.Amplitude();
    fft = new p5.constructor.FFT();
    p5.rotateX(p5.PI);
    p5.background(0);
  };

  const draw = (p5) => {
    if (alpha < 1) {
      alpha += 0.01;
    }
    if (alpha >= 1) {
      alpha = 1;
      isChanged = true;
    }
    p5.background(
      Math.ceil(lastBackgroundColor[0] + colorDifs[0] * alpha),
      Math.ceil(lastBackgroundColor[1] + colorDifs[1] * alpha),
      Math.ceil(lastBackgroundColor[2] + colorDifs[2] * alpha)
    );
    fft.analyze();
    const volume = amp.getLevel();
    let freq = fft.getCentroid();
    freq *= 0.001;
    const mapF = p5.map(freq, 0, 1, 0, 20);
    const mapA = p5.map(volume, 0, 0.2, 0, 0.5);
    if (scaleModifiers[shaderPick] * scaleGrowth !== 1) {
      p5.scale(scaleModifiers[shaderPick] * scaleGrowth);
    }
    if (triggerChange) {
      if (scaleGrowth >= 0 && !hasShrunk) {
        scaleGrowth -= 0.012;
      }
      if (scaleGrowth <= 0) {
        hasShrunk = true;
      }
      if (scaleGrowth <= 1 && hasShrunk) {
        shaderPick = nextShader;
        scaleGrowth += 0.012;
      }
      if (scaleGrowth > 1) {
        triggerChange = false;
        hasShrunk = false;
        scaleGrowth = 1;
      }
    }
    if (colorPick === 3) {
      if (xPos <= 200) {
        xPos += 1.5;
      }
    } else {
      if (xPos > 1) {
        xPos -= 1.5;
      }
    }
    p5.translate(xPos * 1.5, yPos);
    if (shaderPick === 0) {
      manShaders.setUniform("uTime", p5.frameCount);
      manShaders.setUniform("uFrequency", mapF);
      manShaders.setUniform("uAmp", mapA);
      p5.shader(manShaders);
      p5.noStroke();
      let newRot = 0.005;
      p5.rotateY(p5.frameCount * newRot);
      p5.rotateZ(p5.frameCount * newRot);
      p5.rotateX(p5.frameCount * -newRot * 0.8);
      p5.model(manModel);
    }
    if (shaderPick === 1) {
      p5.shader(blobShaders);
      blobShaders.setUniform("uTime", p5.frameCount);
      blobShaders.setUniform("uFrequency", mapF);
      blobShaders.setUniform("uAmp", mapA);
      p5.rotateY(p5.frameCount * 0.005);
      p5.sphere(p5.width / 7, 200, 200);
    }
  };

  function mouseWheel(event) {
    if (event.deltaY < 0) {
      if (colorPick !== 0) {
        if (isChanged) {
          lastBackgroundColor = colors[colorPick];
          isChanged = false;
          colorPick -= 1;
          colorDifs = determineColorDifs(
            lastBackgroundColor,
            colors[colorPick]
          );
          alpha = 0;
          if (colorPick === 1) {
            if (!triggerChange && !hasShrunk) {
              triggerChange = true;
              nextShader = 0;
            }
          }
        }
      }
    } else {
      if (isChanged && colorPick <= 2) {
        lastBackgroundColor = colors[colorPick];
        isChanged = false;
        colorPick += 1;
        colorDifs = determineColorDifs(lastBackgroundColor, colors[colorPick]);
        alpha = 0;
        if (colorPick === 2) {
          if (!triggerChange && !hasShrunk) {
            triggerChange = true;
            nextShader = 1;
          }
        }
      }
    }
  }

  if (firstLoad) {
    return (
      <>
        <div className="landing-open">
          <ClipText
            value="ENTER"
            type="random"
            onClick={() => userGestureStart()}
          />
          <p>This experience is better with sound</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Sketch
        windowResized={windowResized}
        preload={preload}
        setup={setup}
        draw={draw}
      />
      <LandingContent mouseWheel={mouseWheel} />
    </>
  );
}

export default Landing;
