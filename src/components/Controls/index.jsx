import React, { useEffect, useState } from "react";
import songNames from "data/songNames";
import "./styles.scss";
import config from "config";
import { ReactComponent as Play } from "../../assets/images/play.svg";
import { ReactComponent as Pause } from "../../assets/images/pause.svg";
import { ReactComponent as Previous } from "../../assets/images/before.svg";
import { ReactComponent as Next } from "../../assets/images/next.svg";
import { ReactComponent as Stop } from "../../assets/images/stop.svg";

const Controls = ({ song, selectColors, sketch }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSong, setCurrentSong] = useState();

  const pausePlaySong = () => {
    if (sketch.song.isPlaying()) {
      sketch.song.pause();
      setIsPlaying(false);
    } else {
      sketch.song.play();
      setIsPlaying(true);
    }
  };

  const changeSong = (e) => {
    sketch.changeSong(e);
    setIsPlaying(true);
  };

  const clearCanvas = () => {
    sketch.clearCanvas();
  };

  const previousSong = () => {
    const currentIndex = songNames.indexOf(sketch.currentSong);
    const newSong =
      songNames[currentIndex ? currentIndex - 1 : songNames.length];
    sketch.changeSong(newSong);
    setCurrentSong(newSong);
  };

  const nextSong = () => {
    const currentIndex = songNames.indexOf(sketch.currentSong);
    const newSong =
      songNames[currentIndex === songNames.length ? 0 : currentIndex + 1];
    sketch.changeSong(newSong);
    setCurrentSong(newSong);
  };

  return (
    <div className="c-controls">
      {/* <button onClick={() => clearCanvas()}>Clear Canvas</button>
      <button onClick={() => pausePlaySong()}>Play/Pause</button>
      <select defaultValue={currentSong} onChange={(e) => changeSong(e)}>
        {songNames.map((name) => (
          <option value={name}>{name.substring(0, name.length - 4)}</option>
        ))}
      </select> */}
      <div className="c-controls-container">
        <p>{currentSong ? currentSong : sketch.currentSong}</p>
        <div className="c-controls-buttons">
          <Previous onClick={() => previousSong()} />
          {!isPlaying ? (
            <Play
              onClick={() => {
                pausePlaySong();
              }}
            />
          ) : (
            <Pause
              onClick={() => {
                pausePlaySong();
              }}
            />
          )}
          <Stop onClick={() => pausePlaySong()} />
          <Next onClick={() => nextSong()} />
        </div>
      </div>
    </div>
  );
};

export class SketchInstance {
  constructor(p5, options) {
    this.p5 = p5;
    this.isLoaded = false;
    this.fft = new p5.constructor.FFT(
      0.6,
      options?.fftSize ? options.fftSize : 64
    );
    this.song = p5.loadSound(
      `${config.s3Url}/audio/${
        options?.currentSong ? options.currentSong : "apricots"
      }.mp3`,
      () => {
        this.song.play();
        this.isLoaded = true;
      }
    );
    this.shouldChangeSong = false;
    this.currentSong = options?.currentSong ? options.currentSong : "apricots";
    this.changeSong = this.changeSong.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.options = options;
  }

  setOptions = (options) => {
    this.options = options;
  };

  changeSong = (newSong) => {
    this.currentSong = newSong;
    this.shouldChangeSong = true;
  };

  clearCanvas = () => {
    this.p5.background(1);
  };

  checkOptions = (callback) => {
    if (this.shouldChangeSong) {
      this.song.pause();
      this.song = this.p5.loadSound(
        `${config.s3Url}/audio/${this.currentSong}.mp3`,
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
