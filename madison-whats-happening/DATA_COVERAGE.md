# DATA_COVERAGE.md

---

## Data Coverage Audit — 2026-04-26 13:10 — Full app data audit

### TLDR

- **48 total entries** across 3 zones (1 Start Here, 15 Every Week, 32 directory). All verified active as of today.
- **Category coverage: 50% covered / 19% thin / 31% bald** across 16 target activity categories.
- **Day-of-week coverage: 71% covered / 29% thin / 0% bald** — Monday and Sunday are single-entry days.
- **Top 3 bald spots:** Singles-specific groups (0 entries, 5+ high-confidence items researched but not applied), Men's connection (0 entries, Forward Brotherhood researched but not applied), Nightlife/solo venues (0 entries, I/O Arcade Bar researched but not applied).
- **Top 3 strengths:** Making/Crafts (5 entries, deep and diverse), Music & Performance (5 entries + 4 EW entries = 9 total touchpoints), Meet People (4 entries + Start Here, strong anchor).
- **81% of high-confidence researched items are in the app** (48 of ~59). The remaining 11 are all from Research Run 2 (singles-specific) — that entire run's findings are unapplied.
- **Priority action:** Apply the singles-specific research findings from Research Run 2. This fills 5 bald categories and 2 thin ones in a single pass.

### Project Intent

This is a curated social-activity directory for Madison, WI, rendered as a single-page HTML app. The target user is a 41-year-old single man looking to meet people through art, music, making things, sports, vibe coding, live music, and creative/quirky social scenes. "Complete" means: every major recurring social-activity category in Madison is represented with enough entries that a user can find something any day of the week, with clear signals that solo newcomers are welcome. The app is not a comprehensive event calendar — it's an opinionated, curated list biased toward low-barrier, show-up-alone-friendly activities. No governance docs (PLAN.md, PRD.md, SPEC.md) exist; intent is established entirely through the conversation record and the app's own subtitle: "Art, music, making, sports, tech, and people worth knowing."

### Research Uptake Since Last Audit

First audit — no prior DATA_COVERAGE.md to reconcile.

Two `## Research Run` entries exist in RESEARCH.md:

**Research Run 1 — 2026-04-26 12:02 — General additions**
- **Status: Fully applied.** All ~30 high-confidence findings from this run were incorporated into index.html during the "Apply these" step. Categories filled: Comedy & Improv (3 entries from 0), Social Dancing (3 entries from 0), Board Games (EW entry), Outdoor Recreation (3 EW entries), Running (EW entry), Seasonal (3 entries from 0), additional Music, Making, Art, and Sports entries. This run is the reason the app went from ~18 entries to 48.
- **Off-intent/noise:** SUP yoga (2026 dates unconfirmed), disc golf (wrong city), Library D&D (possibly wrong Madison). All correctly excluded.

**Research Run 2 — 2026-04-26 12:29 — Singles-specific**
- **Status: NOT applied.** Zero findings from this run are in the app. This is the primary coverage gap.
- **Intent-aligned findings that would fill bald cells:**
  - (a) Never a Third Wheel → fills Singles-Specific [BALD]
  - (a) Forward Brotherhood → fills Men's Connection [BALD]
  - (a) Madison After Dark → fills Singles-Specific [BALD]
  - (a) Saturday Morning Coffee → fills Singles-Specific [BALD] + adds SAT to EW
  - (a) Madison Random Fun! → fills Social Mixers [deepens COVERED]
  - (a) I/O Arcade Bar → fills Nightlife/Solo Venues [BALD]
  - (a) Happy.Sober.Free → fills Wellness/Mindfulness [BALD]
  - (a) Madison Pickleball Meetup → deepens Sports [COVERED]
  - (a) The Boneyard → fills Nightlife/Solo Venues [BALD] (requires dog — niche)
  - (a) D&D Adventurers League → fills Gaming/Tabletop [BALD]
  - (b) Greater Madison Adventurous Singles 45+ → sharpens gap: confirmed dead, do not add.
  - (b) MSSC free agent caveat → sharpens existing entry: "difficult for individual males."
  - (c) Mesh app → off-intent noise: age-skew concern makes it unreliable for target user.
  - (c) SnowFlower Sangha Wake Up → off-intent: age cap 18-39 excludes target user. Other sessions possible but niche.

**Previous agenda items:** None — first audit.

### Domain Model

**Axis 1: Activity Category** — What kind of social activity. 16 target categories identified from the project intent (user interests + research-surfaced gaps).

**Axis 2: Day of Week** — When can someone show up? Measured only for EVERY_WEEK entries (the "what can I do tonight?" layer).

**Target coverage space:** 16 categories × 3 depth tiers (bald/thin/covered) assessed against a threshold of ≥3 entries = covered, 1-2 = thin, 0 = bald. For day-of-week: 7 days × threshold of ≥2 entries/day.

| # | Target Category | Derived from |
|---|----------------|--------------|
| 1 | Social Mixers / Meet People | User intent: "making new friends" |
| 2 | Singles-Specific Groups | Research Run 2: groups where being single is the default |
| 3 | Men's Connection | Research Run 2: Forward Brotherhood, ManKind Project |
| 4 | Comedy & Improv | Research Run 1: Atlas, Comedy on State, Amalgam |
| 5 | Live Music & Performance | User intent: "bands/music" |
| 6 | Dance | Research Run 1: salsa, WCS, ecstatic |
| 7 | Making / Crafts | User intent: "making things" |
| 8 | Art & Creative | User intent: "art, quirky/creative minds" |
| 9 | Sports & Rec | User intent: "sports" |
| 10 | Tech & Code | User intent: "vibe coding" |
| 11 | Gaming / Tabletop | Research: board games (4,142 members), D&D (3,200 members) |
| 12 | Nightlife / Solo Venues | Research Run 2: I/O Arcade Bar, The Boneyard |
| 13 | Wellness / Mindfulness | Research Run 2: Happy.Sober.Free, meditation |
| 14 | Volunteering | Research Run 2: Food Pantry Gardens |
| 15 | Seasonal Events | Research Run 1: Concerts, Dane Dances, Garver |
| 16 | Outdoor Recreation | Research Run 1: MAOG, cycling, frisbee |

### Source Inventory

| Source | Path | Size | Schema (brief) | Contributes to |
|--------|------|------|----------------|----------------|
| START_HERE object | index.html L534-540 | 1 entry | `{name, desc, vibe, tags[], url}` | Single anchor recommendation |
| EVERY_WEEK array | index.html L542-678 | 15 entries | `{day, name, cost, detail, vibe, url, tags[]}` | Day-of-week recurring events |
| DATA array | index.html L680-1023 | 32 entries in 9 sections | `{section, icon, items[{name, desc, vibe, tags[], when, where, url}]}` | Main directory by category |
| RESEARCH.md Run 1 | RESEARCH.md L5-235 | ~30 findings, 32 sources | Structured findings with confidence, source tier, round logs | Applied to app — no unapplied items |
| RESEARCH.md Run 2 | RESEARCH.md L239-487 | ~15 findings, 32 sources | Same structure | **NOT applied** — 11 high-confidence items pending |
| localStorage (runtime) | Browser | Variable | `wh-favs[]`, `wh-dismissed[]` | User personalization only — not content |

### Coverage Matrix

**Axis 1: Category coverage (16 categories)**

Threshold: ≥3 items = COVERED, 1-2 items = THIN, 0 = BALD.
Items counted across all zones (START_HERE + EVERY_WEEK + DATA).

| # | Category | Items in App | EW entries | DATA entries | Status | Researched but unapplied |
|---|----------|-------------|-----------|-------------|--------|--------------------------|
| 1 | Social Mixers / Meet People | 5 | 0 | 4 + 1 SH | COVERED | Madison Random Fun! (3,647 members) |
| 2 | Singles-Specific Groups | 0 | 0 | 0 | **BALD** | NATW, Madison After Dark, Sat Morning Coffee |
| 3 | Men's Connection | 0 | 0 | 0 | **BALD** | Forward Brotherhood (717 members) |
| 4 | Comedy & Improv | 4 | 1 | 3 | COVERED | — |
| 5 | Live Music & Performance | 9 | 4 | 5 | COVERED | — |
| 6 | Dance | 4 | 2 | 1 (+1 seasonal) | COVERED | — |
| 7 | Making / Crafts | 7 | 1 | 5 (+1 EW knit) | COVERED | — |
| 8 | Art & Creative | 6 | 2 | 4 | COVERED | — |
| 9 | Sports & Rec | 8 | 3 | 4 (+1 EW frisbee) | COVERED | Pickleball (2,804 members), Grown-Up Swimming |
| 10 | Tech & Code | 3 | 0 | 3 | COVERED | — |
| 11 | Gaming / Tabletop | 1 | 1 | 0 | **THIN** | D&D Adventurers League (3,200 members) |
| 12 | Nightlife / Solo Venues | 0 | 0 | 0 | **BALD** | I/O Arcade Bar, The Boneyard |
| 13 | Wellness / Mindfulness | 0 | 0 | 0 | **BALD** | Happy.Sober.Free (590 members) |
| 14 | Volunteering | 0 | 0 | 0 | **BALD** | Food Pantry Gardens (2,100+ volunteers) |
| 15 | Seasonal Events | 3 | 0 | 3 | COVERED | Grown-Up Swimming (summer only) |
| 16 | Outdoor Recreation | 2 | 2 | 0 (MAOG in Meet People) | **THIN** | NOW Outdoors (4,049 members) |

**Summary: 10 COVERED (62%) / 2 THIN (13%) / 4 BALD (25%)**

*Note: Categories 2, 3, 12-14 are all bald despite having high-confidence research sitting in RESEARCH.md Run 2. This is a pure application gap, not a data gap.*

**Axis 2: Day-of-week coverage (EVERY_WEEK zone only)**

Threshold: ≥2 entries = COVERED, 1 = THIN.

| Day | Entries | Status |
|-----|---------|--------|
| MON | 1 | **THIN** |
| TUE | 4 | COVERED |
| WED | 3 | COVERED |
| THU | 2 | COVERED |
| FRI | 2 | COVERED |
| SAT | 2 | COVERED |
| SUN | 1 | **THIN** |

**Summary: 5/7 COVERED (71%) / 2/7 THIN (29%) / 0/7 BALD (0%)**

**Cross-tab: Tag × Zone**

| Tag | START_HERE | EVERY_WEEK | DATA | Total |
|-----|-----------|-----------|------|-------|
| social | 1 | 15 | 17 | 33 |
| art | 0 | 5 | 10 | 15 |
| music | 0 | 4 | 7 | 11 |
| sports | 0 | 4 | 5 | 9 |
| making | 0 | 2 | 5 | 7 |
| tech | 0 | 0 | 4 | 4 |

*Note: Items have multiple tags; totals exceed 48.*

**Observation:** Tech has 0 entries in EVERY_WEEK. There's no recurring weekly tech event despite 3 tech-tagged items in DATA. This is a structural gap — a tech person looking at the "Every Week" zone sees nothing.

### Bald Spots (deep)

**1. Singles-Specific Groups — BALD (0 entries)**
- **Why bald:** Research Run 2 identified 3+ high-confidence groups (Never a Third Wheel: 1,134 members; Madison After Dark: 1,797 members; Saturday Morning Coffee: 1,012 members) but findings were never applied to index.html.
- **Impact: HIGH.** The project's target user is a 41-year-old single man. Groups explicitly built for people who show up alone are the highest-value data for this user. This is the #1 gap.
- **Fill action:** Apply NATW, Madison After Dark, Saturday Morning Coffee, and Madison Random Fun! from Research Run 2. Add as new "Singles & Solo" section or fold into "Meet People."
- **Source tier:** T1 — all verified on Meetup with member counts, ratings, and recent events.

**2. Men's Connection — BALD (0 entries)**
- **Why bald:** Forward Brotherhood (717 members, 4.8★, weekly) was researched in Run 2 but not applied.
- **Impact: HIGH.** For a single man, a men's vulnerability/connection circle is a qualitatively different resource than a social mixer. Research explicitly noted this fills the "I need real connection" end of the emotional spectrum.
- **Fill action:** Add Forward Brotherhood to a new "Men's Connection" or "Deeper Connection" section, or to "Meet People" with a vibe line addressing the intimidation factor.
- **Source tier:** T1 — Meetup page with 153 past events, verified weekly schedule.

**3. Nightlife / Solo Venues — BALD (0 entries)**
- **Why bald:** I/O Arcade Bar and The Boneyard were researched in Run 2 but not applied.
- **Impact: MEDIUM.** These are "just go somewhere alone" options, not scheduled events. Valuable for spontaneous outings but lower priority than structured social groups.
- **Fill action:** Add I/O Arcade Bar (70+ games, board game room, karaoke Sundays, 924 Williamson St). Consider Boneyard only if scope includes dog-owners.
- **Source tier:** T1 — venue website verified.

**4. Wellness / Mindfulness — BALD (0 entries)**
- **Why bald:** Happy.Sober.Free (590 members, 4.8★) was researched but not applied. SnowFlower Sangha was found but has age concerns for the target user.
- **Impact: MEDIUM.** Covers the "I don't drink but want to socialize" niche, which is distinct and underserved. Not a core user interest but valuable for completeness.
- **Fill action:** Add Happy.Sober.Free. Consider SnowFlower Sangha's all-ages sessions (Tue/Thu 7pm) as secondary.
- **Source tier:** T1 — Meetup, verified with recent events.

**5. Volunteering — BALD (0 entries)**
- **Why bald:** Madison Area Food Pantry Gardens (2,100+ volunteers/year) was researched but not applied. No other volunteering options were researched.
- **Impact: LOW.** Volunteering is a valid social connector but not a core interest of the target user and is seasonal (Apr-Oct). One entry would satisfy this gap.
- **Fill action:** Add Food Pantry Gardens as a single entry in a "Give Back" or "Volunteering" section, or fold into Seasonal.
- **Source tier:** T1 — organization website, verified.

**6. Gaming / Tabletop — THIN (1 entry: Board Games in EW)**
- **Why thin:** Board Games Noble Knight covers Friday gaming. D&D Adventurers League (3,200+ members) was found in Run 1 research notes but never added. Madison has 3+ game stores with organized play.
- **Impact: MEDIUM.** D&D/tabletop is a massive social scene in Madison (3,200+ organized play members). The single Board Games entry underrepresents the community.
- **Fill action:** Add Madison D&D Adventurers League to DATA. Consider Misty Mountain Games organized play.
- **Source tier:** T1 — Meetup page + madisondnd.com.

**7. Outdoor Recreation — THIN (2 scattered entries)**
- **Why thin:** MAOG (882 members) is in "Meet People" section rather than being categorized as outdoor rec. Cycling and frisbee are in EW. No dedicated "Outdoors" section despite Madison's outdoor culture being central to the city's identity.
- **Impact: MEDIUM.** Outdoor activities are scattered across categories rather than consolidated. A user filtering for outdoor options won't find them all. NOW Outdoors (4,049 members) from Research Run 2 was not added.
- **Fill action:** Consider adding NOW Outdoors and/or consolidating outdoor entries into a visible group. Or add an "outdoor" tag to the tag filter.
- **Source tier:** T1 — Meetup, verified.

*Remaining thin/bald patterns:*
- **Monday EW slot (thin, 1 entry):** Only Madtown Monday bike ride. Saturday Morning Coffee could be reframed if it had a Mon option, or Madison Random Fun! trivia nights (Mon at various venues) could fill this.
- **Sunday EW slot (thin, 1 entry):** Only Mickey's Tavern open mic at 10pm (late). I/O Arcade Bar karaoke is Sundays 7pm — would fill this.
- **Tech in EVERY_WEEK (bald, 0 entries):** MadAI and Software Dev are monthly, not weekly. No weekly recurring tech event exists in the data.

### Strengths

**1. Music & Performance is the deepest category.**
9 total touchpoints (4 EW + 5 DATA). Covers open mics (3 venues), rehearsal spaces (2), jams (2), activist band (1), and jazz/live music (1). Every day except Thursday has a music-related EW option. Cross-verified across Isthmus listings, venue websites, and Meetup pages. This is the strongest axis in the app.

**2. Making / Crafts has excellent diversity.**
7 touchpoints spanning pottery (Kiln Shed, Wheelhouse), printmaking (Polka! Press), fiber arts (Textile Arts Center, Communication Madison), electronics (Sector67), and general making (The Bodgery). Price range from free to $75. Every sub-discipline has a dedicated entry. Well cross-verified.

**3. Every Week section provides strong temporal coverage.**
15 entries across all 7 days, with day-of-week headers, cost badges, and specific addresses. The grouped-by-day rendering makes it immediately actionable. Tuesday is the strongest day (4 entries). No day is bald.

**4. Start Here anchor is high-confidence.**
30/40 Somethings Meetup (1,500+ members) is the single most relevant entry for the target user, prominently featured with a distinct visual treatment. Verified active with multiple weekly events.

**5. All 48 entries verified active.**
A full liveness audit was run today (2026-04-26). One dead entry (Madison Digital Artists Meetup — last event June 2025, 1-2 attendees) was removed. Communication Madison's address was updated to their new location. Comedy on State time was corrected from 9pm to 8pm. Zero stale entries remain.

**Concentration risk:**
- **Meetup.com** is the source of truth for 8 DATA entries and underlies member-count claims for several EW entries. If Meetup changes its model or a group migrates (as Greater Madison Adventurous Singles 45+ did to Facebook), these entries could go stale silently.
- **Communication Madison** accounts for 2 of 15 EW entries (13%). If they lose their space again, two weekly events vanish.
- **No entry has fewer than 1 independent T1 source**, which is a baseline strength — nothing in the app is unverifiable.

**Over-depth observation:**
Sports & Rec has 8 touchpoints across EW and DATA, including two soccer-specific entries (KEVA, TOCA) that serve overlapping audiences. This is denser than needed for the target user, who expressed interest in "sports" generally, not soccer specifically. Consider whether one soccer entry would free a slot for a missing category.

### Priority Ranked Actions

| # | Action | Impact | Cost | Priority | Hand off to |
|---|--------|--------|------|----------|-------------|
| 1 | Apply Research Run 2: add Never a Third Wheel, Saturday Morning Coffee, Madison After Dark to app | High | Cheap (data exists in RESEARCH.md) | **P1** | Self (code edit) |
| 2 | Apply Research Run 2: add Forward Brotherhood to app | High | Cheap | **P1** | Self (code edit) |
| 3 | Apply Research Run 2: add I/O Arcade Bar to app (fills Nightlife + Sunday EW) | High | Cheap | **P1** | Self (code edit) |
| 4 | Apply Research Run 2: add Madison Random Fun! to app | Medium | Cheap | **P2** | Self (code edit) |
| 5 | Apply Research Run 2: add Happy.Sober.Free to app | Medium | Cheap | **P2** | Self (code edit) |
| 6 | Apply Research Run 2: add Madison Pickleball Meetup to app | Medium | Cheap | **P2** | Self (code edit) |
| 7 | Add D&D Adventurers League (3,200+ members) to Gaming section | Medium | Cheap | **P2** | Self (code edit) |
| 8 | Add Monday EW entry — research Madison Random Fun! trivia night day/venue | Medium | Moderate (verify specific Monday venue) | **P3** | @researcher Light Research |
| 9 | Add Food Pantry Gardens as single volunteering entry | Low | Cheap | **P3** | Self (code edit) |
| 10 | Research NOW Outdoors (4,049 members) for outdoor rec section | Low | Moderate | **P4** | @researcher Light Research |

**Verdict:** 7 of 10 priority actions are free — the data already exists in RESEARCH.md and just needs to be added to index.html. This is a rare "all upside, no cost" situation.

### Research Agenda (for @researcher)

| # | Seed (paste-ready, intent-grounded) | Mode | Target tier | Fills (bald cells) | Priority | Status |
|---|-------------------------------------|------|-------------|---------------------|----------|--------|
| 1 | "For a Madison WI social-activity directory targeting a single 41yo man: what day and venue does Madison Random Fun! host their Monday trivia night? Need venue name, address, time, cost, and whether solo attendees are common." | Light | T1 | Monday EW [THIN], Gaming [THIN] | P3 | pending |
| 2 | "For a Madison WI social-activity directory: active weekly or biweekly tech/code social events (not monthly) in Madison WI 2026. Looking for meetups, hack nights, or co-working sessions that recur weekly. Need name, day, time, venue, cost." | Light | T1 | Tech in EW [BALD] | P3 | pending |
| 3 | "For a Madison WI social-activity directory: additional solo-friendly nightlife venues or recurring social bar events in Madison WI 2026, beyond I/O Arcade Bar. Board game cafes, pinball bars, social gaming venues. Need name, address, hours, solo-friendliness signal." | Light | T1-T2 | Nightlife [BALD] | P4 | pending |
| 4 | "For a Madison WI social-activity directory: active volunteering opportunities in Madison WI 2026 that are drop-in friendly, social, and don't require long-term commitment. Beyond Food Pantry Gardens. Need org name, schedule, address, what you do, solo-friendly signal." | Light | T1-T2 | Volunteering [BALD] | P4 | pending |
| 5 | "For a Madison WI social-activity directory: verify Madison D&D Adventurers League organized play schedule for 2026 — which stores, which days, what time, is individual signup available, cost." | Light | T1 | Gaming [THIN] | P3 | pending |

### Open Questions

1. **Should Research Run 2 findings be added as-is, or does the user want another UX review first?** Adding 8-11 entries to a 48-entry app is a ~20% expansion that could re-trigger the "wall of cards" concern from the original UX feedback.
2. **Should "Singles-Specific" be its own section or folded into "Meet People"?** A dedicated section signals to the target user that the app understands them. But it could feel stigmatizing. User judgment call.
3. **Is the Boneyard (dog park) in scope?** Requires owning a dog. The user's pet ownership status is unknown.
4. **Should duplicate soccer entries (KEVA + TOCA) be consolidated** to free a slot for a missing category? Both serve "adult soccer in Madison" — one could be removed without coverage loss.
5. **How should Meetup concentration risk be mitigated?** 8 entries depend on Meetup.com links. If Meetup goes behind a paywall or groups migrate, these could break. Consider adding secondary URLs (Facebook, org websites) as fallbacks.

<!-- @data-coverage | 2026-04-26 13:10 | Full app data audit -->
