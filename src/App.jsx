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

      <section className="panel appointment-panel">
        <p className="eyebrow">Bring This Description</p>
        <h2>A simple format you can use in an appointment</h2>
        <div className="appointment-example">
          <p>
            <strong>Example:</strong> “The sound I notice is closest to a high
            ringing tone with a little hiss mixed in. I notice it most in quiet
            rooms and at bedtime. It seems easier to ignore when there is soft
            background sound. It is usually steady, not pulsing.”
          </p>
        </div>
      </section>
    </main>
  );
}
