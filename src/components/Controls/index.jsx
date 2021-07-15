import React, { useState } from "react";
import songNames, { musicData } from "data/songNames";
import "./styles.scss";
import config from "config";
import { ReactComponent as Play } from "../../assets/images/play.svg";
import { ReactComponent as Pause } from "../../assets/images/pause.svg";
import { ReactComponent as Previous } from "../../assets/images/before.svg";
import { ReactComponent as Next } from "../../assets/images/next.svg";
import { ReactComponent as Stop } from "../../assets/images/stop.svg";
import { ReactComponent as Playlist } from "../../assets/images/playlist.svg";
import { ReactComponent as Close } from "../../assets/images/closeMenu.svg";
import { ReactComponent as Open } from "../../assets/images/open.svg";

const Controls = ({ sketch }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSong, setCurrentSong] = useState();
  const [openSelect, setOpenSelect] = useState(false);
  const [open, setOpen] = useState(true);

  const pausePlaySong = () => {
    if (sketch.song.isPlaying()) {
      sketch.song.pause();
      setIsPlaying(false);
    } else {
      sketch.song.play();
      setIsPlaying(true);
    }
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

  const selectSong = (song) => {
    sketch.changeSong(song);
    setCurrentSong(song);
    setOpenSelect(false);
  };

  const getSongDetails = (song) => {
    if (!song) {
      return [{ name: "loading", artist: "loading" }];
    }
    return musicData.filter((track) => track.file === song);
  };

  return (
    <div className={`c-controls ${!open && "closed"}`}>
      <div
        onClick={() => setOpen(!open)}
        className={`c-controls__open-close ${open && "open"}`}
      >
        <Open />
      </div>
      <div className="c-controls-container">
        <p>
          {currentSong
            ? getSongDetails(currentSong)[0].name
            : getSongDetails(sketch.currentSong)[0].name}
        </p>
        <p className="c-controls__artist">
          {currentSong
            ? getSongDetails(currentSong)[0].artist
            : getSongDetails(sketch.currentSong)[0].artist}
        </p>
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
      <div className="c-controls-song-select">
        <Playlist onClick={() => setOpenSelect(!openSelect)} />
      </div>
      {openSelect && (
        <div className="c-controls-select-modal">
          <div className="c-controls-select-modal__background"></div>
          <Close
            className="c-controls-select-modal__close"
            onClick={() => setOpenSelect(false)}
          />
          <div className="c-controls-select-modal__content">
            {musicData.map((track) => (
              <div onClick={() => selectSong(track.file)}>
                <p>{track.name}</p>
                <p>{track.artist}</p>
              </div>
            ))}
          </div>
        </div>
      )}
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
        if (options.callback) {
          options.callback(p5);
        }
      }
    );
    this.shouldChangeSong = false;
    this.currentSong = options?.currentSong ? options.currentSong : "apricots";
    this.changeSong = this.changeSong.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.setAmp = this.setAmp.bind(this);
    this.options = options;
  }

  setOptions = (options) => {
    this.options = options;
  };

  setAmp = () => {
    this.amp = new this.p5.constructor.Amplitude();
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
