# TinnitusGuide

TinnitusGuide is a browser-based education and self-description companion site for people trying to make sense of ringing, hissing, buzzing, humming, pulsing, or other internal sound.

It does not try to soothe the sound directly. Instead, it helps the user understand what they may be hearing, build language around it, compare sound qualities in a browser explorer, and prepare for clearer conversations with clinicians. When the user is ready for relief-focused sound support, it points them into `SereniTone`.

## Who It's For

TinnitusGuide is for people who:

- notice internal sound but do not know how to describe it clearly
- feel frustrated trying to explain what they hear to an ENT or audiologist
- want a calmer explanation of tinnitus-like sound qualities without heavy jargon
- want a safe, non-diagnostic browser tool to compare pitch, hiss, buzz, hum, and pulse

It is especially useful for people in the “confused but motivated” stage: they know something is happening, but do not yet have the vocabulary to describe it well.

## Problem

Many people know that something sounds “off” long before they know how to describe it.

That creates several practical problems:

- they struggle to explain what the sound is actually like
- they do not know which details may matter clinically
- they feel overwhelmed by medical language
- they arrive at appointments with vague descriptions like “ringing” that miss important detail

This creates an opportunity for a better first step: a non-diagnostic educational site that helps users observe, compare, and describe their tinnitus-like perception before they move into either clinical conversation or relief-oriented tools.

## Solution

TinnitusGuide is a content-first companion product that combines education, visual explanation, and a browser sound explorer.

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
- includes a `Sound Explorer` that lets users compare approximate sound qualities
- includes a real-time analyzer so users can see the current sound profile
- generates dynamic appointment-ready language from the user’s current explorer settings
- allows the user to export a 5-second MP3 sample of their current explorer match
- links into `SereniTone` when the user is ready to try a relief-focused soundscape

Why this solution:

- it directly addresses the “I don’t know how to explain this” problem
- it creates better vocabulary without pretending to diagnose
- it gives the user something concrete to bring into an appointment
- it separates education and self-description from relief and tuning

## Key Decisions & Tradeoffs

### 1. Education first instead of treatment first

Decision:

- build TinnitusGuide as an understanding tool, not a relief tool

Why:

- many users first need orientation and language
- it keeps the product clearer and more focused

Tradeoff:

- it does not directly solve comfort or masking by itself

### 2. Browser sound explorer instead of clinical matching

Decision:

- include an approximate explorer that helps users say “this is closer”

Why:

- useful for self-description
- feasible in a static browser-based product
- more approachable than a formal clinical test

Tradeoff:

- it is descriptive, not diagnostic
- the sound explorer is not a medically validated measurement tool

### 3. Companion split with SereniTone

Decision:

- keep `TinnitusGuide` separate from `SereniTone`

Why:

- understanding what you hear is a different problem from building a soothing soundscape
- the split keeps each product more legible

Tradeoff:

- users may move between two related sites
- the shared brand language has to be managed intentionally

### 4. Clinical-leaning visual language instead of purely soothing design

Decision:

- keep the family resemblance to SereniTone, but shift TinnitusGuide toward a cooler, more clinical visual system

Why:

- supports trust and clarity
- better matches the educational and appointment-prep role

Tradeoff:

- it feels less cozy than SereniTone by design

### 5. In-browser MP3 export instead of server-side rendering

Decision:

- render and encode the sample in the browser

Why:

- keeps the project fully static-hostable
- avoids backend storage and processing complexity
- lets the user quickly create something shareable

Tradeoff:

- browser behavior varies more across devices
- export and share behavior needs more cross-browser tuning

## Scope Decisions

### Built in this version

- educational homepage sections
- common tinnitus-sound categories
- explanatory visuals and infographics
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
- user accounts
- saved user history
- backend storage
- medical records integration

These decisions kept the site focused on a single strong job: helping users understand and describe what they hear more clearly.

## What I Would Do Next With More Time

- make the sound explorer better at mixed or shifting sound patterns
- add printable and shareable appointment summary output
- add clearer support for one-ear vs both-ears descriptions
- add more guided branching for tonal vs noise-like vs pulsing patterns
- continue refining mobile export and sharing across browsers
- test the educational flow with real tinnitus sufferers and clinicians
- possibly add a more structured “describe this to your doctor” workflow

## Current Progress

The current prototype is live and includes:

- a clinically leaning but approachable visual system
- educational content for non-experts
- section-specific visuals that support understanding
- a browser sound explorer
- a real-time analyzer
- dynamic clinician-facing language based on current settings
- MP3 export for easy sharing
- cross-links to SereniTone as the relief-focused companion
- tuned default playback output to reduce jarring starts

## Running Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

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
- `lamejs` for in-browser MP3 export

## Copyright & License

Copyright (c) 2026 Greg Weiss. All rights reserved.

This repository is proprietary. No copying, modification, distribution, sublicensing, sale,
or creation of derivative works is permitted without prior written permission from Greg Weiss.

See [LICENSE](/Users/gwe48a/Documents/CodexCode/TinnitusGuide/LICENSE).
