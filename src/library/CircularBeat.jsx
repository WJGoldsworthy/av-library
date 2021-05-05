import "p5/lib/addons/p5.sound";
import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import Controls, { SketchInstance } from "components/Controls";
import { matchPath } from "react-router";

// TODO: Match beat to radial circle?
let particles = [];
let velocity = 0.01;
let distanceRange = [1, 120];
let numParticles = 30;
let noise = 2;
let opacityFill = 0.3;
let colors = [
  ["#ED3312", "#0E1428", "#7B9E89"],
  ["#fdfc6e", "#07dfe3", "#fdf7f7"],
  ["#fd4339", "#4f32c8", "#edddde"],
  ["#ffffff", "#656565", "#ffffff"],
  ["#59c9a5", "#d81e5b", "#fffd98", "#23395b"],
  ["#ff2328", "#ead2d7", "#bd6bd7", "#1d1564"],
  ["#ED3312", "#0E1428", "#7B9E89", "#FFFFFF"],
  ["#fdfc6e", "#07dfe3", "#fdf7f7", "#FFFFFF"],
  ["#fd4339", "#4f32c8", "#edddde", "#FFFFFF"],
];
let height = window.innerHeight;
let width = window.innerWidth;

var hexToRgbA = function (hex) {
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

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

const VariableControls = ({ p5, noise }) => {
  const changeVelocity = (e) => {
    velocity = parseInt(e.target.value) / 200;
    particles.forEach((particle) => {
      particle.updateVelocity(velocity);
    });
  };

  const changeOpacity = (e) => {
    opacityFill = e.target.value;
  };

  const changeLowerDistance = (e) => {
    distanceRange[0] = parseInt(e.target.value);
    particles.forEach((particle) => {
      particle.updateInitialDistance();
    });
  };

  const changeHighDistance = (e) => {
    distanceRange[0] = parseInt(e.target.value);
    particles.forEach((particle) => {
      particle.updateInitialDistance();
    });
  };

  const changeParticles = (e) => {
    var newParticles = parseInt(e.target.value);
    numParticles = newParticles;
    particles = [];
    for (let i = 0; i < newParticles; i++) {
      const radius = Math.random() * 2 + 1;
      particles.push(
        new Particle(
          width / 2,
          height / 2,
          radius,
          randomColor(colors[5]),
          velocity
        )
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "30px",
        right: "10px",
        display: "grid",
        fontSize: "10px",
        color: "white",
      }}
    >
      <label>Velocity</label>
      <input
        type="range"
        max="10"
        min="1"
        step="1"
        defaultValue="2"
        onChange={(e) => changeVelocity(e)}
      />
      <label>Opacity</label>
      <input
        type="range"
        max="1"
        min="0"
        step="0.1"
        defaultValue="0.2"
        onChange={(e) => changeOpacity(e)}
      />
      <label>Low Distance</label>
      <input
        type="range"
        max="200"
        min="1"
        step="1"
        defaultValue="1"
        onChange={(e) => changeLowerDistance(e)}
      />
      <label>High Distance</label>
      <input
        type="range"
        max="300"
        min="50"
        step="1"
        defaultValue="100"
        onChange={(e) => changeHighDistance(e)}
      />
      <label>Particles</label>
      <input
        type="range"
        max="60"
        min="10"
        step="1"
        defaultValue="40"
        onChange={(e) => changeParticles(e)}
      />
    </div>
  );
};

function CircularBeat() {
  // Variables
  let song;

  // Sketch
  const [sketch, setSketch] = useState({});

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
    setSketch(new SketchInstance(p5, { currentSong: "apricots.mp3" }), () => {
      song = sketch.song;
      return;
    });
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    p5.background(1);
    for (let i = 0; i < numParticles; i++) {
      const radius = Math.random() * 2 + 1;

      particles.push(
        new Particle(
          window.innerWidth / 2,
          window.innerHeight / 2,
          radius,
          randomColor(colors[5]),
          velocity,
          noise
        )
      );
    }
  };

  const draw = (p5) => {
    sketch.checkOptions((newSong) => {
      p5.background(1);
    });
    let spectrum = sketch.fft.analyze();
    var i = 0;
    if (particles.length === numParticles) {
      particles.forEach((particle) => {
        particle.update(p5, i, spectrum);
        i++;
      });
    }
  };

  return (
    <>
      <Sketch preload={preload} setup={setup} draw={draw} />
      <VariableControls velocity={velocity} />
      <Controls sketch={sketch} />
    </>
  );
}

function Particle(x, y, radius, color, velocity) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.radians = Math.random() * Math.PI * 2;
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  var slowEfficient = 0.25;
  this.velocity = Math.random() * velocity * plusOrMinus * slowEfficient;
  this.initialDistance = randomIntFromRange(distanceRange[0], distanceRange[1]);

  this.updateInitialDistance = () => {
    this.initialDistance = randomIntFromRange(
      distanceRange[0],
      distanceRange[1]
    );
  };

  this.updateVelocity = function (newVelocity) {
    this.velocity = Math.random() * newVelocity * plusOrMinus * slowEfficient;
  };

  this.update = function (p5, num, spectrum) {
    const lastPoint = { x: this.x, y: this.y }; // Taking the last point before we re-draw.
    var dist = Array.prototype.slice.call(spectrum)[num];
    this.radians += this.velocity;
    this.distanceFromCenter = this.initialDistance + dist / noise;
    // var dist = spectrum[num * Math.floor(128 / numParticles)];
    //Move points over time

    // Circular Motion
    this.x = Math.floor(
      window.innerWidth / 2 + Math.cos(this.radians) * this.distanceFromCenter
    );
    this.y = Math.floor(
      window.innerHeight / 2 + Math.sin(this.radians) * this.distanceFromCenter
    );
    this.draw(p5, lastPoint);
  };

  this.draw = function (p5, lastPoint) {
    let color = hexToRgbA(this.color);
    color = color.replace("1)", "" + opacityFill + ")");
    p5.stroke(color);
    p5.strokeWeight(1);
    p5.line(lastPoint.x, lastPoint.y, this.x, this.y);
  };
}

export default CircularBeat;
