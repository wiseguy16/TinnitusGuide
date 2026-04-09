const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const MASTER_OUTPUT_SCALE = 0.32;

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function wireSimulationGraph(context, destination, params, noiseBuffer) {
  const {
    mode,
    frequency,
    loudness,
    brightness,
    roughness,
    pulseRate,
  } = params;

  const outputGain = context.createGain();
  outputGain.gain.value = clamp(loudness * MASTER_OUTPUT_SCALE, 0, 0.35);
  outputGain.connect(destination);

  const startedNodes = [];

  const makeOsc = (type, freq, gainValue) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(outputGain);
    startedNodes.push(osc);
    return { osc, gain };
  };

  let primaryOsc = null;

  if (mode === "ring") {
    ({ osc: primaryOsc } = makeOsc("sine", frequency, 1));
  }

  if (mode === "hum") {
    ({ osc: primaryOsc } = makeOsc("triangle", clamp(frequency * 0.35, 50, 300), 0.7));
    makeOsc("sine", clamp(frequency * 0.7, 70, 420), 0.28);
  }

  if (mode === "buzz") {
    ({ osc: primaryOsc } = makeOsc("square", clamp(frequency, 80, 2000), 0.6));
    makeOsc("sawtooth", clamp(frequency * 1.02, 80, 2200), 0.22);
  }

  if (mode === "hiss" || mode === "pulse") {
    const noiseSource = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 800 + brightness * 5200;
    noiseFilter.Q.value = 0.5 + roughness * 6;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(outputGain);
    startedNodes.push(noiseSource);
  }

  if (mode === "pulse" || roughness > 0.01) {
    const modulationOsc = context.createOscillator();
    const modulationGain = context.createGain();
    modulationOsc.type = mode === "pulse" ? "square" : "sine";
    modulationOsc.frequency.value =
      mode === "pulse" ? clamp(pulseRate, 0.4, 12) : 2 + roughness * 28;
    modulationGain.gain.value =
      mode === "pulse"
        ? clamp(0.35 + roughness * 0.55, 0.2, 0.9)
        : clamp(roughness * 0.22, 0, 0.18);
    modulationOsc.connect(modulationGain);
    modulationGain.connect(outputGain.gain);
    outputGain.gain.value = clamp(loudness * MASTER_OUTPUT_SCALE, 0, 0.28);
    startedNodes.push(modulationOsc);
  }

  if (primaryOsc && mode !== "pulse") {
    const detune = context.createOscillator();
    const detuneGain = context.createGain();
    detune.type = "sine";
    detune.frequency.value = 0.2 + roughness * 7;
    detuneGain.gain.value = mode === "ring" ? 18 + roughness * 70 : 4 + roughness * 24;
    detune.connect(detuneGain);
    detuneGain.connect(primaryOsc.detune);
    startedNodes.push(detune);
  }

  startedNodes.forEach((node) => node.start(0));
}

export async function renderSimulationAudioBuffer(
  params,
  { duration = 5, sampleRate = 44100 } = {},
) {
  const frameCount = Math.floor(duration * sampleRate);
  const OfflineAudioContextClass =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;

  if (!OfflineAudioContextClass) {
    throw new Error("Offline audio rendering is not supported in this browser.");
  }

  const offlineContext = new OfflineAudioContextClass(1, frameCount, sampleRate);
  const noiseBuffer = createNoiseBuffer(offlineContext);
  wireSimulationGraph(offlineContext, offlineContext.destination, params, noiseBuffer);
  return offlineContext.startRendering();
}

export class TinnitusSimulator {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.analyser = null;
    this.frequencyData = null;
    this.primaryOsc = null;
    this.secondaryOsc = null;
    this.noiseSource = null;
    this.noiseFilter = null;
    this.modulationOsc = null;
    this.modulationGain = null;
    this.noiseBuffer = null;
    this.isPlaying = false;
  }

  async ensureReady() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContextClass();
      this.masterGain = this.context.createGain();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.91;
      this.analyser.minDecibels = -110;
      this.analyser.maxDecibels = -10;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.noiseBuffer = createNoiseBuffer(this.context);
    }

    if (this.context.state !== "running") {
      await this.context.resume();
    }
  }

  createNoiseSource() {
    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    return source;
  }

  stopNodes() {
    [this.primaryOsc, this.secondaryOsc, this.noiseSource, this.modulationOsc].forEach((node) => {
      try {
        node?.stop?.();
      } catch {}
      try {
        node?.disconnect?.();
      } catch {}
    });

    [this.noiseFilter, this.modulationGain].forEach((node) => {
      try {
        node?.disconnect?.();
      } catch {}
    });

    this.primaryOsc = null;
    this.secondaryOsc = null;
    this.noiseSource = null;
    this.noiseFilter = null;
    this.modulationOsc = null;
    this.modulationGain = null;
  }

  buildGraph(params) {
    this.stopNodes();

    const {
      mode,
      frequency,
      loudness,
      brightness,
      roughness,
      pulseRate,
    } = params;

    const master = this.masterGain;
    const outputGain = this.context.createGain();
    outputGain.gain.value = clamp(loudness * MASTER_OUTPUT_SCALE, 0, 0.35);
    outputGain.connect(master);

    const makeOsc = (type, freq, gainValue) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = gainValue;
      osc.connect(gain);
      gain.connect(outputGain);
      osc.start();
      return { osc, gain };
    };

    if (mode === "ring") {
      const { osc } = makeOsc("sine", frequency, 1);
      this.primaryOsc = osc;
    }

    if (mode === "hum") {
      const { osc: primary } = makeOsc("triangle", clamp(frequency * 0.35, 50, 300), 0.7);
      const { osc: secondary } = makeOsc("sine", clamp(frequency * 0.7, 70, 420), 0.28);
      this.primaryOsc = primary;
      this.secondaryOsc = secondary;
    }

    if (mode === "buzz") {
      const { osc: primary } = makeOsc("square", clamp(frequency, 80, 2000), 0.6);
      const { osc: secondary } = makeOsc("sawtooth", clamp(frequency * 1.02, 80, 2200), 0.22);
      this.primaryOsc = primary;
      this.secondaryOsc = secondary;
    }

    if (mode === "hiss" || mode === "pulse") {
      this.noiseSource = this.createNoiseSource();
      this.noiseFilter = this.context.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.value = 800 + brightness * 5200;
      this.noiseFilter.Q.value = 0.5 + roughness * 6;
      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(outputGain);
      this.noiseSource.start();
    }

    if (mode === "pulse" || roughness > 0.01) {
      this.modulationOsc = this.context.createOscillator();
      this.modulationGain = this.context.createGain();
      this.modulationOsc.type = mode === "pulse" ? "square" : "sine";
      this.modulationOsc.frequency.value =
        mode === "pulse" ? clamp(pulseRate, 0.4, 12) : 2 + roughness * 28;
      this.modulationGain.gain.value =
        mode === "pulse"
          ? clamp(0.35 + roughness * 0.55, 0.2, 0.9)
          : clamp(roughness * 0.22, 0, 0.18);
      this.modulationOsc.connect(this.modulationGain);
      this.modulationGain.connect(outputGain.gain);
      outputGain.gain.value = clamp(loudness * MASTER_OUTPUT_SCALE, 0, 0.28);
      this.modulationOsc.start();
    }

    if (this.primaryOsc && mode !== "pulse") {
      const detune = this.context.createOscillator();
      const detuneGain = this.context.createGain();
      detune.type = "sine";
      detune.frequency.value = 0.2 + roughness * 7;
      detuneGain.gain.value = mode === "ring" ? 18 + roughness * 70 : 4 + roughness * 24;
      detune.connect(detuneGain);
      detuneGain.connect(this.primaryOsc.detune);
      detune.start();
      this.modulationOsc = this.modulationOsc || detune;
      this.modulationGain = this.modulationGain || detuneGain;
    }
  }

  async start(params) {
    await this.ensureReady();
    this.isPlaying = true;
    this.buildGraph(params);
    this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.context.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.08);
  }

  update(params) {
    if (!this.context || !this.isPlaying) {
      return;
    }

    this.buildGraph(params);
  }

  stop() {
    if (!this.context || !this.masterGain) {
      return;
    }

    this.isPlaying = false;
    this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.context.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.08);
    window.setTimeout(() => this.stopNodes(), 120);
  }

  getFrequencyData() {
    if (!this.analyser || !this.frequencyData) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }
}
