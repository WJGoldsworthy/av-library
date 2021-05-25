import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import config from "config";
import "p5/lib/addons/p5.sound";
import Controls, { SketchInstance } from "components/Controls";

var song;
var button;
var amp;
var width, height;
var volhistory = [];
var peaks;
var count = 0;
var prespeed = 3;
var cols, rows;
var scl = 40;
var fr;
var zoff = 0;
var particles = [];
var flowfield;
var sector_length = 100;
let shouldReset = false;

// Custom particles for use in visualiser
function Particle(p5) {
  // Initialise variables
  this.pos = p5.createVector(p5.random(width), p5.random(height));
  this.vel = p5.constructor.Vector.random2D();
  this.acc = p5.createVector(0, 0);
  this.maxspeed = 10;

  this.x = [];
  this.y = [];
  this.segNum = 200;
  this.segLength = 50;

  for (var i = 0; i < this.segNum; i++) {
    this.x[i] = 0;
    this.y[i] = 0;
  }

  this.h = 0;

  this.prevPos = this.pos.copy();

  // Update function to control movement based on audio
  this.update = function (v) {
    this.vel.add(this.acc);
    this.vel.limit(v);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  // Maintain that particles follow the perlin noise vectors
  this.follow = function (vectors) {
    var x = p5.floor(this.pos.x / scl);
    var y = p5.floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  const orange = [237, 51, 18];
  const blue = [44, 81, 201];

  this.maxV = 0;

  this.show = function (v) {
    const r =
      Math.min(orange[0], blue[0]) +
      Math.abs(Math.cos(v)) * Math.max(orange[0], blue[0]);
    const g =
      Math.min(orange[1], blue[1]) +
      Math.abs(Math.cos(v)) * Math.max(orange[1], blue[1]);
    const b =
      Math.min(orange[2], blue[2]) +
      Math.abs(Math.sin(v)) * Math.max(orange[2], blue[2]);
    p5.stroke(r, g, b);
    p5.strokeWeight(2);
    p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  };

  this.updatePrev = function () {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };

  this.edges = function () {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  };

  this.draw = function () {
    p5.background(0);
    this.dragSegment(0, this.pos.x, this.pos.y);
    for (var i = 0; i < this.x.length - 1; i++) {
      this.dragSegment(i + 1, this.x[i], this.y[i]);
    }
  };

  this.dragSegment = function (i, xin, yin) {
    var dx = xin - this.x[i];
    var dy = yin - this.y[i];
    var angle = p5.atan2(dy, dx);
    this.x[i] = xin - p5.cos(angle) * this.segLength;
    this.y[i] = yin - p5.sin(angle) * this.segLength;
    this.segment(this.x[i], this.y[i], angle);
  };

  this.segment = function (x, y, a) {
    p5.push();
    p5.translate(x, y);
    p5.rotate(a);
    p5.line(0, 0, this.segLength, 0);
    p5.pop();
  };
}

function Particles() {
  // Initialise Variables
  const [sketch, setSketch] = useState({});

  // Control for visualiser variables
  var speed_input = 1.5;
  var noise_input = 6;
  var num_particles = 1500;
  let song;

  // Unmount clean up
  useEffect(() => {
    // Something
    return function cleanup() {
      if (sketch.isLoaded && sketch.song) {
        sketch.song.pause();
        particles = [];
      }
    };
  });

  const preload = (p5) => {
    // p5.loadSound(`${config.s3Url}/audio/fredAgain.mp3`, (soundFile) => {
    //   song = soundFile;
    //   soundFile.play();
    // });
    amp = new p5.constructor.Amplitude();
    setSketch(
      new SketchInstance(p5, { currentSong: "fredAgain", amp: amp }),
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
    height = window.innerHeight;
    width = window.innerWidth;
    amp = new p5.constructor.Amplitude();
    p5.pixelDensity(1);
    cols = p5.floor(width / scl);
    rows = p5.floor(height / scl);
    fr = p5.createP("");

    flowfield = new Array(cols * rows);

    // Add custom particles into the Noise field
    for (var i = 0; i < num_particles; i++) {
      particles[i] = new Particle(p5);
    }

    p5.background(0);

    // Control for speed of particles based on screen width
    // Larger screens benefit from a higher particle speed.
    if (width > 1300) {
      prespeed = 5;
    }
  };

  const draw = (p5) => {
    sketch.checkOptions((newSong) => {
      p5.background(1);
    });
    if (shouldReset) {
      particles = [];
      for (var i = 0; i < num_particles; i++) {
        particles[i] = new Particle(p5);
      }
      shouldReset = false;
    }
    perlin(p5);
  };

  var inc = 0.1;
  var prevol = 0;

  // Function for initialising and controlling perlin noise field
  function perlin(p5) {
    p5.background(10, 20);

    var vol = sketch.options.amp.getLevel();

    var diff = Math.abs(vol - prevol);

    var ndiff = vol - prevol;
    var nval = ndiff / 100;
    var val = diff / 5;

    var volumeNoise = Math.ceil(vol);

    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var vindex = (x + y * width) * 4;

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
      particles[i].follow(flowfield);
      particles[i].update(speed);
      particles[i].edges();
      particles[i].show(speed);
    }

    // Control for continually adding and removing particles to maintain variation in effect
    if (particles.length !== num_particles) {
      let diff_num = num_particles - particles.length;

      if (diff_num > 0) {
        i = 0;
        while (i <= diff_num) {
          particles.push(new Particle(p5));
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
      particles.push(new Particle(p5));
      count = 0;
    } else {
      count++;
    }
  }

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const resetParticles = () => {
    shouldReset = true;
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
      <div className="variable-controls">
        <div className="variable-controls-container">
          <p onClick={() => resetParticles()}>Reset particles</p>
        </div>
      </div>
    </>
  );
}

export default Particles;
