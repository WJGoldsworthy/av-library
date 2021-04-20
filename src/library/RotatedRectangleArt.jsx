import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound'

function RotatedRectangleArt() {
  let song;
  let fft;
  let fft0;
  let trends; // 1 for increasing trend, 0 for equal or decreasing
  let fftSize = 16;
  let opacityFill = 0.05;
  let amp;
  let colorSelect = 2;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const colors = [
      ['#ff2328', '#ead2d7', '#bd6bd7', '#1d1564'],
      [
        '#ED3312',
        '#0E1428',
        '#7B9E89',
        '#FFFFFF'
    ],        
    [
        '#fdfc6e',
        '#07dfe3',
        '#fdf7f7',
        '#FFFFFF'
    ],
    [
        '#fd4339',
        '#4f32c8',
        '#edddde',
        '#FFFFFF'
    ],
    [
        '#ffffff',
        '#656565',
        '#ffffff',
        '#FFFFFF'
    ]
    ]

  const preload = (p5) => {
    song = p5.loadSound("assets/audio/4040.mp3");
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    fft = new p5.constructor.FFT(0.8, fftSize);
    amp = new p5.constructor.Amplitude();
    song.play();
    fft0 = Array.apply(null, Array(fftSize)).map(() => 0);
    trends = Array.apply(null, Array(fftSize)).map(() => 0); 
    p5.background(0);
  }

  const draw = p5 => {
    let spectrum = fft.analyze();
    p5.noStroke();
    spectrum.forEach((bin, index) => {
      if (trends[index] && bin === fft0[index]) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        let c = hexToRgbA(colors[colorSelect][col]);
        c = c.replace("1)", "" + opacityFill + ")");  
        p5.fill(c)
        let level = amp.getLevel();
        p5.rotate(Math.PI / level)
        p5.rect(Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(bin), Math.floor(bin));
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

  const hexToRgbA = function(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}
  
  return <Sketch preload={preload} setup={setup} draw={draw} />
}

export default RotatedRectangleArt;