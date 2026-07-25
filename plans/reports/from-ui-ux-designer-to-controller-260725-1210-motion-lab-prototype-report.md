# Motion lab prototype — 8 cinematic techniques on the real page content

**Date:** 2026-07-25 · **Author:** ui-ux-designer · **For:** controller / owner

## How to open it

```powershell
cd "C:\Users\miti99\AppData\Local\Temp\claude\C--Users-miti99-Workspaces-tiennm99-dating\c3fc8c9c-6456-47bc-9360-81a0a9055d7d\scratchpad\motion-lab"
python -m http.server 8200
```

Then open <http://127.0.0.1:8200/>

- File: `C:\Users\miti99\AppData\Local\Temp\claude\C--Users-miti99-Workspaces-tiennm99-dating\c3fc8c9c-6456-47bc-9360-81a0a9055d7d\scratchpad\motion-lab\index.html`
- Self-contained: one HTML file + one copied hero image. Inline CSS/JS. GSAP 3.15.0 + ScrollTrigger from jsDelivr.
- Nothing in the repo was touched except this report.
- Top bar has: light/dark (site's real tokens), a reduced-motion simulator, and a live fps read-out.
- Each demo autoplays on scroll-in and has a **Xem lại** (replay) button.
- All copy is the page's real Vietnamese, unchanged.

## What was built

| # | Technique (EN) | Label on page | Content used | Extra KB | Mobile verdict | Measured |
|---|---|---|---|---|---|---|
| A | Photo laid onto a table | Đặt tấm ảnh xuống bàn | Cảnh 2 portrait slot | 0 | **Use** (cut drop to ~40px) | 59 fps / 16.8 ms |
| B | Card turning over (3D) | Tấm thiệp lật mặt | Cảnh 2 panel → Cảnh 3 panel | 0 | Careful — faces must match height | 59 fps / 16.9 ms |
| C | Envelope opening | Phong thư mở ra | Cảnh 4 lead ("Mình không có gì to tát để hứa…") | 0 | **Use** (letter ≤ 40 words) | 60 fps / 16.9 ms |
| D | Camera push-in / pull-back | Máy quay tiến vào rồi lùi ra | Real hero image + Cảnh 1 copy | 0 | Turn off | 60 fps / 16.9 ms |
| E | Layered parallax (4 layers) | Chiều sâu nhiều lớp | Hero + Cảnh 5 heading | 0 | Half magnitude (≤22px) | 60 fps / 16.9 ms |
| F | Word-level text reveal | Chữ hiện lên từng từ | Cảnh 5 vow line 1 | 0.3 (hand-rolled) / 7.7 (SplitText) | **Use**, 1–2 lines only | 60 fps / 16.9 ms |
| G | Cards dealing from centre | Chia bài ra từ giữa | Cảnh 3 three panels | 0 | Turn off (single column) | 60 fps / 17.1 ms |
| H | A line drawing itself (SVG) | Nét vẽ tự chạy | Cảnh 7 closing line + TN seal + "Hết." | 0 (hand-rolled) / 4.3 (DrawSVG) | Use | 60 fps / 16.9 ms |

Three demos ship a **deliberately bad version side by side**: A, B and F.

**Substitution made:** "cross-dissolve between two scenes" was dropped and demo H kept in its place. The page already cross-dissolves — the hero's bottom gradient melts into `--background`, and every `data-reveal` beat is an opacity tween. A demo of it would have shown the owner what he already has.

## Ranked recommendation — put these three on the real page

### 1. C · Envelope opening — the only one that means something

Every other technique here is decoration. This one is the page's own metaphor: it is a **thư ngỏ**, an open letter. Opening an envelope to get to Cảnh 4 · Lời mời is not an effect, it is the page telling the reader what it is. Costs nothing beyond GSAP, which is already loaded. Built entirely from CSS `clip-path` — no image assets.

Use it **once**, as the gate into Cảnh 4. Twice and it becomes a gimmick.

### 2. A · Photo laid onto a table — because the portrait is the point

The portrait slot is the single most important object on a dating page, and right now it arrives with the same weightless 40px fade-up as a paragraph of text. Put the two versions in the lab side by side and the difference is not subtle: one is a photograph being placed on a table by a person, the other is a div appearing.

Three things make it work, and all three matter: real travel with a tilt that unwinds, a cast shadow that blooms wide then tightens on contact, and one small elastic settle after contact. Drop any one and it goes back to being a fade.

Use it **once**, on the portrait. Not on the panels.

### 3. F · Word-level reveal — but only on the four vow lines

Cảnh 5's four lines are the closest thing the page has to a promise. Words rising one at a time out of their own mask makes them read at the speed of someone speaking them. On body paragraphs the same effect is exhausting; on four large serif lines it is exactly right.

Hand-rolled it is 12 lines of code and 0.3 KB. GSAP SplitText buys a `mask` option for 7.7 KB — not worth it here.

**Honourable mention: H · the drawn line.** It is the best-looking thing in the lab (see `light-390-0h.png`) and costs nothing. I did not put it in the top three only because three signature moves on a seven-scene page is already the ceiling. If the owner drops one of the three above, this is the replacement.

## What I would reject, and why

**B · Card flip — good technique, wrong page.** The flip demo is genuinely well made; the difference against the cheap version is the clearest 3D lesson in the lab. But shipping it means half of Cảnh 3's honest copy is hidden behind an interaction at any given moment. That section exists so a stranger does not have to guess or dig. Hiding "162cm là số đo thật, không cộng dép" behind a flip is the page arguing with itself. It also can't be found by Ctrl-F, needs real work to be readable by a screen reader, and permanently taxes the owner to keep two faces the same height.

**G · Dealing cards — tonally wrong and dies on mobile.** A deck-of-cards metaphor over the section where he says he lives simply, doesn't smoke, and isn't chasing anything flashy. It also collapses to nothing on a phone: in a single column "dealing" is just three cards stacking, which means the majority tier gets an effect that no longer makes sense.

**D · Stronger push-in — reject as an upgrade, not as a technique.** The site already runs 1.00 → 1.07 on a pin, and that is the right amount. The lab version goes to 1.16 with a pull-back, and at that magnitude the reader can *see* the camera. A cold open should feel like light changing, not like a zoom lens. Keep what exists.

**E · Parallax — correct but not worth its cost.** It works, the magnitudes (10/22/30/44 px) are tasteful, and nobody consciously notices it. That last part is the problem: four extra composited layers on the heaviest scene of the page, on phones, for an effect whose success condition is that it goes unnoticed. Take it only if it turns out to be free, and it isn't free on mobile.

## Performance

Measured in-page (rAF sampling over the full duration of each move), desktop headless Chrome at 1440×900:

- All 8 demos: **59–60 fps, worst frame ≈17 ms** — i.e. zero dropped frames.
- Everything animates `transform` and `opacity` only. The cast shadows are separate elements with a **static** `box-shadow` whose opacity and scale animate; nothing animates `box-shadow`, `filter`, `width/height`, `top/left`, or `background-size`.
- Exception, disclosed on the page: demo H animates `stroke-dashoffset`, which is a paint operation, not a composite. Acceptable because the paths are tiny and it runs once.
- No horizontal overflow at 390px (`scrollWidth === clientWidth === 390`).

**One real bug found and fixed while building, worth carrying into the real page:** the envelope writes `flap.style.zIndex` when the flap crosses vertical. Written unconditionally inside GSAP's `onUpdate`, it invalidated style on every frame and produced a measurable **47 fps / 50 ms spike**. Guarding the write so it only fires on the crossing brought it to 60 fps / 16.9 ms. Rule: never write to the DOM inside a per-frame callback unless the value actually changed.

The fps figures are desktop headless Chrome. They do **not** predict a mid-range Android. The per-demo "mobile" verdicts in the table are the number that matters.

## The bad examples — the most useful thing in the lab

**F is the one to look at.** Per-character splitting of Vietnamese fails two independent ways at once, and both are visible in one screenshot (`dark-1440-0f.png`):

1. Diacritics arrive on their own timeline. "bằng" plays as b–a–n–g with a tone mark drifting in separately. 61 timelines instead of 13, and 61 composited layers instead of 13.
2. The browser breaks a word mid-syllable. Because each grapheme is its own inline-block, "lặp" wrapped as **"nhỏ l / ặp lại"**. That is not a tuning problem; it is structural.

The good version also shows the fix nobody mentions: a word mask needs `padding: 0.22em 0 0.16em` with a matching negative margin, or the mask clips the circumflex on "ề" and the dot under "ạ".

**A's bad version** is literally what the site does today (`opacity 0→1`, `y 40→0`, `expo.out`, 0.8s). It is not broken — it is weightless. Nothing arrives.

**B's bad version** removes `perspective` from the parent and uses 0.4s linear. Without perspective, `rotateY` is an orthographic squash: the card compresses to a vertical line and re-expands. It reads as a rendering glitch, which is why most flips on the web look cheap.

## Reduced motion

The bar's "CĐ giảm" toggle drives the same code path as `prefers-reduced-motion: reduce`, so what you see is what a motion-sensitive visitor gets. Every demo degrades to a **180 ms opacity fade to the finished state** — no travel, no rotation, no scrub:

- A: photo appears flat, no tilt, no shadow bloom (verified: `dark-390-02-reduced-motion-A.png`).
- B: no rotation at all; the two faces cross-fade.
- C: the envelope is simply already open, letter already out.
- D/E: timeline parked at 50%, the mid-frame, and left there.
- F: full sentence, no stagger.
- H: line already drawn.

## Screenshots

All under `C:\Users\miti99\AppData\Local\Temp\claude\C--Users-miti99-Workspaces-tiennm99-dating\c3fc8c9c-6456-47bc-9360-81a0a9055d7d\scratchpad\motion-lab\shots\`

| File | What |
|---|---|
| `dark-1440-00-fullpage.png` | whole lab, dark, desktop |
| `dark-1440-01-intro.png` | intro + chrome |
| `dark-1440-02-A.png` | A good vs bad |
| `dark-1440-0b.png` … `dark-1440-0h.png` | demos B–H, dark, 1440×900 |
| `light-1440-0a.png`, `-0c.png`, `-0f.png`, `-0h.png` | light theme, desktop |
| `dark-390-01-intro.png`, `-0a.png`, `-0c.png`, `-0d.png`, `-0f.png` | dark, 390×844 |
| `light-390-0b.png`, `-0g.png`, `-0h.png` | light, 390×844 |
| `dark-390-02-reduced-motion-A.png` | reduced-motion degraded state |

## Unresolved questions

1. **Is the portrait ever going to exist?** Demo A is built on the placeholder. Laying down a placeholder silhouette is a strange thing to dramatise. If the real photo is not coming soon, A should wait.
2. **Where does the envelope actually sit?** I built it as the gate into Cảnh 4, but it could equally open at the very top as the page's cold open, replacing the hero photo. That is a bigger structural change and needs the owner's call before anyone builds it.
3. **Does the film tier stay desktop-only?** `story-film.js` currently gates at `min-width: 768px`. A, C and F all work fine at 390px. If they ship, does the phone tier get them, or does it stay on the static reveal? This decides whether the majority of visitors ever see any of this.
4. **Three signature moves or one?** My recommendation is three. A more restrained reading of the brief ("honest, restrained") would ship only C and leave everything else on the existing fade. I would not argue hard against that.
5. **No mid-range Android was tested.** The fps numbers are desktop headless Chrome. Before shipping A + C + F together, one run on a real phone is worth more than all of these numbers.
