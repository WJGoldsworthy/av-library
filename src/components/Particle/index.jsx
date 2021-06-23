export function Particle(p5, scl, cols) {
  // Initialise variables
  this.pos = p5.createVector(
    p5.random(p5.width) - p5.width / 2,
    p5.random(p5.height) - p5.height / 2
  );
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
  this.follow = function (p5, vectors) {
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

  this.show = function (p5, v) {
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

  this.edges = function (p5) {
    if (this.pos.x > p5.width / 2) {
      this.pos.x = (-1 * p5.width) / 2;
      this.updatePrev();
    }
    if (this.pos.x < (-1 * p5.width) / 2) {
      this.pos.x = p5.width / 2;
      this.updatePrev();
    }
    if (this.pos.y > p5.height / 2) {
      this.pos.y = (-1 * p5.height) / 2;
      this.updatePrev();
    }
    if (this.pos.y < (-1 * p5.height) / 2) {
      this.pos.y = p5.height / 2;
      this.updatePrev();
    }
  };

  this.draw = function (p5) {
    // p5.background(0);
    this.dragSegment(p5, 0, this.pos.x, this.pos.y);
    for (var i = 0; i < this.x.length - 1; i++) {
      this.dragSegment(p5, i + 1, this.x[i], this.y[i]);
    }
  };

  this.dragSegment = function (p5, i, xin, yin) {
    var dx = xin - this.x[i];
    var dy = yin - this.y[i];
    var angle = p5.atan2(dy, dx);
    this.x[i] = xin - p5.cos(angle) * this.segLength;
    this.y[i] = yin - p5.sin(angle) * this.segLength;
    this.segment(p5, this.x[i], this.y[i], angle);
  };

  this.segment = function (p5, x, y, a) {
    p5.push();
    p5.translate(x, y);
    p5.rotate(a);
    p5.line(0, 0, this.segLength, 0);
    p5.pop();
  };
}
