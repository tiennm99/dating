# What Is There To Move — Concept & Object Direction

Date: 2026-07-25 · Author: brainstormer · Scope: content + art direction only. No code. No framework opinion.

---

## 0. The diagnosis, sharpened

Owner says "it just moves and fades." Correct, but the cause is deeper than the animation layer.

Counted on the live page, the entire visual inventory is:

| Thing | Count | Status |
|---|---|---|
| Paragraphs in rounded rectangles | 31 beats | the whole page |
| Photographs | 1 | **stock photo of someone else's desk** |
| Portrait of Tiến | 0 | grey SVG silhouette placeholder |
| Objects that are objects | 0 | — |
| Light sources | 0 | flat gradients |

Two hard truths the owner has not been told:

1. **The only image on a page about honesty is a stock photo.** `assets/dating-application-hero-background.webp` is a generic recruitment flat-lay: blue-grey surface, eucalyptus sprig, a CV with fake grey lorem bars and pink dots. It is the exact aesthetic of a Canva template. A page whose climax is *"Không có bài kiểm tra nào cả"* opens on a picture of a job application. The metaphor is also tripled — letter + job application + short film — and the photo is voting for the weakest of the three.
2. **The portrait is missing.** She is being asked to consider a relationship with a grey circle-and-shoulders icon. No amount of motion outranks a face.

So: there is nothing on this page that *is* an object. The animation critique is a symptom. GSAP is already installed, already runs on phone, already has seven per-scene entrance recipes with rotation/blur/stagger — the engine is not the bottleneck. **There is nothing for it to move.**

---

## 1. The core idea

### Recommendation: **"Phòng trọ Quận 7, 11 giờ đêm"** — one room, one lamp, one desk, one empty chair, one letter being written.

The page is not a document. It is a **place**, at a **time**, with a **light source**, containing **things that belong to a specific person**. The camera never leaves the room. The night deepens as she scrolls. Nothing is illustrated; everything is either **photographed and cut out** or **drawn in code**.

The thesis is already sitting in his own first sentence, unused:

> "Chỗ bên cạnh đã trống hơi lâu."

*The seat beside me has been empty a while.* That is a stage direction. Build the room it describes.

**Critical construction note — this is the part that unlocks "multiple moving objects":** the room is **not one photograph**. One photo = one object = nothing can move independently. Instead: a **code-drawn surface** (CSS gradient desk + one radial lamp pool + vignette) with **8–14 separately cut-out PNG/SVG objects layered on it at different depths**. Each is then independently translatable, rotatable, parallaxable. That is the entire difference between the current page and the page he wants, and it costs no illustration skill — phone camera + white A4 + one-click AI background removal.

### Alternatives considered and rejected

| World | What it is | Why rejected |
|---|---|---|
| **A. Overhead desk flat-lay** (what the hero currently implies) | Top-down camera panning across a desk | No depth, therefore no parallax and no camera arc. Worse: **an empty chair cannot be felt from above.** Kills the strongest emotional object on the list. Also the single most templated aesthetic on the internet. |
| **C. Pure paper — the letter itself** | Whole page is one sheet: folds, ink, wax, crossed-out lines | Genuinely tempting: **zero assets, all SVG/CSS.** Rejected as the *container* because paper has no place and no time — universal, which here means generic. **But adopted as the material inside B.** If he has zero appetite for photography, C is the fallback world and still beats today's page. |
| **D. Saigon night / rooftop / rain** | City skyline, rain on glass | Mood without evidence. Nothing in it is *his*. Pretty postcard. |
| **E. Notebook / sketchbook** | Pages, doodles, tape | Requires hand-drawn art. He is not an illustrator. Fails the constraint immediately. |
| **F. Night sky / constellations** | | Every romantic template ever built. Reads as bought. |

**B over C is a real trade:** C ships with no assets and no personal risk. B requires ~10 photographs and a decision to show his actual room. B is worth it because *evidence* is the currency of this page — the copy's whole argument is "I am telling you true things," and photographs of real objects are the only medium that can corroborate that. An illustration cannot.

### The three rules of the world

1. **One light.** A desk lamp, off-canvas top-left. Every shadow falls away from it. Nothing else glows except the phone screen (cool blue, deliberately the only cold thing in the room).
2. **Gravity is real.** Objects are *placed*, never floating. They land, settle, rest slightly off-square. Nothing loops forever except dust and steam.
3. **The camera moves toward the empty chair.** Scene 1 it is at the far edge of frame. Scene 7 it is centred and finally lit. **It is never occupied.** (See §6.)

---

## 2. Object inventory

Legend for **Make**: `CODE` = SVG/CSS/canvas, no asset · `PHOTO` = he shoots it on white, removes bg, drops a webp in `assets/` · `HAND` = he writes on paper and photographs it.

| # | Object | Scene | What it does | Make | Emotional job |
|---|---|---|---|---|---|
| 1 | **Lamp pool** — warm radial light, off-canvas top-left | all | Fixed layer. Breathes 2–3% over 6s (flicker, not pulse). Warms and narrows as scroll advances. | CODE | The page has a light source. Everything else exists because this does. |
| 2 | **Dust in the beam** — 8–12 slow specks | all | Drift diagonally through the lamp pool, 20–40s each, random delays, opacity 0.06–0.14. | CODE | Still air in a room at night. **Cheapest "multiple moving objects" on the list — literally one keyframe.** |
| 3 | **The empty chair** | 1 → 7 arc | Does not move. The *camera* moves toward it across nine scenes. Edge of frame in #home; centred and lit in #closing. | PHOTO or CODE | The page's thesis as a prop. Highest emotional payload of anything here. |
| 4 | **The letter sheet** — copy sits on paper, not rounded rects | all | Deckled top edge, one fold crease, 0.3–0.6° off-square, soft shadow. Sheets stack; the previous slides under. | CODE | Kills "text in boxes" without touching a word of copy. |
| 5 | **Portrait, taped down** | 2 | Photo 2° off-square, two strips of washi tape. Swings a few tenths of a degree on scroll velocity, damped. | PHOTO **(blocker, §7)** | He shows his face. Non-negotiable. |
| 6 | **The phone** | 2 | Lying screen-up, showing a real Genshin daily / TFT board / T1 scoreline. **Only cold light in a warm room.** Dims and locks as the scene leaves. | PHOTO + CODE | Specific, true, quietly funny. |
| 7 | **Coffee cup + ring stain** | 2 | Cup parallaxes a few px. Leaves a ring — the ring fades in **permanently** and is still on the desk in scenes 5, 6, 7. | PHOTO or CODE | Time passed. Someone sat here a long while. |
| 8 | **Light novel spines** — 3–4, leaning | 2 | Each spine parallaxes at a different rate so the stack "opens" slightly. Real titles he owns. | PHOTO or CODE | Taste as evidence, not as a claim. |
| 9 | **Playlist strips** — fanned stack of song-title cards | 2 | Replaces the bare `Nghe thử playlist →` link. Fan out on scroll; tap opens the real playlist. Optional 20s clip. | CODE | "Playlist đủ mọi loại mood" becomes a picture instead of a sentence. |
| 10 | **Crossed-out line** | 3 | A line of handwriting above one admission, **struck through**. Ink draws on scroll. New marginalia, not a rewrite. | HAND | **Best cheap idea here.** A page that shows its own edits *proves* honesty instead of asserting it. Scene 3 is "Nói thẳng" — let it look like it cost him something. |
| 11 | **Margin notes** — 4–6 short handwritten asides | 2,3,6 | e.g. an arrow next to *162cm* reading "thật đấy". Ink draws itself in as each beat arrives. | HAND | A human wrote this. Highest "made-by-a-person" per kilobyte. |
| 12 | **Incense stick + smoke thread** | 3 | One thin rising SVG path, slow lateral drift. Small, respectful, low in frame. | CODE | Gives the Buddhism line an image. Keep it *small* — a large religious motif overclaims. |
| 13 | **Two cups, one plume** | 4 | A second cup slides in beside the first; the two steam threads rise and **merge into one**. | CODE | *"những bữa ăn chung"* rendered instead of stated. The most on-message metaphor available. |
| 14 | **Vow lines on the fold** | 5 | The four vow lines sit along the sheet's fold crease. Zero travel — the *page* settles around them. | CODE | Restraint as emphasis. The stillest scene stays stillest. |
| 15 | **Cat charm (tuổi Mão)** | 6, recurring | A small brass cat. Present as a background object from scene 2 onward, so its scene-6 turn is a payoff, not an entrance. | PHOTO or CODE | Warmth plus a running gag that isn't a joke. |
| 16 | **Eight zodiac seals** | 6 | The eight compatible animals as small ink seals in a slow ring around the cat. Scene 6 only — keep the emoji in the dossier. | CODE | The zodiac line becomes a picture. **Guardrail: must never look like a horoscope calculator.** |
| 17 | **Wax seal, "TN"** | 7 | Presses down: scale 1.6→1 with a squash, edge spread, low thump. Also **the interactive beat** (§4). | CODE | The page gets an ending *sound*. |
| 18 | **Envelope + stamp + Quận 7 postmark** | 7 → 9 | The sealed sheet folds into the envelope (3-panel CSS 3D); the postmark rotates on like an ink press. | CODE | Closure. Redeems the one good idea in the stock hero. |
| 19 | **The clock** | all (subtle) | Small analog face; hands advance ~20:00 → 00:30 bound to scroll progress. Under 40px. | CODE | Makes the night-falling arc legible instead of merely felt. |
| 20 | **Voice note** | 7 | 15s of his real voice behind an explicit tap. Never autoplay. Shown as a hand-drawn waveform on the letter. | Recording | See W4. |

**20 objects. 8 need zero assets. 5 need only his handwriting or a phone camera.**

### Worked example — #applicant, actual choreography

Not "fade the three panels in." Beat sheet:

```
0.00  lamp pool widens, dust drifts (continuous, already running)
0.10  portrait drops 18px onto the wall, tape catches, 1.4 deg overshoot, damped swing
0.25  "Huong noi co nghe" sheet slides in from the right, lands 0.4 deg off-square
0.40  phone slides up from bottom edge, screen wakes (cold blue), Genshin daily visible
0.55  "Wibu nua mua" sheet lands; behind it 3 novel spines lean in at 3 parallax rates
0.70  coffee cup sets down, tiny liquid wobble, ring stain begins to bloom
0.85  "Playlist" sheet lands; song strips fan out from under it
1.00  margin note draws itself: an arrow to the phone
      cat charm has been in the bottom-right corner since 0.30, unremarked
```

Nine things moving, four different physical behaviours, zero of them a fade.

Counter-example — **#honest stays almost still.** One admission at a time, a 5px settle, the ink of the crossed-out line drawing through. Choreography includes deciding where *not* to move. The engine already understands this (`shared: { y: 0 }`) — it just has nothing but words to apply it to.

---

## 3. Five wow moments, ranked

### W1 — Đêm dần xuống · the night falls as she scrolls
**Zero new assets.**
**She sees:** the room gets later. Scene 1 is early evening, wide soft light. By #closing the lamp is the only light left, warm and narrow, and the corners of the page have gone to plum. Dust turns over in the beam. A small clock has moved from 20:00 to past midnight. She never catches it happening.
**Why it lands:** it is the only continuous transformation across all nine scenes, so the page feels like *one evening* instead of nine slides. It cannot be screenshotted, which is precisely why it reads as alive rather than as a graphic. And it is atmosphere, not trickery — no viewer thinks "clever," they think "late."
**Cost:** low. Interpolate a fixed backdrop layer against scroll progress. GSAP + ScrollTrigger already installed.
**Critical constraint:** **do not interpolate the text tokens.** He shipped a theme toggle; overriding her explicit choice is a bug. Apply time-of-day to the *backdrop layer only*. Light theme travels dusk → evening; dark theme travels evening → midnight. Both move, neither fights her.
**Phone:** one fixed compositor layer, transform/opacity only. Cheaper than the `filter: blur` he already ships.
**Reduced motion:** freeze at ~22:00. Still a lit room, no travel. Loses nothing readable.

### W2 — The empty chair
**She sees:** in the cold open, at the far right edge, a second chair turned slightly out from the desk. Nobody mentions it. It reappears at the edge of three more scenes. By #closing the camera has arrived at it, it is centred, and the lamp light finally reaches it — under the words *"Kết nối để tìm hiểu thêm nhé."*
**Why it lands:** it is his own first sentence made physical, and it never says so out loud. The restraint is what makes it land — a caption would kill it dead.
**Cost:** medium. One cutout, or a line-drawn SVG (which also works, and reads tender rather than literal). The camera arc is one scroll-bound x/scale on a background layer.
**Phone:** background layer at low opacity; at 390px keep it partly out of frame until #closing, then bring it in. Works better in portrait than on desktop.
**Reduced motion:** the chair is simply *there*, lit, in #closing. Static composition still carries it.
**Hard rule:** it is **never occupied.** See §6.

### W3 — The seal
**Zero new assets.**
**She sees:** at the bottom of the letter, a blank circle of rose wax. Text: *nhấn giữ để đóng dấu*. She presses and holds; the wax spreads under her thumb, "TN" impresses, a low thump, the sheet settles — and the Facebook link is revealed *underneath* the seal.
**Why it lands:** it converts the CTA from a button into an act, and it puts the last physical gesture of the page in *her* hand. Press-and-hold is slow and deliberate — the correct verb for this page.
**Cost:** low–medium. SVG blob + turbulence filter, `pointerdown`/`pointerup`, ~800ms progress ring.
**Phone:** press-and-hold is native to touch. Must suppress the long-press context menu.
**Reduced motion / no JS:** it is a plain button with the link visible. **Nothing is gated behind it** — see §4.

### W4 — His voice
**She sees:** a hand-drawn waveform near the close with *nghe thử* beside it. She taps. 15 seconds of him actually speaking — not a performance, just the closing paragraph out loud, or one sentence he didn't write down.
**Why it lands:** unfakeable, untemplatable, and it collapses the distance the entire page has been managing. A voice is the difference between reading a letter and being read to.
**Cost:** near zero to build (`<audio>`, tap to play). Very high to *do*. That is the real cost.
**Phone:** she may be in public. Show duration up front, never autoplay, make it obviously optional, offer a transcript.
**Risk, plainly:** a stiff or over-rehearsed delivery is worse than no voice note. One honest take with a stumble beats six polished ones. If he cannot do it unselfconsciously, cut it — do not ship a nervous performance on a page about being real.

### W5 — The desk assembles
**She sees:** §2's worked example — nine objects arriving with nine different weights.
**Why it lands:** it is the literal, direct answer to "multiple moving objects."
**Cost:** highest on the list. 6–8 cutouts, per-object timelines, a real weight budget.
**Phone:** lazy-load per scene; cap at ~5 objects at 390px.
**Reduced motion:** the desk is simply already set. The composition must be beautiful standing still — **if an object only makes sense while moving, cut that object.**
**Ranked last** because it is the most expensive and the least differentiated. Every agency site has an assembling hero. W1–W4 are things only *he* could ship.

**Zero-new-art requirement:** W1 and W3 are fully code-drawn; W2 works as SVG. Met three times over.

---

## 4. The interactive beat

### **Press and hold the wax seal.** One interaction. Only one.

- **Verb:** press-and-hold, ~800ms. Slow and deliberate — the opposite of a click. It is the only gesture on the page that costs her something, however small.
- **Placement:** at the **end**, in `#closing`. This is the whole design. It gates nothing.
- **Touch:** `pointerdown` / `pointerup` / `pointercancel`, suppress the long-press menu. Fully native on phone.
- **Fallback:** without JS, under reduced motion, or on a mistrigger it is a plain link. The Facebook URL is in the DOM from first paint.

**Why not an envelope she opens at the top?** It is the obvious idea and it is a trap: it puts a **door in front of a letter**. On a phone, an unfamiliar gesture before any content is a bounce. Never gate the sincerity behind a puzzle.

**Runner-up, worth naming:** a photo she can **tap to flip**, with something written on the back. Emotionally this may be stronger than the seal — the seal is *him* asking her to close the letter; the flip is *her* finding something he left. But it needs the seal's discoverability problem solved twice, and **two interactions is one too many**: the moment the page has several toys, it becomes a toy. Ship the seal. Consider the flip only afterwards, and only in place of nothing else.

---

## 5. Personalisation

Three levers, no backend. One is clearly best.

### Recommended: **the page runs on her clock.**

`new Date().getHours()` on her device sets the starting time of day. If she opens it at 1am the page *starts* at 1am — the lamp is already the only light in the room, the small clock reads what her phone reads, and one short line surfaces near the close acknowledging the hour.

Why this and not the others:
- **Not creepy:** no data leaves the device, nothing is stored, nothing is transmitted. It reads the same clock she is holding.
- **Not presumptuous:** it assumes nothing about who she is. It works for any reader.
- **No backend, ~10 lines.**
- **Untemplatable and unscreenshotable** — a friend she shows it to sees a different room. That is what makes it feel like it is happening *now, for her*.
- **Fuses with W1 for free:** her hour becomes the starting point of the night-falls arc.

Second-order: he cannot preview what she will see — needs a `?gio=1` debug param. And the late-night line must stay understated; *"1 giờ sáng rồi, cảm ơn vì vẫn đọc"* is warm, anything more is a nudge.

### Rejected: `?ten=Linh` (her name in the URL)
Puts her name in a link, in her history, in any screenshot, in his browser autocomplete. If she forwards it to a friend it either breaks or leaks. And a name typed by him into a query string is presumption wearing a costume. **If he wants her name on it, he should write it by hand on the printed letter and photograph that** — one asset, infinitely warmer, and it can only exist for one person.

### Adopt as well (nearly free): **make the freshness stamp mean something.**
`freshness-stamp.js` already reads his latest commit date. Right now it says the page is open. Let it say the page is *tended* — "sửa lần cuối 3 ngày trước." A page still being edited is a person still trying. Already built; costs a string change.

---

## 6. What would make it worse

Every one of these was considered and rejected. Rejected **specifically because this is a dating page**, not because the techniques are bad.

| Idea | Why it fails *here* |
|---|---|
| **Typewriter effect on the Vietnamese prose** | Three separate failures: she cannot read at that speed; diacritics reflow lines mid-type on a 390px screen; and it is the number-one "look at my JS" tell. Worst of all it makes her *wait* for a sincere sentence. Sincerity does not perform its own delivery. |
| **Floating hearts / petals / bokeh particles** | Valentine's e-card. Reads as *bought*, not *made*. Instantly relocates the page from "he wrote this" to "he found this." |
| **A WebGL / Three.js room** | The wow becomes "he is a good developer." That is a portfolio outcome and it damages the goal. Also kills the phone, which is the actual device. **Flag for the framework-research track: this is the specific trap on that side.** |
| **Physics — draggable, throwable desk objects** | Objects become toys. She will flick the coffee cup around and the sincerity evaporates in four seconds. Objects are *placed*, never throwable. Exactly one thing on the page is interactive. |
| **A compatibility quiz / zodiac calculator asking her birth year** | The written climax is literally *"Không có bài kiểm tra nào cả. Không có vòng loại nào hết."* A test UI would contradict his own thesis in the same scroll. Fatal. |
| **Custom cursor / cursor trails** | She is on a phone. Zero effect for the actual audience; pure self-entertainment. |
| **Horizontal scroll-jacking** | On touch it fights her thumb and reads as broken, not as designed. |
| **Autoplay background music** | Phone, possibly in public. Instant close. The playlist must be tap-to-play, always. |
| **Confetti on the CTA** | Celebrates before she has said anything. |
| **"Click to enter" splash / loading animation** | A door in front of a letter. Adds ceremony to the one thing that must feel unguarded. |
| **A counter — "X ngày một mình"** | Self-pity rendered as a metric. It also reframes her as the solution to a problem rather than a person. |
| **Filling the empty chair at the end** | The most tempting mistake available and the worst. It answers a question she has not been asked, and it turns an open hand into an assumption. The chair stays empty; the light just reaches it. |
| **Parallaxing the body text** | Measurably harder to read. Parallax is for objects only; type stays put. |
| **Animating the zodiac emoji** | Emoji render differently on every device; in motion they look cheap and off-brand. Keep them static in the dossier; use ink seals in scene 6. |
| **AI-generated "romantic illustration" of a couple** | The one AI asset that must not be used. It depicts a relationship that does not exist yet, in a generic style, on a page whose entire argument is specificity. Object cutouts: fine. Depicted people: never. |

---

## 7. Minimum viable wow — one thing this week

### Ship **W1: the night falls** (with the dust in the beam).

- **Zero new assets** → it can actually ship in a week with certainty. Every asset-dependent idea depends on him finding time to photograph things.
- It changes **all nine scenes at once**, which is the exact complaint.
- It builds the **container everything else will be lit by.** Nothing is thrown away — objects added in later weeks land into an already-working light and time system.
- The two supporting pieces (lamp pool, dust) are the cheapest multiple-moving-objects available: one radial gradient and one keyframe.

### And one thing that is not a wow but is a blocker

**Replace the stock hero and the grey silhouette.** A page whose thesis is honesty currently has exactly two images: someone else's desk, and a placeholder icon. No motion work outranks that. This is not week-one *wow* — it is week-one *credibility*, and it is a prerequisite for W2 and W5 anyway.

### Suggested sequencing after week one

- **Week 2:** portrait + hero replacement (real photos) → W2, the chair.
- **Week 3:** W3, the seal + the clock-based personalisation.
- **Week 4:** handwriting pass — margin notes and the crossed-out line.
- **Later / optional:** W5 (desk assembles), W4 (voice note, only if he can do it unselfconsciously).

### Second-order effects he should accept up front

- **Weight.** 18 cutouts with soft shadows can hit ~1MB. Budget the whole page under 1.5MB, webp only, lazy-load per scene.
- **Paint cost.** A fixed lit backdrop is a full-viewport layer. Transform/opacity only. He already learned this lesson once — the `body::before` comment in `styles.css` says exactly why.
- **Reduced-motion divergence grows.** Rule: *every object must be legible while still.* If an object only makes sense in motion, it is decoration; cut it.
- **Privacy.** Photographs of his room and his handwriting on a public GitHub Pages site is a decision, not a detail. He should make it consciously.
- **Cost of ownership.** The page becomes art-directed. Future copy edits will break compositions in a way that editing rounded rectangles never did.
- **New Vietnamese strings.** Several objects introduce short new copy (*nhấn giữ để đóng dấu*, margin notes, the late-hour line). Existing copy is untouched, per constraint — but **all new Vietnamese must be written by him.** Machine-written Vietnamese in a love letter is detectable, and it would undo everything else in this document.

---

## 8. Unresolved questions

**Needed from him — hard blockers**

1. **A portrait.** One good photo. Nothing on this list matters more.
2. **Real handles.** `YOUR_HANDLE` (Facebook and Instagram) and the real playlist URL are still placeholders in production.
3. **Is he willing to photograph his actual room and desk?** Yes → world B. No → fall back to world C (pure paper, all code-drawn). This decision gates roughly half the object list.

**Needed from him — high leverage**

4. **~6 short handwritten lines on paper, photographed.** Unlocks objects #10 and #11 at near-zero cost. Includes deciding what the crossed-out line in scene 3 originally said.
5. **Does he own a cat object?** (tuổi Mão charm or figure.) If yes, it is a free recurring motif.
6. **Would he record 15 seconds of his voice?** Highest-payoff, highest-courage item on the list.
7. **Objects to shoot** if world B: desk lamp, coffee cup, phone, 3–4 light novels, the second chair, the pen, one Genshin/T1 item.

**Open questions I could not resolve from the repo**

8. **Which metaphor wins — letter, job application, or short film?** All three are running. The chapter tags say film, the title says letter, the dossier and the hero say job application. The copy cannot be reworded, but the *visual world* can pick a side. I recommend **letter, staged as film, in a room**, and dropping the job-application imagery entirely — but the hero replacement forces this decision, so it needs his call.
9. **How is she receiving this link?** Sent privately by him, or discovered? The clock personalisation and the seal both assume private, intentional delivery.
10. **Is `#dossier` load-bearing?** It is the longest block on the page and the least animatable — it is a table. If the page becomes a room, 18 rows of facts is the one thing that stays a spreadsheet. Options: keep it as a deliberate "credits roll" (current framing, defensible), or turn it into a physical index-card stack. Needs a decision before W5.
11. **Owner's appetite for photography** is genuinely unknown, and it is the main fork in this whole document.
