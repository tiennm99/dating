# Asset Brainstorm Report

---

date: 2026-06-21
status: approved
mode: brainstorm-to-generation
project: dating

---

## Summary

Generate missing project assets for the SvelteKit dating JD/CV site.

Approved scope:

- Commit existing changes first. Done: `1700cc5 feat(skills): add minimax cli skill`.
- Generate visual assets with OpenAI image generation.
- Generate background music and small sounds with MiniMax.
- Save audio as project assets only. No player, no autoplay.
- Skip real avatar. Use only symbolic placeholder.
- Keep existing SVG favicon/logo pattern.

## Codebase Context

- SvelteKit 2 + Svelte 5 + TypeScript static site.
- GitHub Pages base path can be `/dating` for production.
- Current visual asset: `src/lib/assets/offer-letter-hero.png`.
- Home imports hero image from `src/lib/assets`.
- Static served assets belong under `static/assets/`.
- Tone: warm, witty, mature, bilingual VI/EN, software/product metaphor.

## Problem-First

### Solution-Jumping Diagnosis

Request for avatar/background/logo/music signals the site feels unfinished as a shareable personal product.

### Underlying Problem

The site has strong copy and structure but lacks complete media assets for polish, sharing, and future interaction.

### Assumption Challenges

| Assumption                 | Risk If Wrong               | Validation                             |
| -------------------------- | --------------------------- | -------------------------------------- |
| More assets improve site   | Visual noise weakens copy   | Keep images minimal and low-text       |
| Avatar needed              | Fake likeness feels uncanny | Skip avatar, symbolic placeholder only |
| Logo should be generated   | AI text/vector output weak  | Keep existing SVG favicon/logo         |
| Audio should be integrated | Autoplay hurts UX           | Save files only                        |

### Problem Statement

User wants this static site to feel complete as a warm, polished dating JD/CV package without adding backend, tracking, or intrusive media behavior.

### Alternative Framings

- Brand kit completion: generate core media inventory.
- Website polish: replace only visible hero and add share assets.
- Future interaction prep: create audio files now, wire controls later.

### Evidence Status

Medium. Repo already has one hero and favicon; user explicitly requested complete assets.

### Validation Plan

- Generated images fit tone, no fake person, no broken text.
- Assets saved in repo paths.
- Build succeeds.
- Audio files exist and are not wired to autoplay.

### Stakeholder Message

We can make the project feel complete without overbuilding. Generate restrained assets, keep copy dominant, save audio for later use.

## Prompt Review

### Pass 1 - Intent

- Use warm application-packet metaphor.
- Avoid generic romance ads.
- Avoid real person/avatar likeness.
- Avoid generated readable text.
- Preserve light blue + dark pink theme compatibility.

### Pass 2 - Composition

- Hero: wide 16:10, right-side visual weight, left-side quiet/dark readable area.
- Social preview: 1200x630-friendly editorial still life, no text.
- Placeholder: square symbolic profile placeholder, initials-free, no face.
- Audio: instrumental, short, loopable, no vocals.
- UI sounds: subtle, soft, short, not game-like.

### Pass 3 - Final Constraints

- No watermark.
- No logos or brand marks.
- No legible text, letters, UI screenshots, faces, bodies, hands.
- No hearts, roses, rings, wedding symbols, or stock couple imagery.
- No autoplay wiring.
- Save final assets under repo, not tool cache.

## Final Prompts

### Hero Background

Use case: ads-marketing  
Asset type: web hero background for a warm-witty personal dating JD/CV site  
Primary request: A polished editorial still life of a playful long-term partnership application packet: elegant papers, envelope, soft desk objects, subtle software-system cues such as tiny abstract flow lines and status dots, mature and warm rather than corporate.  
Scene/backdrop: clean modern desk surface, atmospheric but not dark, suitable under a left-to-right overlay.  
Subject: application packet and envelope, no people.  
Style/medium: high-end editorial illustration with realistic texture, refined web hero background.  
Composition/framing: wide 16:10 landscape, visual weight on right and lower-right, left third intentionally quiet with low-detail negative space for headline readability.  
Lighting/mood: warm morning light, sincere, witty, calm.  
Color palette: adaptable blue-white light theme and black-pink dark theme; soft blues, off-white paper, tiny pink accent, restrained ink tones.  
Constraints: no readable text, no letters, no logo, no watermark, no faces, no bodies, no hands.  
Avoid: hearts, roses, rings, wedding imagery, stock romance, cheesy dating app look, clutter.

### Social Preview

Use case: ads-marketing  
Asset type: OpenGraph/social preview background, 1200x630-friendly  
Primary request: A share-card editorial background for a warm personal dating JD/CV site, showing a neat application packet, sealed note, subtle checklist lines, and small system-design visual motifs.  
Scene/backdrop: bright desk or soft studio tabletop.  
Subject: documents, envelope, small abstract status marks, no people.  
Style/medium: polished editorial illustration, modern, premium but personal.  
Composition/framing: landscape social card, centered still life with clean margins; safe space for external metadata text overlays, but the image itself contains no readable words.  
Lighting/mood: warm, confident, gentle humor.  
Color palette: white, blue, black, pink accents, compatible with existing site themes.  
Constraints: no readable text, no letters, no logo, no watermark, no faces, no hands.  
Avoid: hearts, roses, rings, wedding symbolism, dating-app UI, stock-photo feel.

### Symbolic Profile Placeholder

Use case: logo-brand  
Asset type: square symbolic profile placeholder, not an avatar likeness  
Primary request: A refined symbolic profile placeholder for a personal dating JD/CV site: abstract circular seal, application packet motif, gentle relationship warmth, no human likeness.  
Scene/backdrop: clean transparent-looking or flat neutral background.  
Subject: abstract seal and paper/envelope geometry, no initials.  
Style/medium: vector-friendly raster illustration, crisp edges, simple shapes.  
Composition/framing: centered square, works cropped into a circle.  
Lighting/mood: warm, trustworthy, lightly playful.  
Color palette: blue-white base with pink accent and dark-mode compatible contrast.  
Constraints: no readable text, no letters, no logo, no watermark, no face, no body.  
Avoid: realistic portrait, silhouette head, hearts, rings, roses.

### Background Music

Instrumental background music for a warm witty personal dating JD/CV website. Gentle indie-jazz and soft lo-fi pop, upright piano, muted electric piano, light brushed percussion, subtle acoustic guitar, warm bass. Mood: sincere, playful, calm, hopeful, mature. Moderate slow tempo around 82 BPM, seamless loop feel, no vocals, no lyrics, no dramatic build, no cinematic trailer sound, no cheesy romance, no copyrighted reference style.

### Confirmation Chime

Tiny soft UI confirmation sound for a warm personal website. Gentle bell plus soft electric piano sparkle, under two seconds, friendly but mature, no game arcade feel, no voice, no melody that sounds like an existing song.

### Page Turn Sound

Subtle page/card transition sound for opening a dating application packet. Soft paper rustle blended with a very light warm chime, under two seconds, elegant, quiet, no voice, no notification harshness, no cartoon effect.

## Output Paths

Generated:

- `src/lib/assets/generated/dating-application-hero-background.png` - 1600x1000 PNG, source/reference.
- `src/lib/assets/generated/dating-application-hero-background.webp` - 1600x1000 WebP, wired as home hero.
- `static/assets/social/dating-jd-cv-social-preview.png` - 1200x630 PNG, wired as social preview image.
- `static/assets/placeholders/dating-profile-placeholder.png` - 1024x1024 PNG, saved for future profile use.
- `static/assets/audio/dating-background-loop.mp3` - 64.0s MP3, saved only.
- `static/assets/audio/soft-confirmation-chime.mp3` - 1.83s MP3, saved only.
- `static/assets/audio/application-page-turn.mp3` - 1.83s MP3, saved only.

## Implementation Notes

- OpenAI image generation used for the three raster visuals.
- MiniMax music generation used for all audio sources.
- `ffmpeg` used only to trim/fade MiniMax audio into practical asset lengths.
- Existing SVG favicon/logo kept.
- No audio player added. No autoplay added.

## Unresolved Questions

None.
