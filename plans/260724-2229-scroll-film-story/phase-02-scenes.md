# Phase 2 — Scene conversion (the story arc)

Goal: rearrange the EXISTING information into a short-film narrative arc, then
bind each scene to a pinned/scrubbed GSAP timeline. Nothing invented, nothing
dropped — only reordered and reframed so the page opens on the human and builds
to sincerity.

## Why rearrange

Current order: Invitation → Packet(meta) → full JD → full CV → Close. That
front-loads the corporate conceit and saves the person for the end. A film opens
on a protagonist + a want, earns interest, then makes the pitch and turns
emotional. New order leads with the human ache, then presents "the offer,"
then lands sincerity.

## New arc (7 scenes)

Vietnamese keeps the existing witty tone; source = current index.html content.

### Scene 1 — Cold open: "Vị trí bỏ trống đã lâu"
- Beat: a single spotlit line — a position has stayed open too long.
- Hook, funny + a little lonely.
- Source: hero eyebrow "Vị trí mở / bạn đồng hành dài hạn" + CV lead
  ("lười đi một mình", "nghiêm túc hơn cả cách mình cày event Genshin").

### Scene 2 — Nhân vật chính (the applicant reveal)
- Beat: quick, funny self-portrait — the honest introvert dev.
- Source: name, 26 / 1999 / tuổi 🐈, Quận 7, "công nhân đánh máy tại Xí nghiệp
  gêm Vê Nờ Gờ", wibu/isekai, Genshin/TFT/T1-Keria, eclectic playlist.
  (from CV "Chân dung nhanh" panels — condensed into character texture.)

### Scene 3 — Thành thật từ đầu (vulnerability beat)
- Beat: flaws + truths on the table — the move that makes it real AND funny.
- Source: past 3-yr relationship, healed & ready; frugal; no smoking / occasional
  drink; Phật giáo but not ordained; and the disarming punchlines — 162cm
  "không cộng dép", không thích thú cưng, fetish là chân 🌚.

### Scene 4 — Lời mời làm việc (the pitch / benefits)
- Beat: reframe JD benefits as promises to the reader.
- Source: JD "Quyền lợi" (support on hard days, honest blameless comms, someone
  who debugs prod and overthinks dinner, long-term growth roadmap).

### Scene 5 — Điều cả hai cùng giữ (responsibilities, shared)
- Beat: the "we both protect this" reciprocity beat.
- Source: JD "Trách nhiệm" (trust via small repeated actions, respect for time /
  family / friends, curiosity + repair after conflict, serious-and-silly).

### Scene 6 — Không có bài kiểm tra áp lực (criteria + climax)
- Beat: joke drops away, sincerity peaks — the emotional turn.
- Source: JD "Điểm cộng" + "Ghi chú tuyển chọn" (no pressure test, no hidden
  puzzle; strong applicant = kind when tired, honest when tangled); zodiac
  compatibility gag (tuổi 🐒🐅🐍🐎🐖 / 🐉🐕) as a light exit-laugh.

### Scene 7 — Lời kết (resolution / closing card)
- Beat: warm landing + call to connect.
- Source: current Chương 5 closing copy. Optional confetti payoff (open Q).

## Full-facts handling

The `facts-list` (`<dl>`: height, weight, hometown, languages, education, etc.)
is reference data, not a dramatic beat. Keep it as a **"credits roll" / dossier
appendix after Scene 7** — collapsible or a quieter final panel — so the film
stays lean but the completeness is preserved.

## Implementation steps

1. Re-sequence sections in `index.html` to the 7-scene order (semantic reorder;
   keep all copy as real DOM text).
2. Wrap each scene in a pin container; author one GSAP timeline per scene with
   scrubbed beats (headline in, body/panels stagger, exit).
3. Update chapter tags (Chương 1..7 or rename to scene titles).
4. Keep `data-reveal` markup as the reduced-motion / no-JS fallback path.

## Validation

- Reading order (JS off) tells the same story top-to-bottom and is complete.
- Each scene pins and scrubs; no orphaned/empty beats.
- Facts dossier reachable and readable; nothing from the original is lost.

## Risks / rollback

- Reordering may disturb in-page anchors (#jd, #cv) used by nav → update nav +
  active-nav id list in `story-chrome.js` (Phase 3).
- Rollback: revert index.html section order; scenes are additive wrappers.
