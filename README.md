# TinnitusGuide

TinnitusGuide is a companion education site focused on helping people understand and describe the internal sounds they notice, such as ringing, hissing, buzzing, humming, or pulsing.

It is designed to complement a tool like SereniTone by doing a different job:

- education first
- self-understanding first
- clearer language for appointments
- simple, non-diagnostic sound exploration

## What It Includes

- a calm educational homepage
- explanations of common tinnitus sound types
- guidance on how to describe pitch, tone, hiss, buzz, hum, and pulse
- information on when to seek care
- tips for talking with an ENT or audiologist
- appointment-ready example language
- an in-browser sound explorer for approximating what a user hears

## Why This Exists

Many people know that something sounds “off” long before they know how to describe it.

TinnitusGuide is meant to reduce that gap. It helps users:

- build vocabulary for what they hear
- compare different sound qualities
- prepare better notes for medical appointments
- feel more oriented before using a sound-support tool

## Sound Explorer

The included `Sound Explorer` is not diagnostic. It is a simple browser-based comparison tool that lets a user experiment with:

- high ringing
- hiss / static
- buzz / electrical texture
- low hum
- pulsing

Users can adjust:

- pitch / center frequency
- brightness
- roughness
- pulse speed
- sample loudness

The goal is to help them say, “This is closer to what I hear,” not to measure tinnitus clinically.

## Running Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL, usually `http://127.0.0.1:5173/`.

## Deploying To GitHub Pages

This project is set up to deploy to GitHub Pages through GitHub Actions.

### One-time GitHub setup

1. Push the project to the `wiseguy16/TinnitusGuide` repository.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Make sure your default branch is `main`.

### Deploy flow

Every push to `main` will trigger the workflow in [`.github/workflows/deploy.yml`](/Users/gwe48a/Documents/CodexCode/TinnitusGuide/.github/workflows/deploy.yml) and publish the contents of `dist/` to GitHub Pages.

The Vite config in [`vite.config.js`](/Users/gwe48a/Documents/CodexCode/TinnitusGuide/vite.config.js) automatically sets the correct base path for:

- a project site such as `https://wiseguy16.github.io/TinnitusGuide/`
- or a root Pages site such as `https://wiseguy16.github.io/`

### Notes

- The `Sound Explorer` runs entirely in the browser, so audio still requires a user interaction before playback.
- If you rename the repository later, the published base path will also change.

## Tech Stack

- React
- Vite
- Web Audio API

## Scope Notes

TinnitusGuide is intentionally:

- non-diagnostic
- browser-based
- educational
- focused on perception description, not treatment claims

It does not provide medical diagnosis, hearing testing, or clinician interpretation.
