import React from "react";
import SoundExplorer from "./components/SoundExplorer";

const SOUND_TYPES = [
  {
    title: "High ringing",
    description: "Often described as a whistle, tone, or narrow high-frequency note.",
  },
  {
    title: "Hiss or static",
    description: "Often feels airy, broadband, or like sound leaking through silence.",
  },
  {
    title: "Buzz or electrical sound",
    description: "Often rougher or more textured, sometimes like wires, fluorescent lights, or insects.",
  },
  {
    title: "Low hum",
    description: "Often feels deeper, droning, or engine-like rather than sharp.",
  },
  {
    title: "Pulse or whoosh",
    description: "Often rhythmic or wave-like. If it feels heartbeat-like or new, it is worth clinical attention.",
  },
];

const CARE_FLAGS = [
  "A clearly pulsing or heartbeat-like sound",
  "Sudden hearing loss or a sudden change in tinnitus",
  "Strong dizziness, pain, or pressure with the sound",
  "One-sided symptoms that are new or rapidly worsening",
];

const DOCTOR_TIPS = [
  "Describe what it sounds like: ringing, hiss, buzz, hum, pulse, or a mix.",
  "Describe when you notice it most: silence, stress, fatigue, bedtime, or after loud sound.",
  "Say whether it seems high or low, steady or changing, one-sided or both ears.",
  "Bring notes about what made it feel better, worse, or easier to ignore.",
];

function HeroIllustration() {
  return (
    <svg viewBox="0 0 360 220" className="hero-art" aria-hidden="true">
      <circle cx="278" cy="70" r="48" className="hero-ring" />
      <circle cx="278" cy="70" r="26" className="hero-ring soft" />
      <path d="M18 136 C54 94, 88 94, 124 136 S196 178, 232 136 304 94, 342 124" className="hero-wave strong" />
      <path d="M18 154 C54 124, 88 122, 124 154 S196 186, 232 154 304 126, 342 146" className="hero-wave" />
      <path d="M18 172 C54 150, 88 148, 124 172 S196 194, 232 172 304 148, 342 164" className="hero-wave soft" />
    </svg>
  );
}

function HearingRangeGraphic() {
  return (
    <svg viewBox="0 0 320 110" className="inline-graphic" aria-hidden="true">
      <defs>
        <linearGradient id="rangeLine" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(79,144,180,0.35)" />
          <stop offset="55%" stopColor="rgba(79,144,180,0.7)" />
          <stop offset="100%" stopColor="rgba(201,141,83,0.7)" />
        </linearGradient>
      </defs>
      <rect x="12" y="22" width="296" height="66" rx="18" className="graphic-surface" />
      <path d="M30 70 H290" className="graphic-axis" />
      <path d="M42 68 C82 58, 106 48, 138 62 S204 84, 248 52 280 44, 290 48" className="graphic-spectrum" />
      <circle cx="84" cy="57" r="5" className="graphic-mark" />
      <circle cx="186" cy="72" r="5" className="graphic-mark soft" />
      <circle cx="256" cy="50" r="6" className="graphic-mark warm" />
      <text x="28" y="96" className="graphic-label">Low</text>
      <text x="146" y="96" className="graphic-label">Mid</text>
      <text x="262" y="96" className="graphic-label">High</text>
    </svg>
  );
}

function DescriptionGraphic() {
  return (
    <svg viewBox="0 0 320 120" className="inline-graphic" aria-hidden="true">
      <rect x="16" y="16" width="288" height="88" rx="20" className="graphic-surface" />
      <path d="M42 76 C62 46, 84 46, 104 76 S146 106, 166 76 208 46, 228 76 270 102, 286 66" className="graphic-wave cool" />
      <path d="M42 84 C62 68, 84 66, 104 84 S146 98, 166 84 208 64, 228 84 270 96, 286 88" className="graphic-wave soft" />
      <rect x="42" y="28" width="58" height="14" rx="7" className="graphic-chip cool" />
      <rect x="112" y="28" width="72" height="14" rx="7" className="graphic-chip soft" />
      <rect x="196" y="28" width="52" height="14" rx="7" className="graphic-chip warm" />
    </svg>
  );
}

function CareGraphic() {
  return (
    <svg viewBox="0 0 320 110" className="inline-graphic" aria-hidden="true">
      <rect x="16" y="18" width="288" height="74" rx="18" className="graphic-surface" />
      <circle cx="66" cy="55" r="18" className="graphic-alert-ring" />
      <path d="M66 44 v18" className="graphic-alert-line" />
      <circle cx="66" cy="69" r="2.8" className="graphic-alert-dot" />
      <path d="M110 44 H270" className="graphic-axis soft" />
      <path d="M110 58 H250" className="graphic-axis soft" />
      <path d="M110 72 H228" className="graphic-axis soft" />
    </svg>
  );
}

function SoundTypeGraphic({ title }) {
  switch (title) {
    case "High ringing":
      return (
        <svg viewBox="0 0 120 68" className="card-graphic" aria-hidden="true">
          <path d="M12 54 C24 22, 36 22, 48 54 S72 86, 84 30 100 14, 108 54" className="graphic-wave cool" />
        </svg>
      );
    case "Hiss or static":
      return (
        <svg viewBox="0 0 120 68" className="card-graphic" aria-hidden="true">
          <path d="M10 20 L18 48 L26 24 L34 50 L42 18 L50 48 L58 26 L66 50 L74 20 L82 46 L90 28 L98 48 L106 24" className="graphic-wave soft" />
        </svg>
      );
    case "Buzz or electrical sound":
      return (
        <svg viewBox="0 0 120 68" className="card-graphic" aria-hidden="true">
          <path d="M12 48 H26 V22 H42 V48 H58 V22 H74 V48 H90 V22 H108 V48" className="graphic-wave cool" />
        </svg>
      );
    case "Low hum":
      return (
        <svg viewBox="0 0 120 68" className="card-graphic" aria-hidden="true">
          <path d="M10 48 C24 36, 38 36, 52 48 S80 60, 94 48 108 36, 110 44" className="graphic-wave soft" />
        </svg>
      );
    case "Pulse or whoosh":
      return (
        <svg viewBox="0 0 120 68" className="card-graphic" aria-hidden="true">
          <path d="M12 48 H30 L38 24 L50 54 L62 18 L74 48 H108" className="graphic-wave warm" />
        </svg>
      );
    default:
      return null;
  }
}

export default function App() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">TinnitusGuide</p>
          <h1>Understand what you may be hearing before you try to explain it.</h1>
          <p className="hero-copy">
            TinnitusGuide is a companion education site for people trying to make
            sense of ringing, hissing, buzzing, humming, pulsing, or other internal
            sound. It helps you build language for what you hear and prepare for
            a better conversation with an ENT or audiologist.
          </p>
          <div className="hero-tags">
            <span>Education first</span>
            <span>Non-diagnostic</span>
            <span>Built for appointment prep</span>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="intro-grid">
        <article className="panel">
          <p className="eyebrow">What You May Be Hearing</p>
          <h2>Internal sound can take many forms.</h2>
          <HearingRangeGraphic />
          <p>
            Not everybody hears the same way. Some people notice an extra layer
            of sound that other people do not hear. The medical word often used
            for that experience is tinnitus.
          </p>
          <p className="muted-text">
            It may feel sharp, airy, droning, electrical, pulsing, or hard to
            describe. That is why this guide starts with observation, not jargon.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">Why Description Matters</p>
          <h2>Better words can reduce frustration.</h2>
          <p>
            Many people know something feels wrong long before they know how to
            describe it. The more clearly you can describe pitch, roughness,
            rhythm, and timing, the easier it is to discuss with a clinician.
          </p>
          <p className="muted-text">
            The goal here is not diagnosis. The goal is a clearer, calmer
            description of your own perception.
          </p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <p className="eyebrow">Types Of Tinnitus Sounds</p>
          <h2>Common ways people describe what they hear</h2>
        </div>
        <div className="sound-grid">
          {SOUND_TYPES.map((item) => (
            <article className="sound-card" key={item.title}>
              <SoundTypeGraphic title={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <p className="eyebrow">How To Describe It</p>
          <h2>Use simple listening categories</h2>
        </div>
        <DescriptionGraphic />
        <div className="describe-grid">
          <article className="describe-card">
            <h3>Pitch</h3>
            <p>Does it feel high, low, or somewhere in the middle?</p>
          </article>
          <article className="describe-card">
            <h3>Tone vs noise</h3>
            <p>Is it a clear pitch, a hiss, a buzz, a hum, or a blend?</p>
          </article>
          <article className="describe-card">
            <h3>Steady vs changing</h3>
            <p>Does it stay the same, flutter, pulse, or change over time?</p>
          </article>
          <article className="describe-card">
            <h3>When it shows up</h3>
            <p>Is it worse in silence, at night, during stress, or after loud sound?</p>
          </article>
        </div>
      </section>

      <SoundExplorer />

      <section className="care-grid">
        <article className="panel">
          <p className="eyebrow">When To Seek Care</p>
          <h2>Some patterns deserve earlier attention.</h2>
          <CareGraphic />
          <ul className="checklist">
            {CARE_FLAGS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="muted-text">
            TinnitusGuide is educational only. New, pulsing, or suddenly changing
            symptoms should be evaluated clinically.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">How To Talk To A Doctor</p>
          <h2>Bring concrete details, not just one word.</h2>
          <ul className="checklist">
            {DOCTOR_TIPS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
