import React, { useEffect, useRef, useState } from "react";
import { TinnitusSimulator } from "../audio/simulator";

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

function formatFrequency(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} kHz`;
  }

  return `${Math.round(value)} Hz`;
}

export default function SoundExplorer() {
  const simulatorRef = useRef(null);
  const [params, setParams] = useState(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("Choose a sound type, then press play.");

  if (!simulatorRef.current) {
    simulatorRef.current = new TinnitusSimulator();
  }

  useEffect(() => {
    if (isPlaying) {
      simulatorRef.current.update(params);
    }
  }, [params, isPlaying]);

  const currentMode = MODES.find((mode) => mode.value === params.mode) ?? MODES[0];

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
        <button className="primary-button" onClick={handleTogglePlayback} type="button">
          {isPlaying ? "Pause sample" : "Play sample"}
        </button>
        <div className="explorer-status">
          <strong>{currentMode.label}</strong>
          <span>{status}</span>
        </div>
      </div>

      <div className="explorer-grid">
        <label className="field">
          <div className="field-row">
            <span>Pitch / center</span>
            <strong>{formatFrequency(params.frequency)}</strong>
          </div>
          <input
            max="9000"
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
        <h3>How to describe what you matched</h3>
        <ul>
          <li>Closest match: <strong>{currentMode.label.toLowerCase()}</strong></li>
          <li>Pitch / center: <strong>{formatFrequency(params.frequency)}</strong></li>
          <li>Brightness: <strong>{params.brightness.toFixed(2)}</strong></li>
          <li>Roughness: <strong>{params.roughness.toFixed(2)}</strong></li>
          <li>Pulsing quality: <strong>{params.pulseRate.toFixed(1)} Hz</strong></li>
        </ul>
      </div>
    </section>
  );
}
