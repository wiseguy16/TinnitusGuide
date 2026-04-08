import React, { useEffect, useRef, useState } from "react";
import lamejsBundle from "lamejs/lame.all.js?raw";
import { renderSimulationAudioBuffer, TinnitusSimulator } from "../audio/simulator";

const MODES = [
  {
    value: "ring",
    label: "High ringing",
    hint: "Good for sharp tonal tinnitus or whistle-like sounds.",
    defaults: { frequency: 6200, brightness: 0.75, roughness: 0.08, pulseRate: 2.5, loudness: 0.12 },
  },
  {
    value: "hiss",
    label: "Hiss / static",
    hint: "Good for airy, broadband, static-like internal sound.",
    defaults: { frequency: 2800, brightness: 0.78, roughness: 0.22, pulseRate: 2.5, loudness: 0.14 },
  },
  {
    value: "buzz",
    label: "Buzz / electrical",
    hint: "Good for rougher, more textured or electric-feeling sound.",
    defaults: { frequency: 950, brightness: 0.55, roughness: 0.5, pulseRate: 3.5, loudness: 0.12 },
  },
  {
    value: "hum",
    label: "Low hum",
    hint: "Good for lower-frequency droning or engine-like sound.",
    defaults: { frequency: 220, brightness: 0.3, roughness: 0.16, pulseRate: 1.8, loudness: 0.12 },
  },
  {
    value: "pulse",
    label: "Pulsing",
    hint: "Good for rhythmic, thumping, or heartbeat-like perception.",
    defaults: { frequency: 480, brightness: 0.45, roughness: 0.62, pulseRate: 1.4, loudness: 0.12 },
  },
];

const INITIAL_STATE = {
  mode: "ring",
  frequency: 6200,
  brightness: 0.75,
  roughness: 0.08,
  pulseRate: 2.5,
  loudness: 0.12,
};

const EXPORT_DURATION_SECONDS = 5;

let cachedLamejs = null;

function getLamejs() {
  if (cachedLamejs) {
    return cachedLamejs;
  }

  const factory = new Function(`${lamejsBundle}\nreturn lamejs;`);
  cachedLamejs = factory();
  return cachedLamejs;
}

function toMp3Blob(audioBuffer) {
  const samples = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const lamejs = getLamejs();
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  const blockSize = 1152;
  const mp3Chunks = [];

  const pcmSamples = new Int16Array(samples.length);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    pcmSamples[index] = sample < 0 ? sample * 32768 : sample * 32767;
  }

  for (let index = 0; index < pcmSamples.length; index += blockSize) {
    const sampleChunk = pcmSamples.subarray(index, index + blockSize);
    const mp3buf = encoder.encodeBuffer(sampleChunk);
    if (mp3buf.length > 0) {
      mp3Chunks.push(new Int8Array(mp3buf));
    }
  }

  const finalBuffer = encoder.flush();
  if (finalBuffer.length > 0) {
    mp3Chunks.push(new Int8Array(finalBuffer));
  }

  return new Blob(mp3Chunks, { type: "audio/mpeg" });
}

function buildExportFilename(params) {
  return `tinnitusguide-${params.mode}-${Math.round(params.frequency)}hz.mp3`;
}

function formatFrequency(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} kHz`;
  }

  return `${Math.round(value)} Hz`;
}

function describePitch(value) {
  if (value >= 8000) return "very high-pitched";
  if (value >= 4000) return "high-pitched";
  if (value >= 1800) return "upper-mid";
  if (value >= 700) return "mid-pitched";
  if (value >= 250) return "low-mid";
  return "low-pitched";
}

function describeBrightness(value) {
  if (value >= 0.8) return "very bright";
  if (value >= 0.6) return "bright";
  if (value >= 0.4) return "balanced";
  if (value >= 0.2) return "soft";
  return "very soft";
}

function describeRoughness(value) {
  if (value >= 0.75) return "highly rough or textured";
  if (value >= 0.5) return "noticeably rough";
  if (value >= 0.25) return "slightly rough";
  return "mostly smooth";
}

function describePulse(params) {
  if (params.mode !== "pulse" && params.roughness < 0.3) {
    return "not strongly pulsing";
  }

  if (params.pulseRate >= 5) {
    return "fast fluttering";
  }

  if (params.pulseRate >= 2.2) {
    return "moderately pulsing";
  }

  return "slow rhythmic pulsing";
}

function buildModePhrase(mode) {
  switch (mode) {
    case "ring":
      return "a tonal ringing sound";
    case "hiss":
      return "a hiss or static-like sound";
    case "buzz":
      return "a buzzing or electrical sound";
    case "hum":
      return "a low humming sound";
    case "pulse":
      return "a pulsing or thumping sound";
    default:
      return "an internal sound";
  }
}

function buildDescription(params, currentMode) {
  const pitchText = describePitch(params.frequency);
  const brightnessText = describeBrightness(params.brightness);
  const roughnessText = describeRoughness(params.roughness);
  const pulseText = describePulse(params);
  const loudnessText =
    params.loudness >= 0.18
      ? "more noticeable in level"
      : params.loudness >= 0.1
        ? "moderate in level"
        : "relatively soft in level";

  const summary = `The closest match is ${buildModePhrase(params.mode)} that feels ${pitchText}, ${brightnessText}, and ${roughnessText}. It is centered around ${formatFrequency(params.frequency)} and feels ${loudnessText}.`;

  const rhythm =
    params.mode === "pulse" || params.roughness >= 0.3
      ? `The sound pattern is ${pulseText}, around ${params.pulseRate.toFixed(1)} cycles per second.`
      : "The sound pattern feels mostly steady rather than strongly rhythmic.";

  const doctorScript = `I matched something closest to ${currentMode.label.toLowerCase()}, around ${formatFrequency(params.frequency)}. It feels ${brightnessText} and ${roughnessText}, and it is ${pulseText}.`;

  return { summary, rhythm, doctorScript };
}

export default function SoundExplorer() {
  const simulatorRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("Choose a sound type, then press play.");
  const [isExporting, setIsExporting] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [exportedSample, setExportedSample] = useState(null);

  if (!simulatorRef.current) {
    simulatorRef.current = new TinnitusSimulator();
  }

  useEffect(() => {
    if (isPlaying) {
      simulatorRef.current.update(params);
    }
  }, [params, isPlaying]);

  useEffect(() => {
    setExportedSample((current) => {
      if (current?.url) {
        window.URL.revokeObjectURL(current.url);
      }
      return null;
    });
    setShareStatus("");
  }, [params]);

  useEffect(() => () => {
    if (exportedSample?.url) {
      window.URL.revokeObjectURL(exportedSample.url);
    }
  }, [exportedSample]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    const drawIdle = () => {
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255, 255, 255, 0.03)";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(240, 167, 104, 0.18)";
      const bars = 40;
      const barWidth = width / bars;
      for (let index = 0; index < bars; index += 1) {
        const barHeight = 18 + Math.sin(index * 0.55) * 10;
        context.fillRect(index * barWidth + 2, height - barHeight - 16, barWidth - 5, barHeight);
      }
      context.fillStyle = "rgba(244, 239, 230, 0.5)";
      context.font = "12px sans-serif";
      context.fillText("Low", 10, height - 2);
      context.fillText("Mid", width / 2 - 12, height - 2);
      context.fillText("High", width - 34, height - 2);
    };

    const draw = () => {
      const data = simulatorRef.current?.getFrequencyData();
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255, 255, 255, 0.03)";
      context.fillRect(0, 0, width, height);

      if (!data || !isPlaying) {
        drawIdle();
        animationRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const bars = 48;
      const usableHeight = height - 20;
      const barWidth = width / bars;

      for (let index = 0; index < bars; index += 1) {
        const dataIndex = Math.min(
          data.length - 1,
          Math.floor((index / bars) ** 1.8 * data.length),
        );
        const magnitude = data[dataIndex] / 255;
        const boostedMagnitude = Math.max(0, magnitude - 0.035) / 0.965;
        const liftedMagnitude = Math.pow(boostedMagnitude, 0.44);
        const barHeight = Math.max(4, liftedMagnitude * usableHeight * 0.92);
        const x = index * barWidth + 2;
        const y = usableHeight - barHeight;
        const gradient = context.createLinearGradient(0, y, 0, usableHeight);
        gradient.addColorStop(0, "#ffd7aa");
        gradient.addColorStop(1, "#f0a768");
        context.fillStyle = gradient;
        context.fillRect(x, y, barWidth - 4, barHeight);
      }

      context.fillStyle = "rgba(244, 239, 230, 0.5)";
      context.font = "12px sans-serif";
      context.fillText("Low", 10, height - 2);
      context.fillText("Mid", width / 2 - 12, height - 2);
      context.fillText("High", width - 34, height - 2);
      animationRef.current = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const currentMode = MODES.find((mode) => mode.value === params.mode) ?? MODES[0];
  const description = buildDescription(params, currentMode);

  const applyMode = (mode) => {
    setParams((current) => ({
      ...current,
      mode: mode.value,
      ...mode.defaults,
    }));
    setStatus(mode.hint);
  };

  const handleTogglePlayback = async () => {
    if (isPlaying) {
      simulatorRef.current.stop();
      setIsPlaying(false);
      setStatus("Playback paused. Adjust the controls and try again.");
      return;
    }

    await simulatorRef.current.start(params);
    setIsPlaying(true);
    setStatus(
      "Use the controls to get closer to what you hear, then save your notes for an appointment.",
    );
  };

  const createExportedSample = async () => {
    const renderedBuffer = await renderSimulationAudioBuffer(params, {
      duration: EXPORT_DURATION_SECONDS,
    });
    const blob = toMp3Blob(renderedBuffer);
    const fileName = buildExportFilename(params);
    const url = window.URL.createObjectURL(blob);

    setExportedSample((current) => {
      if (current?.url) {
        window.URL.revokeObjectURL(current.url);
      }
      return { blob, fileName, url };
    });

    return { blob, fileName, url };
  };

  const handleDownloadMp3 = async () => {
    try {
      setIsExporting(true);
      setShareStatus("Preparing your 5-second MP3...");
      const sample = await createExportedSample();
      window.setTimeout(() => {
        const anchor = document.createElement("a");
        anchor.href = sample.url;
        anchor.download = sample.fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }, 0);
      setShareStatus("Your MP3 is ready below, and a download should start automatically.");
    } catch (error) {
      console.error(error);
      setShareStatus(
        error instanceof Error
          ? `We could not create the MP3 sample right now: ${error.message}`
          : "We could not create the MP3 sample right now.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareMp3 = async () => {
    try {
      setIsExporting(true);
      setShareStatus("Preparing your 5-second MP3...");
      const sample = exportedSample ?? await createExportedSample();
      const file = new File([sample.blob], sample.fileName, { type: "audio/mpeg" });

      if (
        navigator.share
        && navigator.canShare
        && navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "TinnitusGuide sample",
          text: "Here is a 5-second sample that matches what I hear most closely.",
          files: [file],
        });
        setShareStatus("Sample shared.");
        return;
      }

      setShareStatus("Sharing is not supported here, but your MP3 is ready below to download.");
    } catch (error) {
      if (error?.name === "AbortError") {
        setShareStatus("Sharing canceled.");
      } else {
        console.error(error);
        setShareStatus(
          error instanceof Error
            ? `We could not share the MP3 sample right now: ${error.message}`
            : "We could not share the MP3 sample right now.",
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="panel explorer-panel">
      <div className="panel-heading">
        <p className="eyebrow">Sound Explorer</p>
        <h2>Try to match what you hear</h2>
        <p className="muted-text">
          This is not diagnostic. It is a simple way to get closer to the sound
          you notice so you can describe it more clearly.
        </p>
      </div>

      <div className="mode-grid">
        {MODES.map((mode) => (
          <button
            className={params.mode === mode.value ? "mode-card active" : "mode-card"}
            key={mode.value}
            onClick={() => applyMode(mode)}
            type="button"
          >
            <strong>{mode.label}</strong>
            <span>{mode.hint}</span>
          </button>
        ))}
      </div>

      <div className="explorer-toolbar">
        <div className="explorer-actions">
          <button className="primary-button" onClick={handleTogglePlayback} type="button">
            {isPlaying ? "Pause sample" : "Play sample"}
          </button>
          <button
            className="secondary-button"
            disabled={isExporting}
            onClick={handleDownloadMp3}
            type="button"
          >
            {isExporting ? "Creating MP3..." : "Download 5-second MP3"}
          </button>
          <button
            className="ghost-button"
            disabled={isExporting}
            onClick={handleShareMp3}
            type="button"
          >
            Share sample
          </button>
        </div>
        <div className="explorer-status">
          <strong>{currentMode.label}</strong>
          <span>{status}</span>
          {shareStatus ? <span>{shareStatus}</span> : null}
        </div>
      </div>

      <div className="waveform-panel">
        <div className="field-row">
          <span>Real-time analyzer</span>
          <strong>{isPlaying ? "Live" : "Idle"}</strong>
        </div>
        <canvas
          aria-label="Real-time analyzer"
          className="waveform-canvas"
          height="180"
          ref={canvasRef}
          width="960"
        />
        <p className="muted-text">
          This view shows where the sample is carrying energy across low, mid,
          and high frequencies as you adjust the controls.
        </p>
        <p className="muted-text">
          You can export a 5-second MP3 from your current settings to text, email,
          or play during an appointment.
        </p>
        {exportedSample ? (
          <div className="export-card">
            <div className="field-row">
              <span>Generated sample</span>
              <strong>5-second MP3</strong>
            </div>
            <audio className="export-audio" controls src={exportedSample.url}>
              Your browser does not support audio playback.
            </audio>
            <div className="export-links">
              <a
                className="secondary-button export-link"
                download={exportedSample.fileName}
                href={exportedSample.url}
              >
                Download MP3
              </a>
              <span className="muted-text">{exportedSample.fileName}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="explorer-grid">
        <label className="field">
          <div className="field-row">
            <span>Pitch / center</span>
            <strong>{formatFrequency(params.frequency)}</strong>
          </div>
          <input
            max="16000"
            min="80"
            onChange={(event) =>
              setParams((current) => ({ ...current, frequency: Number(event.target.value) }))
            }
            step="10"
            type="range"
            value={params.frequency}
          />
        </label>

        <label className="field">
          <div className="field-row">
            <span>Brightness</span>
            <strong>{params.brightness.toFixed(2)}</strong>
          </div>
          <input
            max="1"
            min="0"
            onChange={(event) =>
              setParams((current) => ({ ...current, brightness: Number(event.target.value) }))
            }
            step="0.01"
            type="range"
            value={params.brightness}
          />
        </label>

        <label className="field">
          <div className="field-row">
            <span>Roughness</span>
            <strong>{params.roughness.toFixed(2)}</strong>
          </div>
          <input
            max="1"
            min="0"
            onChange={(event) =>
              setParams((current) => ({ ...current, roughness: Number(event.target.value) }))
            }
            step="0.01"
            type="range"
            value={params.roughness}
          />
        </label>

        <label className="field">
          <div className="field-row">
            <span>Pulse speed</span>
            <strong>{params.pulseRate.toFixed(1)} Hz</strong>
          </div>
          <input
            max="12"
            min="0.4"
            onChange={(event) =>
              setParams((current) => ({ ...current, pulseRate: Number(event.target.value) }))
            }
            step="0.1"
            type="range"
            value={params.pulseRate}
          />
        </label>

        <label className="field">
          <div className="field-row">
            <span>Sample loudness</span>
            <strong>{params.loudness.toFixed(2)}</strong>
          </div>
          <input
            max="0.25"
            min="0.02"
            onChange={(event) =>
              setParams((current) => ({ ...current, loudness: Number(event.target.value) }))
            }
            step="0.01"
            type="range"
            value={params.loudness}
          />
          <small>Keep this low. The goal is comparison, not strong masking.</small>
        </label>
      </div>

      <div className="appointment-card">
        <p className="eyebrow">Bring This To Your Appointment</p>
        <h3>How to describe what you matched right now</h3>
        <p>{description.summary}</p>
        <p>{description.rhythm}</p>
        <div className="appointment-example">
          <p>
            <strong>You could say:</strong> &ldquo;{description.doctorScript}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
