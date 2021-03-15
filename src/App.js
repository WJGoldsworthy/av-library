import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound'

function App() {
  let song;
  let fft;
  let fft0;
  let trends; // 1 for increasing trend, 0 for equal or decreasing
  let fftSize = 16;

  const rectWidth = window.innerWidth / 4;
  const rectHeight = window.innerHeight / 3;
  const colors = ['#ff2328', '#ead2d7', '#bd6bd7', '#1d1564']

  const preload = (p5) => {
    song = p5.loadSound("assets/audio/apricots.mp3");
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    fft = new p5.constructor.FFT(0.8, fftSize);
    song.play();
    console.log(fft);
    fft0 = Array.apply(null, Array(fftSize)).map(() => 0);
    trends = Array.apply(null, Array(fftSize)).map(() => 0); 
  }

  const draw = p5 => {
    p5.background(0, 10);
    let spectrum = fft.analyze();
    p5.noStroke();
    // if (Math.floor(Math.random() * 200) > 198) {
    //   console.log(["spectrum",spectrum]);
    //   console.log(["trends", trends]);
    //   console.log(["fft0",fft0])
    // }
    spectrum.forEach((bin, index) => {
      if (trends[index] && bin === fft0[index]) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        p5.fill(colors[col])
        p5.rect(rectWidth * col, rectHeight * row, rectWidth, rectHeight)
      }
      trends[index] = determineTrend(bin, fft0[index])
    })
    trends[8] = determineTrend(spectrum[8], fft0[8])
    fft0 = spectrum;
  }

  const determineTrend = (current, previous) => {
    if (current > previous) {
      return 1
    }
    return 0;
  }
  
  return <Sketch preload={preload} setup={setup} draw={draw} />
}

export default App;
