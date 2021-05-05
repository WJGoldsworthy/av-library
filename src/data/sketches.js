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

export default [
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
