import React from "react";
import Sketch from "react-p5";
import "p5/lib/addons/p5.sound";
import { Particle } from "components/Particle";

function Landing() {
  let song, amp, fft;
  let manShaders, blobShaders, manModel;
  let lastBackgroundColor = [0, 0, 0];
  let backgroundColorAim = [237, 51, 18];
  let colorDifs = [0, 0, 0];
  let alpha = 0;
  let shaderPick = 0;
  let scaleGrowth = 1;
  let triggerChange = false;
  let hasShrunk = false;
  let nextShader = 0;
  let colorPick = 0;
  let fullScroll = 0;

  // Particles variables
  let particles = [];
  let cols, rows, flowfield;
  let scl = 40;
  let prevol = 3;
  let noise_input = 6;
  let zoff = 0;
  let speed_input = 0.5;
  let count = 0;
  let num_particles = 100;

  let scaleModifiers = [3, 1, 1];
  let colors = [
    [0, 0, 0],
    [237, 51, 18],
    [59, 206, 172],
    [244, 224, 77],
    [38, 38, 38],
  ];

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

  function perlin(p5) {
    p5.background(10, 20);

    var vol = amp.getLevel();

    var diff = Math.abs(vol - prevol);

    var ndiff = vol - prevol;
    var nval = ndiff / 100;
    var val = diff / 5;

    var volumeNoise = Math.ceil(vol);

    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var vindex = (x + y * p5.width) * 4;

        var index = x + y * cols;

        // Direction of noise field is based off audio input
        var angle =
          p5.noise(
            (xoff / 2) * noise_input,
            (yoff / 2) * noise_input,
            (zoff / 2) * noise_input * volumeNoise
          ) *
          p5.TWO_PI *
          2;
        var v = p5.constructor.Vector.fromAngle(angle);

        p5.stroke(255);
        p5.push();
        p5.translate(x * scl, y * scl);
        p5.rotate(v.heading());
        p5.pop();

        v.setMag(1);

        flowfield[index] = v;
        xoff -= 0.01;

        p5.stroke(0, 1000);
      }
      yoff += 0.01;
      zoff += 0.0004;

      prevol = vol;
    }

    // Update particle speed based on audio volume
    var speed = speed_input + vol * 55; //55
    p5.stroke(255);

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(p5, flowfield);
      particles[i].update(speed);
      particles[i].edges(p5);
      particles[i].show(p5, speed);
    }

    // Control for continually adding and removing particles to maintain variation in effect
    if (particles.length !== num_particles) {
      let diff_num = num_particles - particles.length;

      if (diff_num > 0) {
        i = 0;
        while (i <= diff_num) {
          particles.push(new Particle(p5, scl, cols));
          i++;
        }
      } else {
        i = 0;
        while (i >= diff_num) {
          particles.shift();
          i--;
        }
      }
    }

    if (count == 30) {
      particles.shift();
      particles.push(new Particle(p5, scl, cols));
      count = 0;
    } else {
      count++;
    }
  }

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const preload = (p5) => {
    song = p5.loadSound("assets/audio/vale.mp3", () => {
      song.play();
    });
    manShaders = p5.loadShader(
      "assets/shaders/man.vert",
      "assets/shaders/man.frag"
    );
    blobShaders = p5.loadShader(
      "assets/shaders/blob.vert",
      "assets/shaders/blob.frag"
    );
    manModel = p5.loadModel("assets/models/man.obj", true);
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL).parent(
      canvasParentRef
    );
    colorDifs = determineColorDifs(lastBackgroundColor, backgroundColorAim);

    // Particles
    // cols = p5.floor(p5.width / scl);
    // rows = p5.floor(p5.height / scl);
    // flowfield = new Array(cols * rows);
    // for (var i = 0; i < num_particles; i++) {
    //   particles[i] = new Particle(p5, scl, cols);
    // }

    amp = new p5.constructor.Amplitude();
    fft = new p5.constructor.FFT();
    // song.play();
    p5.rotateX(p5.PI);
    p5.background(0);
  };

  const draw = (p5) => {
    if (shaderPick !== 2) {
      p5.background(
        Math.ceil(lastBackgroundColor[0] + colorDifs[0] * alpha),
        Math.ceil(lastBackgroundColor[1] + colorDifs[1] * alpha),
        Math.ceil(lastBackgroundColor[2] + colorDifs[2] * alpha)
      );
    }
    fft.analyze();
    const volume = amp.getLevel();
    let freq = fft.getCentroid();
    freq *= 0.001;
    // perlin(p5);

    const mapF = p5.map(freq, 0, 1, 0, 20);
    const mapA = p5.map(volume, 0, 0.2, 0, 0.5);
    if (scaleModifiers[shaderPick] * scaleGrowth !== 1) {
      p5.scale(scaleModifiers[shaderPick] * scaleGrowth);
    }
    if (triggerChange) {
      if (scaleGrowth >= 0 && !hasShrunk) {
        scaleGrowth -= 0.006;
      }
      if (scaleGrowth <= 0) {
        hasShrunk = true;
      }
      if (scaleGrowth <= 1 && hasShrunk) {
        shaderPick = nextShader;
        scaleGrowth += 0.006;
      }
      if (scaleGrowth > 1) {
        triggerChange = false;
        hasShrunk = false;
        scaleGrowth = 1;
      }
    }

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

    // console.log(shaderPick);

    // if (shaderPick === 2) {
    //   p5.resetShader();
    //   perlin(p5);
    // }
  };

  function mouseWheel(event) {
    if (!triggerChange && !hasShrunk) {
      fullScroll += event.deltaTime;
    }
    if (alpha >= 0) {
      alpha += event.deltaTime * 0.005;
      if (alpha >= 1) {
        colorPick += 1;
        lastBackgroundColor = backgroundColorAim;
        colorDifs = determineColorDifs(lastBackgroundColor, colors[colorPick]);
        if (colorPick === colors.length - 1) {
          colorPick = 0;
        }
        backgroundColorAim = colors[colorPick];
        alpha = 0;
      }
    }
    if (alpha <= 0) {
      alpha = 0.0001;
    }
    if (fullScroll >= 1020 && shaderPick === 0) {
      if (!triggerChange && !hasShrunk) {
        triggerChange = true;
        nextShader = 1;
      }
    }
    if (fullScroll <= 1020 && shaderPick === 1) {
      if (!triggerChange && !hasShrunk) {
        triggerChange = true;
        nextShader = 0;
      }
    }
    if (fullScroll >= 2040 && shaderPick === 1) {
      if (!triggerChange && !hasShrunk) {
        triggerChange = true;
        nextShader = 2;
      }
    }
  }

  return (
    <>
      <Sketch
        windowResized={windowResized}
        preload={preload}
        setup={setup}
        draw={draw}
        mouseWheel={mouseWheel}
      />
      <p className="landing-header">SYNTHESIEST</p>
    </>
  );
}

export default Landing;
