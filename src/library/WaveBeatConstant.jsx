import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound'

function WaveBeatConstant() {
  let song;
  let fft;
  let fftSize = 64;
  let opacityFill = 1;
  let peakDetect;
  let colorSelect = 2;
  let fft2;
  let drawFreq = 128;

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
    song = p5.loadSound("assets/audio/fredAgain.mp3");
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    fft = new p5.constructor.FFT(0.8, fftSize);
    fft2 = new p5.constructor.FFT(0.8, drawFreq);
    peakDetect = new p5.constructor.PeakDetect();
    song.play();
    p5.background(1);
  }

  const draw = p5 => {
    // let spectrum = fft.analyze();
    // let lines = spectrum.filter((item, index) => !(index % numLines));
    p5.noFill();
    p5.background(1);

    // lines.forEach((bin, index) => {
      let col = Math.floor(Math.random() * 4);
      let c = hexToRgbA(colors[colorSelect][col]);
      c = c.replace("1)", "" + opacityFill + ")");  
      let waveform = fft2.waveform();
      p5.beginShape();
      p5.stroke(c);
      for(let i = 0; i < waveform.length; i++) {
          let x = p5.map(i, 0, waveform.length, 0, width);
          let y = p5.map( waveform[i], -1, 1, 0, height);
          p5.vertex(x,y);
      }
      p5.endShape();
    // })
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

export default WaveBeatConstant;