import React from "react";
import songNames from "data/songNames";
import "./styles.scss";
import config from "config";

const Controls = ({ song, selectColors, currentSong, sketch }) => {
  const pausePlaySong = () => {
    if (sketch.song.isPlaying()) {
      sketch.song.pause();
    } else {
      sketch.song.play();
    }
  };

  const changeSong = (e) => {
    sketch.changeSong(e);
  };

  const clearCanvas = () => {
    sketch.clearCanvas();
  };

  return (
    <div className="c-controls">
      <button onClick={() => clearCanvas()}>Clear Canvas</button>
      <button onClick={() => pausePlaySong()}>Play/Pause</button>
      <select defaultValue={currentSong} onChange={(e) => changeSong(e)}>
        {songNames.map((name) => (
          <option value={name}>{name.substring(0, name.length - 4)}</option>
        ))}
      </select>
    </div>
  );
};

export class SketchInstance {
  constructor(p5, options) {
    this.p5 = p5;
    this.isLoaded = false;
    this.fft = new p5.constructor.FFT(0.6, 64);
    this.song = p5.loadSound(`${config.s3Url}/audio/apricots.mp3`, () => {
      this.song.play();
      this.isLoaded = true;
    });
    this.shouldChangeSong = false;
    this.currentSong = "woman.mp3";
    this.changeSong = this.changeSong.bind(this);
  }

  changeSong = (e) => {
    this.currentSong = e.target.value;
    this.shouldChangeSong = true;
  };

  clearCanvas = () => {
    this.p5.background(1);
  };

  checkOptions = (callback) => {
    if (this.shouldChangeSong) {
      this.song.pause();
      this.song = this.p5.loadSound(
        `${config.s3Url}/audio/${this.currentSong}`,
        () => {
          this.song.play();
          if (callback) {
            callback(this.song);
          }
        }
      );
      this.shouldChangeSong = false;
    }
  };
}

export default Controls;
