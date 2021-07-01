import WaveBeat from "library/WaveBeat";
import WaveBeatConstant from "library/WaveBeatConstant";
import SpectrumConstant from "library/SpectrumConstant";
import MicSpectrum from "library/MicSpectrum";
import RotatedRectangleLive from "library/RotatedRectangleLive";
import RotatedRectangleArt from "library/RotatedRectangleArt";
import RectangleArt from "library/RectangleArt";
import RectangleGrid from "library/RectangleGrid";
import SpectrumArt from "library/SpectrumArt";
import SpectrumArt2 from "library/SpectrumArt2";
import PeakDetect from "library/PeakDetectTest";
import CircularBeat from "library/CircularBeat";
import ParticlesOld from "library/ParticlesOld";
import Particles from "library/Particles";
import Demo from "library/demo";
import Landing from "library/Landing";
import Lines from "library/Lines";
import ParticlesArt from "library/ParticleArt";
import ParticleArt2 from "library/ParticleArt2";
import ParticleArt3 from "library/ParticleArt3";
import ParticleArt4 from "library/ParticleArt4";
import MicParticles from "library/MicParticles";

export default [
  {
    label: "Home",
    path: "",
    component: <Landing />,
  },
  {
    label: "Waveform",
    path: "waveform",
    component: <WaveBeat />,
  },
  {
    label: "Waveform Constant",
    path: "waveformConstant",
    component: <WaveBeatConstant />,
  },
  {
    label: "Particles",
    path: "particles",
    component: <Particles />,
  },
  {
    label: "Particles Art",
    path: "particlesart",
    component: <ParticlesArt />,
  },
  {
    label: "Particles Art2",
    path: "particlesart2",
    component: <ParticleArt2 />,
  },
  {
    label: "Particles Art3",
    path: "particlesart3",
    component: <ParticleArt3 />,
  },
  {
    label: "Particles Art4",
    path: "particlesart4",
    component: <ParticleArt4 />,
  },
  // {
  //   label: "Peak Detect",
  //   path: "peakDetect",
  //   component: <PeakDetect />,
  // },
  {
    label: "Mic Spectrum",
    path: "micSpectrum",
    component: <MicSpectrum />,
  },
  {
    label: "Spectrum Art",
    path: "spectrumArt",
    component: <SpectrumArt />,
  },
  // {
  //   label: "Spectrum Art2",
  //   path: "spectrumArt2",
  //   component: <SpectrumArt2 />,
  // },
  {
    label: "Circular Beat",
    path: "circular",
    component: <CircularBeat />,
  },
  // {
  //   label: "Rotating Rectangle Live",
  //   path: "rotRectLive",
  //   component: <RotatedRectangleLive />,
  // },
  // {
  //   label: "Rotating Rectangle Art",
  //   path: "rotRectArt",
  //   component: <RotatedRectangleArt />,
  // },
  {
    label: "Rectangle Art",
    path: "rectArt",
    component: <RectangleArt />,
  },
  // {
  //   label: "Rectangle Grid",
  //   path: "rectGrid",
  //   component: <RectangleGrid />,
  // },
  {
    label: "Spectrum",
    path: "spectrum",
    component: <SpectrumConstant />,
  },
];
