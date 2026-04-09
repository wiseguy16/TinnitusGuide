# TinnitusGuide

TinnitusGuide is a browser-based education and self-description companion site for people trying to make sense of ringing, hissing, buzzing, humming, pulsing, or other internal sound.

It does not try to soothe the sound directly. Instead, it helps the user understand what they may be hearing, build language around it, and prepare for clearer conversations with clinicians. It also links into `SereniTone` when the user is ready to try supportive sound relief.

## Who It's For

TinnitusGuide is for people who:

- notice internal sound but do not know how to describe it
- feel frustrated trying to explain what they hear to an ENT or audiologist
- want a calmer, clearer explanation of tinnitus-related sound qualities
- want a safe, non-diagnostic tool to compare pitch, hiss, buzz, hum, and pulse

It is especially useful for people in the “confused but motivated” stage: they know something is happening, but do not yet have good vocabulary for it.

## Problem

Many people know that something sounds “off” long before they know how to describe it.

That creates several problems:

- they struggle to explain the sound itself
- they do not know which parts matter clinically
- they feel overwhelmed by jargon
- they arrive at appointments with vague language like “ringing” that misses important detail

There is an opportunity to create a better first step: a clear, non-diagnostic site that helps people observe, compare, and describe their tinnitus-like sound before moving into either medical conversation or relief-oriented tools.

## Solution

TinnitusGuide is a content-first companion product that combines education, plain-language categorization, and a browser sound explorer.

Current prototype behavior:

- explains what tinnitus-like internal sound may feel like in accessible language
- introduces common sound categories:
  - high ringing
  - hiss / static
  - buzz / electrical
  - low hum
  - pulse / whoosh
- teaches users how to describe pitch, tone, roughness, rhythm, and timing
- highlights patterns that may deserve earlier clinical attention
- includes a `Sound Explorer` for comparing approximate sound qualities
- generates dynamic appointment-ready language from the user’s current explorer settings
- allows the user to export a 5-second MP3 sample of their current explorer match
- links to `SereniTone` when the user is ready to try a relief-focused soundscape

Why this solution:

- it tackles the “I don’t know how to explain this” problem directly
- it creates useful vocabulary without pretending to diagnose
- it gives the user something concrete to bring into an appointment
- it separates education/description from relief/treatment-style interaction

## Key Decisions & Tradeoffs

### 1. Education first instead of treatment first

Decision:

- build TinnitusGuide as an understanding tool, not a relief tool

Why:

- many users first need language and orientation
- this keeps the product clearer and less overloaded

Tradeoff:

- it does not directly solve comfort or masking on its own

### 2. Browser sound explorer instead of clinical matching

Decision:

- include a simple comparison tool that helps users say “this is closer”

Why:

- useful for self-description
- feasible in a browser
- more approachable than a formal clinical test

Tradeoff:

- it is approximate, not diagnostic
- the sound explorer is descriptive, not medically validated measurement

### 3. Companion split with SereniTone

Decision:

- keep `TinnitusGuide` separate from `SereniTone`

Why:

- the user problem here is understanding and description
- SereniTone solves a different problem: supportive sound relief

Tradeoff:

- users may switch between two related sites
- shared design language has to be managed intentionally

### 4. Clinical-leaning visual language instead of purely soothing design

Decision:

- keep the family resemblance to SereniTone, but use cooler and more clinical styling

Why:

- supports trust and clarity
- fits the educational/appointment-prep role better

Tradeoff:

- the product feels less cozy than SereniTone by design

## Scope Decisions

### Built in this version

- educational homepage sections
- common tinnitus-sound categories
- explanatory visuals
- sound explorer with adjustable sound qualities
- real-time analyzer
- dynamic appointment-description output
- MP3 sample export
- links back to SereniTone
- GitHub Pages deployment

### Chose not to build

- diagnosis
- hearing testing
- clinician interpretation
- account system
- saved user history
- backend storage
- medical records integration

These decisions kept the site focused on a single strong job: helping users understand and describe what they hear.

## What I Would Do Next With More Time

- improve the sound explorer so it can capture more nuanced mixed or shifting sound patterns
- add printable/shareable appointment summary output
- add clearer one-ear vs both-ears description support
- add more guided branching for tonal vs noise-like vs pulsing patterns
- further refine mobile audio export/share behavior across browsers
- user-test the educational flow with real tinnitus sufferers and clinicians

## Current Progress

The current prototype is live and includes:

- a clinically leaning but approachable visual system
- educational content for non-experts
- section-specific visuals that support understanding
- a browser sound explorer
- dynamic clinician-facing language based on current settings
- MP3 export for easy sharing
- cross-links to SereniTone as the relief-focused companion

## Running Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL, usually `http://127.0.0.1:5173/` or the next available port.

## Deploying To GitHub Pages

This project is set up to deploy to GitHub Pages through GitHub Actions.

### One-time GitHub setup

1. Push the project to the GitHub repository.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Make sure the default branch is `main`.

### Deploy flow

Every push to `main` triggers the workflow in [`.github/workflows/deploy.yml`](/Users/gwe48a/Documents/CodexCode/TinnitusGuide/.github/workflows/deploy.yml) and publishes the contents of `dist/` to GitHub Pages.

The Vite base path is configured in [`vite.config.js`](/Users/gwe48a/Documents/CodexCode/TinnitusGuide/vite.config.js).

## Tech Stack

- React
- Vite
- Web Audio API

## Copyright & License

Copyright (c) 2026 Greg Weiss. All rights reserved.

This repository is proprietary. No copying, modification, distribution, sublicensing, sale,
or creation of derivative works is permitted without prior written permission from Greg Weiss.

See [LICENSE](/Users/gwe48a/Documents/CodexCode/TinnitusGuide/LICENSE).
