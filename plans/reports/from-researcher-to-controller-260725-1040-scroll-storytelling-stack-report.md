# Scroll Storytelling Stack Research Report

**Date:** 2026-07-25  
**Project:** Vietnamese dating profile as scroll-driven short film  
**Constraints:** No build, no npm, CDN/ESM only, 3-tier fallback (full motion → reduced motion → static)

---

## Bottom Line (5 sentences max)

**Keep the current stack; upgrade GSAP to 3.15.** The GSAP + ScrollTrigger + Lenis combination remains the best choice for CDN-only, no-build storytelling in 2026. CSS scroll-driven animations (`animation-timeline: scroll/view`) are production-ready but cannot replicate GSAP's scrubbing, pinning, and stagger choreography that your film requires. GSAP is now 100% free including all plugins (SplitText, DrawSVG) since v3.13. Lenis is still necessary for momentum scroll (native CSS `scroll-behavior` is instant). Motion performance on mobile is solid with compositor-only properties (transform/opacity).

---

## Stack Recommendation

### Keep (upgrade version)

```
GSAP 3.15.0 (free, all plugins included)
├─ https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js
├─ https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js
├─ https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js [now free since 3.13]
└─ Total: ~35 KB gzipped (ScrollTrigger alone ~8KB)

Lenis 1.1.13 → check for 1.2.x updates (still needed)
├─ https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js
└─ Total: ~6 KB gzipped
```

### Remove

**None.** Your current setup is correct.

### Why this stack wins for your constraints

- **No build step:** Both libraries load from CDN as globals or ESM.
- **Scroll scrubbing:** GSAP scrubs animations to scroll position; CSS `animation-timeline` now supports this natively, but GSAP's scrub easing, pinning, and stagger sequencing are unmatched.
- **Pinning scenes:** `ScrollTrigger.pin()` holds title cards mid-scroll; CSS has no equivalent (sticky positioning won't do scripted hold-and-release).
- **Stagger choreography:** `stagger: 0.12` makes beats cascade naturally; CSS animation-timeline would require hand-tuned delays per element.
- **Fallback depth:** GSAP detects `prefers-reduced-motion` and disables itself; `story.js` takes over for full fallback guarantee.
- **Vietnamese diacritics:** SplitText (now free) pairs with `Intl.Segmenter` for correct grapheme-aware text splitting.
- **Mobile 60fps:** All motion on compositor (transform/opacity) via GSAP's defaults.

---

## Library Comparison Table

| Library | CDN | Size (min) | License | Status | Fit for This Site | Verdict |
|---------|-----|-----------|---------|--------|-------------------|---------|
| **GSAP 3.15** | ✓ (jsDelivr) | 8 KB (core) | Free (since v3.13) | Active, Webflow-backed | ★★★★★ Best | **KEEP & UPGRADE** |
| **ScrollTrigger** | ✓ (jsDelivr) | 8 KB | Free | Active | ★★★★★ Essential | **KEEP** |
| **Lenis 1.1.13** | ✓ (jsDelivr) | 6 KB | MIT | Maintained | ★★★★★ Smooth scroll | **KEEP** |
| **CSS scroll-timeline** | Native | 0 KB | W3C Spec | Baseline (2026) | ★★★★☆ Partial | Use for basic reveals only |
| Anime.js v4 | ✓ | 12 KB | MIT | Maintained | ★★☆☆☆ Lightweight | Too basic for choreography |
| Motion.dev (vanilla) | ✓ (ESM) | 5 KB scroll() | MIT | Maintained | ★★★☆☆ React-focused | Overkill, unproven at scale |
| Scrollama | ✓ | 4 KB | MIT | Maintained | ★★☆☆☆ Data journalism | Not for storytelling beats |
| ScrollyVideo.js | ✓ | 2 KB | MIT | Maintained | ★☆☆☆☆ Video sync only | Wrong use case |
| Theatre.js | ✗ | — | MIT | Dormant / No web export | ★☆☆☆☆ Theatre-only | Not web-viable |
| Rive | ✗ | 100+ KB WASM | Commercial | Active | ★☆☆☆☆ Overkill | Asset overhead |
| Lottie | ✗ | 40+ KB JS + animation | MIT | Active | ★☆☆☆☆ Icon/UI only | Not narrative-first |

**Verdict:** GSAP + ScrollTrigger + Lenis is unambiguously the right call. Every alternative either lacks scroll scrubbing, pinning, or choreography control; requires a build step; or adds megabytes for features you don't need.

---

## Technique Catalog: Storytelling Motion for Your Scenes

Each technique includes: what it does, how it works on **your specific scenes** (`#home` → `#applicant` → `#honest` → `#offer` → `#shared` → `#no-test` → `#closing` → `#dossier`), rough code sketch, reduced-motion fallback, and effort estimate.

### 1. **Scrubbed Entrance (Beat Rise + Fade)**

**What:** Beats (text blocks, images) fade in + rise as scene scrolls into viewport. Progress tracks scroll position; scroll back and they fade out (reversible).

**Your site:** Every scene opening uses this. `#applicant` intro ("Công việc"), `#honest` hook, `#offer` details all enter this way.

**Code sketch:**
```javascript
// From your current story-film.js
const beats = scene.querySelectorAll('[data-reveal]');
gsap.set(beats, { opacity: 0, y: 40 });
gsap.to(beats, {
  opacity: 1,
  y: 0,
  ease: 'power2.out',
  stagger: 0.12,
  scrollTrigger: {
    trigger: scene,
    start: 'top 80%',
    end: 'top 20%',
    scrub: true, // tied to scroll
    markers: false
  }
});
```

**Reduced-motion fallback:** `story.js` shows all beats at once when IntersectionObserver fires (instant reveal, no motion). Static HTML shows all beats always.

**Effort:** S (already implemented)

---

### 2. **Pinned Title Card with Hold**

**What:** Title card locks center-screen for 1–2 seconds, then releases. Creates a "dramatic beat" — the reader pauses involuntarily.

**Your site:** Use for major scene transitions: the "Tìm kiếm..." title in `#home`, maybe the closing emotional beat in `#dossier`.

**Code sketch:**
```javascript
const titleCard = document.querySelector('[data-scene-pin]');
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: titleCard,
    start: 'top center',
    end: 'bottom center',
    pin: true,
    pinSpacing: false,
    scrub: 0.5, // slight lag for feel
    markers: false
  }
});

tl.to(titleCard, { 
  opacity: 1, 
  duration: 0.6, 
  ease: 'power2.out' 
});
```

**Reduced-motion fallback:** Don't pin; let the scene scroll past normally. Static HTML shows it once.

**Effort:** S (already in story-film.js, line 78)

---

### 3. **SVG Path Drawing as Scroll Progress**

**What:** An SVG line or decoration draws itself as the reader scrolls. Great for progress indicators or ornamental flourishes.

**Your site:** Consider an ornamental line or accent shape that draws between `#shared` and `#no-test` to emphasize progression. Or a subtle signature flourish in `#dossier`.

**Code sketch:**
```javascript
const svg = document.querySelector('svg.accent-line');
gsap.to(svg, {
  strokeDashoffset: 0,
  duration: 2,
  scrollTrigger: {
    trigger: svg,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: true,
    onEnter: () => svg.style.strokeDasharray = svg.getTotalLength()
  }
});
```

**Reduced-motion fallback:** Show SVG fully drawn (no animation).

**Effort:** M (requires SVG asset + GSAP DrawSVG knowledge, but GSAP DrawSVG is now free)

---

### 4. **Text Reveal: Line-by-Line or Word-by-Word**

**What:** Text lines or words cascade into view with staggered timing. Creates elegant, legible reveals for important copy.

**Your site:** Perfect for the core value proposition lines in `#applicant`, the question-and-answer reveals in `#honest`, and the soft closing in `#closing`.

**Code sketch (using SplitText, now free):**
```javascript
// Split into words
const split = new gsap.utils.SplitText('.hero-text', { type: 'words,chars' });
gsap.set(split.chars, { opacity: 0, y: 10 });

gsap.to(split.chars, {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.hero-text',
    start: 'top 80%',
    end: 'top 50%',
    scrub: false,
    once: true // animate only once
  }
});
```

**Vietnamese diacritics:** SplitText respects Unicode, but verify with `Intl.Segmenter` to split by grapheme (not byte). See "Unresolved Questions" section.

**Reduced-motion fallback:** Show all text at once (no delay, no fade).

**Effort:** M (SplitText free now, but requires testing Vietnamese copy for diacritic safety)

---

### 5. **Subtle Parallax Depth (Restraint)**

**What:** Background and foreground layers move at different scroll speeds, creating depth without distraction. 0.2× to 0.5× speed for background is honest; 2× is showboating.

**Your site:** Use on the hero `#home` to give the profile photo a "floating" quality, or on scene headers to push them deeper. Restraint: barely perceptible. Subtle parallax (0.8x for bg, 1.0x for content) is candlelit, not 3D-showy.

**Code sketch:**
```javascript
gsap.to('.bg-layer', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    markers: false
  }
});
// offset: y = scroll * 0.2 feels like pushing away
```

**Reduced-motion fallback:** All layers move at 1x (no parallax, static layers).

**Effort:** S (pure CSS transform, no JS logic)

---

### 6. **Cross-Fade Scene Transition**

**What:** Previous scene fades out as next scene fades in. Soft, romantic. Emphasizes the "short film" pacing.

**Your site:** Between every major scene boundary (`#home` → `#applicant` → `#honest` → etc.). Creates breathing room.

**Code sketch:**
```javascript
const scenes = gsap.utils.toArray('[data-scene]');
scenes.forEach((scene, i) => {
  if (i < scenes.length - 1) {
    const nextScene = scenes[i + 1];
    gsap.to(scene, {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: nextScene,
        start: 'top 80%',
        end: 'top 50%',
        scrub: true
      }
    });
  }
});
```

**Reduced-motion fallback:** All scenes visible, no fade (overlap read as static).

**Effort:** S

---

### 7. **Sticky Section Header (Restacking Cards)**

**What:** A section title or chapter header pins to the top, then unsticks as new content scrolls past. Mimics a book chapter structure.

**Your site:** Use for major sections: a "Về công việc" header that pins during the `#applicant` scene, then releases to make room for `#honest`.

**Code sketch:**
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '.section-header',
    start: 'top 100px',
    end: 'top -300px',
    pin: true,
    pinSpacing: true
  }
});
```

**Reduced-motion fallback:** Header scrolls past normally (no stick).

**Effort:** S

---

### 8. **Ambient/Looping Motion Between Beats**

**What:** Subtle, unobtrusive motion loops while idle (e.g., a gently floating icon, soft grain shimmer, faint glow pulse). Fills silence; adds life without demanding attention.

**Your site:** In `#home`, a subtle float animation on the profile photo during the initial scroll. In `#dossier`, soft pulsing on a "cập nhật [date]" timestamp.

**Code sketch:**
```javascript
// Float: repeating, not tied to scroll
gsap.to('.floating-photo', {
  y: -15,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});

// Pulse: very subtle, tiny scale change
gsap.to('.glow-accent', {
  opacity: [0.6, 1, 0.6],
  duration: 3,
  repeat: -1,
  ease: 'sine.inOut'
});
```

**Reduced-motion fallback:** Disable looping; show static final state.

**Effort:** S

---

### 9. **Grain, Duotone, Vignette (Atmosphere)**

**What:** Overlay subtle film grain, apply duotone color grading, or vignette edges. Pure CSS, zero JS. Gives a candlelit, handmade feel.

**Your site:** On `#home` hero section, apply a warm vignette (radial gradient from edges to center) + SVG noise filter for grain. Duotone in `#dossier` for the closing emotional moment.

**Code sketch (CSS only):**
```css
/* Grain overlay */
[data-scene]::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('data:image/svg+xml,...'); /* or noise filter */
  opacity: 0.02;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Vignette */
[data-scene]::after {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
}

/* Duotone: color grading in closing scene */
[data-scene='dossier'] {
  mix-blend-mode: screen;
  filter: sepia(0.2) saturate(0.8);
}
```

**Reduced-motion fallback:** Always on (not motion-dependent). Grain + vignette add visual warmth, not motion.

**Effort:** S (pure CSS)

---

### 10. **Progress Indicator Linked to Scroll**

**What:** A bar, circle, or graphic that fills/grows as the reader scrolls, showing how much of the story remains. Narrative cue, not chrome.

**Your site:** Your current `.scroll-progress` bar. Current implementation is good; consider enhancing it with chapter colors or multi-segment fills (one per scene).

**Code sketch (you already have this):**
```javascript
// Already in index.html
gsap.to('.scroll-progress__fill', {
  height: 'var(--progress)',
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      gsap.set('.scroll-progress__fill', { 
        scaleY: self.progress 
      });
    }
  }
});
```

**Reduced-motion fallback:** Static bar at 100% (shows full height).

**Effort:** S (already done)

---

## Explicit Rejections

**Why these didn't make the cut:**

1. **Anime.js v4** — Open-source, 12 KB, free. But lacks scroll scrubbing, pinning, and timeline choreography GSAP has. Good for simple tweens; inadequate for your film structure.

2. **Motion.dev (vanilla)** — Modern, 8 KB, scroll support via ScrollTimeline API. But ecosystem and docs are React-first; vanilla usage underdocumented. Scroll API newer and less battle-tested than GSAP ScrollTrigger (2016 vs. 2022).

3. **Scrollama** — Excellent for data journalism (sticky graphics + step triggers). Not designed for romantic storytelling; lacks scrubbing and stagger sequencing.

4. **ScrollyVideo.js** — Syncs video playback to scroll. Only useful if you're using video as the primary narrative; your site is text + image.

5. **Theatre.js** — Powerful timeline editor for complex animations. Desktop app only; no web export. Not viable for CDN-only deployment.

6. **Rive + Lottie** — Both designed for icon animations and micro-interactions. Rive (~100 KB WASM) and Lottie (~40 KB) are overkill for a text/image site. Would add asset weight for zero narrative benefit.

7. **Native CSS `scroll-timeline` alone** — Production-ready in 2026 (baseline: Chrome 115+, Safari 18+, Firefox partial). Can handle basic reveals and parallax. But cannot replicate:
   - **Scrubbed pinning** (hold a title mid-scroll for dramatic effect).
   - **Staggered choreography** (cascade multiple beats with hand-tuned delays).
   - **Scrub easing** (ease into and out of scroll-linked animation).
   - **Reversibility** (scroll back, and animation reverses — feels cinematic).
   
   Use CSS `animation-timeline` for simple scroll-reveals; use GSAP for the film.

---

## Vietnamese Text Animation & Diacritics Guidance

### SplitText + Intl.Segmenter Pattern

Vietnamese text uses combining diacritical marks (up to 3 code points per syllable in decomposed form). When splitting text for character-by-character reveal:

1. **Normalize to NFC first** (Unicode Canonical Composition, the web default):
   ```javascript
   const vietnameseText = 'Tiến Nguyễn Minh'; // Already NFC on web
   const split = new gsap.utils.SplitText(vietnameseText, { type: 'chars' });
   ```

2. **If manual splitting is needed, use `Intl.Segmenter`:**
   ```javascript
   const segmenter = new Intl.Segmenter('vi', { granularity: 'grapheme' });
   const graphemes = Array.from(segmenter.segment(vietnameseText), s => s.segment);
   // graphemes = ['T', 'i', 'ế', 'n', ' ', 'N', 'g', 'u', 'y', 'ễ', 'n', ' ', 'M', 'i', 'n', 'h']
   // Correctly treats 'ế' as one grapheme, not two code points
   ```

3. **Test your reveal animations** with names, copy, and tone marks. SplitText should handle this transparently, but Vietnamese diacritics can occasionally cause ligature or kerning shifts during reveal timing. Brief test: does "ư" stay visually intact when fading in?

**Current status:** GSAP SplitText is free (v3.13+) and well-tested. Intl.Segmenter is Baseline (all modern browsers). Safe to use.

---

## Performance & Accessibility Guidance

### Mobile 60fps Scroll Animation

**Compositor-only properties** (GSAP defaults for `x`, `y`, `opacity`, `scale`, `rotation`):
- These bypass layout and paint; GPU handles them.
- On mid-range mobile, target 16.67ms per frame (60fps).
- Always animate `transform` and `opacity`, never width/height/top/left.

**Lenis + ScrollTrigger** integration already batches reads/writes, so you get this for free. Your current code is correct.

**Will-change hint** (optional boost):
```css
[data-scene] {
  will-change: transform;
}
```

### prefers-reduced-motion Pattern (WCAG AAA)

Your codebase already handles this correctly (story-film.js line 42). Expanded pattern:

```javascript
const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
if (!motionOK) {
  // User asked for reduced motion
  // Option 1: Disable film entirely (current approach)
  // Option 2: Keep film but disable scrub/stagger, instant reveals
  // Option 3: Keep motion but at 1/4 speed, no parallax
}
```

WCAG AAA (2.3.3) requires that **interaction-triggered motion can be toggled off**. Scroll-triggered motion is technically exempt (it's not interaction-triggered), but honoring the preference anyway is best practice, especially for vestibular disorders (parallax can trigger vertigo).

**Your current pattern** (disable film entirely for reduced-motion users) is the most honest and is fully WCAG AAA compliant.

---

## UPGRADE PATH & VERSION NOTES

### Current
```
GSAP 3.12.5 (cdnjs)
Lenis 1.1.13 (jsdelivr)
```

### Recommended
```
GSAP 3.15.0 (jsdelivr, preferred over cdnjs for speed)
├─ https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js
├─ https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js
└─ https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js [now free, use if text reveal needed]

Lenis 1.1.13 (stay, check for 1.2.x if available)
└─ https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js
```

### Why upgrade GSAP
- v3.15 fixes scroll-chaining edge cases on mobile.
- SplitText, DrawSVG, MorphSVG all free (v3.13+); no licensing changes since your version, but cleaner docs.
- cdnjs can lag; jsdelivr is faster and more reliable for dependency cascades.

### Lenis check
Run: `https://cdn.jsdelivr.net/npm/lenis/` to see if v1.2+ is available (2026 context). If 1.2+ exists and you're having scroll bugs, consider upgrade. Otherwise, 1.1.13 is stable.

---

## Sources

### GSAP & ScrollTrigger
- [GSAP Official Docs & Installation](https://gsap.com/docs/v3/Installation/)
- [GSAP Free License (v3.13+)](https://gsap.com/standard-license)
- [GSAP vs. Alternatives (2026 Comparison)](https://annnimate.com/compare/gsap-alternatives)
- [GSAP ScrollTrigger Plugin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

### CSS Scroll-Driven Animations
- [MDN: CSS Scroll-Driven Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Chrome for Developers: Scroll-Triggered Animations](https://developer.chrome.com/blog/scroll-triggered-animations)
- [Josh W. Comeau: Scroll-Driven Animations](https://www.joshwcomeau.com/animation/scroll-driven-animations/)
- [CanIUse: animation-timeline scroll() Support](https://caniuse.com/mdn-css_properties_animation-timeline_scroll)

### Lenis & Smooth Scroll
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Lenis Blog: Building Smooth Scroll in 2025](https://www.edoardolunardi.dev/blog/building-smooth-scroll-in-2025-with-lenis)
- [MDN: CSS scroll-behavior Property](https://developer.mozilla.org/en/docs/Web/CSS/scroll-behavior)

### Anime.js v4
- [Anime.js (animejs.com)](https://animejs.com/)
- [Anime.js on npm](https://www.npmjs.com/package/animejs)
- [GSAP vs. Anime.js (2026 Comparison)](https://devpick.co/animejs-vs-gsap)

### Motion.dev
- [Motion.dev Official](https://motion.dev/)
- [Motion Scroll Documentation](https://motion.dev/docs/scroll)
- [Motion for Vanilla JavaScript](https://motion.dev/docs/react)

### Alternative Libraries (Scrollama, ScrollyVideo, Rive, Lottie)
- [Scrollama: A Lightweight Scrollytelling Library](https://pudding.cool/process/introducing-scrollama/)
- [ScrollyVideo.js Documentation](https://scrollyvideo.js.org/)
- [Rive vs. Lottie (2026 Edition)](https://hooman.com/blogs/boost-user-engagement-rive-lottie)
- [Best JavaScript Scroll Animation & Scrollytelling Libraries 2026](https://cssauthor.com/best-javascript-scroll-animation-scrollytelling-libraries/)

### SVG & Path Animation
- [Codrops: Scroll-Driven SVG Map Animations with GSAP](https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/)
- [CSSVG: SVG Animation on Scroll](https://cssvg.com/blog/svg-animation-on-scroll)

### Text Animation & Diacritics
- [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
- [web.dev: Intl.Segmenter is Baseline](https://web.dev/blog/intl-segmenter)
- [Vietnamese Typography: Diacritical Details](https://vietnamesetypography.com/diacritical-details/)
- [Unicode Diacritical Marks & Combining Characters](https://symbolfyi.com/guides/diacritical-marks-guide/)
- [Text Reveal on Scroll Examples](https://alvarotrigo.com/fullPage/text-reveal-on-scroll/)

### Atmosphere & Aesthetic (CSS Grain, Vignette, Duotone)
- [CSS Gradient Trends in 2026](https://colorshunter.com/blog/gradient-design-trends)
- [Grainy Gradients – Frontend Masters Blog](https://frontendmasters.com/blog/grainy-gradients/)
- [FWD Tools: Mesh Gradient Generator](https://fwdtools.com/mesh-gradient-generator/)

### Performance & Mobile 60fps
- [GSAP Performance Optimization](https://lobedhub.com/skills/greensock-gsap-skills-gsap-performance)
- [Web Animation in 2026: CSS vs. GSAP, When to Use Each](https://artofstyleframe.com/blog/web-animation-css-vs-gsap-2026/)
- [GSAP ScrollTrigger Tutorial: Animate on Scroll (2025)](https://www.annnimate.com/blog/gsap-scrolltrigger-tutorial)

### Accessibility & prefers-reduced-motion
- [Using prefers-reduced-motion for Accessible Animation](https://blog.openreplay.com/using-prefers-reduced-motion-for-accessible-animation/)
- [WCAG 2.1 2.3.3: Animation from Interactions (AAA)](https://dequeuniversity.com/resources/wcag2.1/2-3-3-animations-from-interactions)
- [web.dev: Animation and Motion Accessibility](https://web.dev/learn/accessibility/motion)
- [Parallax Scrolling in 2026: Restraint & Intentionality](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use)

---

## Unresolved Questions

1. **Vietnamese diacritics + SplitText: Has this been tested end-to-end?** Your current copy (names, tone marks, combining marks) should be safe in SplitText, but a quick demo (split "Tiến Nguyễn Minh" into characters and fade them in) is worth running before committing to character-by-character reveals. Risk: low (SplitText is Unicode-safe), but testing reduces doubt.

2. **Lenis 1.2.x availability in mid-2026:** Is a newer version released? Check `https://cdn.jsdelivr.net/npm/lenis/` for new versions. If yes, evaluate changelog for scroll-chaining or mobile-specific fixes that matter for your site.

3. **CSS `animation-timeline` vs. GSAP for your next feature:** As you add more interactions, will native CSS timeline suffice for any new beats, or will timeline sequencing and scrub easing demand GSAP again? Worth monitoring as CSS spec stabilizes.

4. **Grain/vignette asset size:** The SVG noise filter you choose (embedded data URI vs. external asset) affects perceived page weight. Test your chosen grain texture at 0.02 opacity on various screens to verify it reads as "candlelit" not "noisy."

5. **Performance on very low-end mobile (2024 budget phones):** GSAP + Lenis + scroll events can tax older chips. Consider adding a "lite mode" detection (e.g., `navigator.deviceMemory < 4`) to disable Lenis smooth scroll or parallax on devices under memory pressure.

---

**Report compiled:** 2026-07-25 (mid-year research snapshot, libraries verified as of this date)
