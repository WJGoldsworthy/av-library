import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound'

function SpectrumConstant() {
  let song;
  let fft;
  let fftSize = 64; // 2, 4, 8, 32, 64, 128, 256, 512
  let opacityFill = 1; // 0.04 1
  let amp;
  let colorSelect = 0;
  let fft2;
  let drawFreq = 128;
  let backgroundFill = true;
  let maxLevel = 0;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const heightStart = height - 100;
  const heightEnd = 100;

  const colors = [
    ["#59c9a5","#d81e5b","#fffd98", "#23395b"],
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
    ],
    ]

  const preload = (p5) => {
    song = p5.loadSound("assets/audio/ego.mp3");
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    fft = new p5.constructor.FFT(0.8, fftSize);
    fft2 = new p5.constructor.FFT(0.8, drawFreq);
    amp =  new p5.constructor.Amplitude();
    song.play();
    p5.background(1);
  }

  const draw = p5 => {
    let spectrum = fft.analyze();
    p5.noFill();
    // p5.fill(1)
    if (backgroundFill) {
      // Black: 1
      // 'rgba(255, 255, 255, 0.1)'
      p5.background('rgba(0, 0, 0, 0.01)');
    }
    let level = amp.getLevel();
    if (level > maxLevel) {
      maxLevel = level;
    }
    let colorPick = 1;
    if(maxLevel > 0) {
      colorPick = Math.floor(p5.map(level, 0, maxLevel, 0, colors[colorSelect].length - 1));
    }
    let c = hexToRgbA(colors[colorSelect][colorPick]);
    c = c.replace("1)", "" + opacityFill + ")");  
    p5.beginShape();
    p5.stroke(c);
    for(let i = 0; i < (spectrum.length * 2); i++) {
      if (i < spectrum.length) {
        let x = p5.map(fftSize - i, 0, spectrum.length, 0, width / 2 );
        let y = p5.map( spectrum[i], 0, 255, heightStart, (height / 2) - (height / 4));
        p5.vertex(x,y);
      } else {
        let x = p5.map((fftSize * 2) - i, 0, spectrum.length, width / 2, width);
        let y = p5.map(spectrum[((fftSize * 2) - 1 - i)], 0, 255, heightStart, (height / 2) - (height / 4));
        p5.vertex(x,y);
      }
    }
    p5.endShape();
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

export default SpectrumConstant;