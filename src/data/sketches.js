import WaveBeat from "library/WaveBeat";
import WaveBeatConstant from "library/WaveBeatConstant";
import SpectrumConstant from "library/SpectrumConstant";
import MicSpectrum from "library/MicSpectrum";
import RectangleArt from "library/RectangleArt";
import SpectrumArt from "library/SpectrumArt";
import CircularBeat from "library/CircularBeat";
import Particles from "library/Particles";
import Landing from "library/Landing";
import ParticlesArt from "library/ParticleArt";
import ParticleArt2 from "library/ParticleArt2";
import ParticleArt3 from "library/ParticleArt3";
import ParticleArt4 from "library/ParticleArt4";

const sketches = [
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
    label: "Waveform Art",
    path: "waveformConstant",
    component: <WaveBeatConstant />,
  },
  {
    label: "Live Particles",
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
    hidden: true,
  },
  {
    label: "Particles Art3",
    path: "particlesart3",
    component: <ParticleArt3 />,
    hidden: true,
  },
  {
    label: "Particles Art4",
    path: "particlesart4",
    component: <ParticleArt4 />,
    hidden: true,
  },
  {
    label: "Live Spectrum",
    path: "spectrum",
    component: <SpectrumConstant />,
  },
  {
    label: "Microphone Spectrum",
    path: "micSpectrum",
    component: <MicSpectrum />,
  },
  {
    label: "Spectrum Art",
    path: "spectrumArt",
    component: <SpectrumArt />,
    hidden: true,
  },
  {
    label: "Circular Beat Art",
    path: "circular",
    component: <CircularBeat />,
  },
  {
    label: "Rectangle Art",
    path: "rectArt",
    component: <RectangleArt />,
    hidden: true,
  },
];

export default sketches;
