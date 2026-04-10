# CORPORATE GOLF

## Game Design Document

---

## 1. IDENTITY

**Title:** Corporate Golf
**Aesthetic:** Windows 95 retro — beige UI panels, pixelated system fonts, dropdown menus, green-on-black terminal text, low-fi dithered textures. Think Solitaire win screen meets Office 97 meets Links LS. Corporate America filtered through 90s desktop nostalgia.
**Tone:** Dark comedy. The absurdity of corporate life colliding with the zen of golf. Satirical but sincere — you actually care about the round, the relationships, and your career. The humor comes from recognizing yourself in it.
**Platform:** Browser-based, always online. No offline mode. Even solo play connects to the shared world.

---

## 2. CORE CONCEPT

You are a mid-level corporate employee at a large, vaguely sinister company. You've been invited to a company golf outing at Pebble Beach — a round on the front nine with coworkers, bosses, and clients. This is not just golf. This is politics, performance review, networking, and survival, all compressed into 9 holes.

Every shot you take is influenced by your mental state. Every conversation you have affects your stats, your relationships, and ultimately your career. The golf is the vehicle. The story is what happens between the shots.

**The player is always a decent golfer.** When your stats are balanced and your head is clear, you can hit the ball. You've played before. You're not a pro, but you're competent. The game's difficulty comes from keeping your head straight while the corporate world tries to rattle you.

---

## 3. ALWAYS ONLINE

There is no "offline mode." The game is a living course. When you play, other real people may be playing too. You share the same Pebble Beach. Encounters happen naturally — in the clubhouse, between holes, on adjacent fairways.

**Solo play** still has a full narrative experience (Dave, your boss, corporate story), but the world has real people moving through it. If nobody else is online, you never notice. If they are, the course feels alive.

The server tracks:
- Who is on the course
- What hole/phase each player is in
- Player stats (which determine how their dialogue appears to others)
- Active encounters between players

---

## 4. STAT SYSTEM

Five core stats, starting at 50 (range 0–100):

| Stat | What It Governs | Golf Effect | Social Effect |
|------|----------------|-------------|---------------|
| **Focus** | Mental discipline, concentration | Shot consistency, reduces randomness | Precise, measured responses |
| **Swagger** | Confidence, charisma | Tee shot power, risk-reward payoff | How charming/awkward you come across |
| **Humor** | Levity, social lubrication | Recovery from bad shots, zen under pressure | How funny vs. cringe your jokes land |
| **Knowledge** | Golf IQ, course management | Club selection, reading greens, smart play | How insightful vs. clueless your advice sounds |
| **Zen** | Inner peace, flow state | Overall shot floor, clutch performance | How calming vs. unsettling your presence is |

### Stats Affect EVERYTHING

This is the core mechanic. Stats don't just change numbers — they change what people see and how the world responds.

**On the course (golf):**
- Your base shot quality is determined by your choice (swing thought) PLUS your stats
- A focused, knowledgeable player making the "technical" choice gets better results than a distracted one
- A high-swagger player taking the "grip it and rip it" choice actually pulls it off more often
- Birdies require high relevant stats AND the right choice. Eagles require near-max stats, the perfect choice, AND some luck.

**In NPC dialogue (Dave, your boss, others):**
- When you pick a dialogue option, Dave doesn't see your "intended" line
- He sees the STAT-FILTERED version, same as multiplayer
- Low swagger? Your confident line comes out awkward
- High humor? Your joke actually lands and Dave laughs
- This affects his impression, which affects the story
- The player sees what they MEANT to say. The narrative describes how it was RECEIVED.

**In multiplayer:**
- Other real players see the stat-filtered version of your dialogue
- You never know what they saw
- Your stats are your social currency

### Stat-Filtered Dialogue Structure

Every dialogue choice (NPC or multiplayer) is authored with 5 tiers:

```
TIER 1 (stat 0-20):   DISASTROUS — embarrassing, off-putting, career-damaging
TIER 2 (stat 21-40):  AWKWARD — clumsy, try-hard, slightly weird
TIER 3 (stat 41-60):  NORMAL — unremarkable, fine, forgettable
TIER 4 (stat 61-80):  SMOOTH — likeable, well-delivered, impressive
TIER 5 (stat 81-100): MAGNETIC — charming, memorable, career-defining
```

Which stat applies depends on the CONTEXT of the line:
- Greeting someone → Swagger
- Making a joke → Humor
- Giving golf advice → Knowledge
- Encouraging someone → Zen
- Being competitive → Focus + Swagger blend
- Talking about work → Context-dependent (pitching an idea = Swagger, analyzing a problem = Focus + Knowledge)

---

## 5. GOLF MECHANICS — DIFFICULTY TUNING

### Philosophy
You are a DECENT golfer. Not a hack, not a pro. Think 12-15 handicap. On a good day, you can shoot in the low 40s for nine holes. On a bad day, upper 40s. The mental game is what separates the two.

### Shot Quality Resolution

```
PERFECT:  -0.6 base → rare, requires good choice + high stats + luck
GREAT:    -0.3 base → uncommon, good choice + decent stats
GOOD:      0.0 base → the default outcome for smart choices
OKAY:     +0.3 base → mediocre choice or bad stats
BAD:      +0.6 base → poor choice or very low stats
TERRIBLE: +1.0 base → worst choice + low stats
SHANK:    +1.5 base → catastrophic, only from terrible choices + very low stats
```

### Birdie/Eagle Probability (per hole)

With balanced stats (50s) and smart choices:
- **Birdie:** ~12-18% chance per hole (feels hard but achievable — maybe 1-2 per round)
- **Eagle:** ~1-3% chance per hole (extremely rare, requires everything to align)
- **Par:** ~35-45% (the comfortable outcome for good play)
- **Bogey:** ~25-30% (common, not devastating)
- **Double+:** ~10-15% (bad day, bad choices, or terrible stats)

With high stats (70+) and optimal choices:
- **Birdie:** ~25-30%
- **Eagle:** ~5-8%
- **Par:** ~40-45%

With low stats (30-) and poor choices:
- **Birdie:** ~2-5%
- **Bogey or worse:** ~50-60%

### Walking Moments
Between every shot, there's a "walking" moment. You're walking to your ball. This is where micro-narrative happens — a thought, a memory, a phone notification, a conversation snippet. These are small but they accumulate. Each one is a tiny choice or observation that nudges your stats and feeds the story.

---

## 6. STORY ARCHITECTURE

### The Layers

The narrative operates on four simultaneous layers, from macro to micro:

```
LAYER 1: THE ARC         (the whole round — your career, your relationships, your identity)
LAYER 2: THE HOLE         (each hole has a theme, a tension, a mini-story)
LAYER 3: THE MOMENT       (each shot, each walk, each dialogue exchange)
LAYER 4: THE THOUGHT      (the swing thought — your inner voice in the split second of action)
```

These layers nest. The Arc provides context for the Hole. The Hole provides context for the Moment. The Moment provides context for the Thought. And the Thought's outcome feeds back up through all layers.

### Layer 1: THE ARC — "The Anderson Account"

**Placeholder main story:**

You work at Meridian Partners, a large consulting firm. Today's golf outing is not recreational — it's a soft audition. The Anderson Account, the firm's largest client, is up for renewal. Three people on this course today are competing for the lead on it:
- **You** — mid-level, hungry, talented but unproven at this level
- **Dave** (your playing partner) — senior associate, connected, been at the firm 8 years, genuinely decent
- **Sharon** (your boss) — VP, playing in the group behind you, watching through binoculars (metaphorically and maybe literally)
- **Tom Anderson** (the client) — playing in his own group, might stop by the clubhouse after

The arc unfolds across all 9 holes:
- **Holes 1-3:** Establishment. You and Dave are feeling each other out. Sharon texts you. The stakes become clear.
- **Holes 4-6:** Escalation. A conversation with Dave reveals he's also up for the Anderson lead. Office politics emerge. Your phone buzzes with info that changes the calculus.
- **Holes 7-9:** Resolution. Depending on your choices, you and Dave are either allies, rivals, or something more complex. The final holes carry the weight of everything that came before.

The arc has MULTIPLE endings depending on:
- Your relationship with Dave (impression score)
- Flags set by dialogue choices (did you share info? betray a confidence? help him? compete?)
- Your golf performance (did you impress? embarrass yourself?)
- Your stats (which determine how the final interactions land)

### Layer 2: THE HOLE — Thematic Structure

Each hole carries a theme that mirrors the corporate story:

| Hole | Course Feature | Corporate Theme | Narrative Focus |
|------|---------------|-----------------|-----------------|
| 1 | Gentle opening | First impressions | Meeting Dave, establishing tone |
| 2 | Dogleg left | Hidden angles | Dave's not what he seems |
| 3 | Ocean views | Perspective | Sharon's text, bigger picture |
| 4 | Par 5, risk/reward | Ambition | Career conversation, how far will you reach? |
| 5 | Over the chasm | Fear of failure | Anderson Account revealed, stakes are real |
| 6 | Strategic par 4 | Office politics | Dave knows something, will he share? |
| 7 | Short par 3 | Simplicity vs. overthinking | Phone call from Sharon, keep it simple |
| 8 | The signature hole | The moment of truth | What kind of person are you? |
| 9 | Final hole | Consequences | Everything lands |

### Layer 3: THE MOMENT — Shot-by-Shot Narrative

Each shot cycle follows this pattern:

```
SETUP → WALKING MOMENT → SWING THOUGHT → RESULT → REACTION
```

**Setup:** Describes the lie, the distance, the conditions. Establishes the golf context.
**Walking Moment:** A narrative beat. Could be:
  - A thought about the corporate story
  - A phone notification
  - A conversation snippet with Dave
  - An observation about the course/weather/wildlife
  - A memory triggered by the situation
**Swing Thought:** The core mechanic — 3-4 choices that represent what's in your head as you swing.
**Result:** How the shot turned out, filtered through your choice + stats.
**Reaction:** Dave's response, your internal reaction, any stat/story consequences.

### Layer 4: THE THOUGHT — Inner Voice

The swing thought is the most intimate layer. It's YOU in the split second before the club meets the ball. Every thought has consequences:

- **The right golf thought** (technical, visualization) → better shot, +focus/knowledge
- **The wrong golf thought** (overthinking, jinxing) → worse shot, -focus/zen
- **The distraction** (waitress, work, phone) → worse shot BUT social/humor/personality gains
- **The corporate thought** (boss, meeting, career) → contextual, ties into the main story

---

## 7. THE CELL PHONE

Your phone is a persistent game element. It sits in your pocket and it buzzes.

### Phone Events
- **Text from Sharon (boss):** Instructions, pressure, questions about Dave, veiled threats
- **Text from Dave:** Side channel — he texts you things he won't say out loud
- **Email from HR:** Corporate noise, but sometimes contains useful info
- **Text from spouse/friend:** Humanizing moments, perspective, comic relief
- **App notifications:** Weather alerts, stock prices, calendar reminders (the meeting is at 4 PM)
- **Missed call from Tom Anderson:** Does he want to talk to you specifically?

### Phone Mechanics
- Phone buzzes at scripted moments (walking between shots, between holes)
- You choose: CHECK PHONE or IGNORE
- Checking the phone gives information but costs focus
- Ignoring builds zen but you miss potential intel
- Some phone events unlock dialogue options with Dave
- Some set flags that affect the story later
- In multiplayer, you can DM other players — through a dialogue tree (your stats filter what they see)

---

## 8. OBJECTIVES SYSTEM

Objectives appear throughout the round. Some are given, some are discovered.

### Types

**Corporate Objectives** (from Sharon, via phone):
- "Find out if Dave has talked to Anderson directly" → requires specific dialogue choices
- "Make a good impression — no worse than bogey on the next three holes" → golf performance
- "Don't mention the quarterly numbers" → avoid certain dialogue paths

**Personal Objectives** (self-generated):
- "Break 40 on the front nine" → scoring goal
- "Get Dave to open up" → relationship goal
- "Stay calm through all 9 holes" → keep zen above 50

**Secret Objectives** (discovered through play):
- "Dave's going through something. Find out what." → triggered by noticing something in dialogue
- "Tom Anderson is in the clubhouse. Get there before Sharon." → timing-based
- "There's a side bet. Win it." → competitive

### Objective UI
- Objectives appear as "memos" in a corporate memo style (Windows 95 notepad aesthetic)
- You can ACCEPT or DECLINE objectives from Sharon
- Declining has consequences (she notices)
- Completing objectives grants stat boosts and unlocks story branches
- Failed objectives have narrative consequences but the game continues

---

## 9. MULTIPLAYER INTERACTIONS — CREATIVE IDEAS

### Current System
- Encounter-based: players meet naturally based on location/proximity
- Stat-filtered dialogue: your stats determine how your lines land with others
- Encounter types: clubhouse, passing, nearby, wave

### Ideas for Deeper Interaction

**The Clubhouse Board:**
A persistent message board in the clubhouse. Players can post messages (stat-filtered to everyone who reads them). High-stat messages become clubhouse legends. Low-stat messages get quietly removed by management. Think of it as a golf course version of a break room whiteboard.

**The Scorecard Exchange:**
At the end of a round, you can share your scorecard with another player. But the scorecard shows MORE than just scores — it shows your choices, your stats at each hole, and a generated "round narrative" that reads like a short story. Other players can read your round like a novel.

**The Caddy Offer:**
A player who's finished their round can volunteer to "caddy" for someone still playing. They see the other player's hole in real-time and can offer advice (stat-filtered, of course). A high-knowledge caddy gives useful tips. A low-knowledge caddy gives hilariously bad advice.

**The Side Bet Network:**
Players can propose bets to anyone on the course. Closest to the pin, lowest score on a specific hole, first birdie. Bets are tracked and settled automatically. Winning a bet boosts swagger. Losing... doesn't.

**The After-Round Drink:**
Players who finish within a few minutes of each other can enter "the 19th hole" — a clubhouse bar scene with deeper dialogue trees, longer conversations, and the ability to add each other as "golf buddies" for future rounds. This is where real connections form.

**The Anonymous Tip:**
You can send a one-line message to any player on the course. It arrives as a phone notification. They don't know who sent it. Your stats determine if the tip is helpful, cryptic, or unhinged.

---

## 10. WRITING GUIDE — HOW TO AUTHOR CONTENT

### The Folder Structure

All narrative content is organized in a file/folder system that mirrors the game's layers:

```
story/
  arc/
    act-1.js          ← Holes 1-3 main story beats
    act-2.js          ← Holes 4-6 main story beats
    act-3.js          ← Holes 7-9 main story beats
    endings/
      ally.js         ← Dave becomes ally ending
      rival.js        ← Dave becomes rival ending
      betrayal.js     ← You or Dave betrayed the other
      transcendent.js ← Both of you see past the corporate game
  holes/
    hole-1/
      intro.js        ← Hole intro narration
      walking.js      ← Walking moments for this hole
      dialogues.js    ← Dave dialogue tree for this hole
      phone.js        ← Phone events for this hole
    hole-2/ ...
  thoughts/
    tee/
      generic.js      ← Generic tee swing thoughts
      hole-specific.js ← Hole-specific tee thoughts
    approach/
    putt/
  phone/
    sharon/           ← All Sharon texts/calls, indexed by trigger
    dave/             ← Dave's texts
    hr/               ← Corporate noise
    personal/         ← Spouse/friend texts
  objectives/
    corporate.js      ← Sharon's assignments
    personal.js       ← Self-generated goals
    secret.js         ← Discovered through play
  multiplayer/
    dialogue-variants.js  ← All MP dialogue with 5-tier variants
    clubhouse.js          ← Clubhouse-specific interactions
    encounters.js         ← Encounter dialogue by type
```

### How to Write a Dialogue Node

Every dialogue node follows this template:

```javascript
{
  id: 'unique_id',
  speaker: 'dave' | 'narrator' | 'sharon' | 'thought' | 'phone' | 'you',
  
  // Text can be static or dynamic (reading game state)
  text: (state) => {
    // Reference flags, stats, scorecard, impression
    if (state.traits.swagger > 70) return "Dave seems impressed.";
    return "Dave seems indifferent.";
  },
  
  // What the player sees as response options
  responses: [
    {
      text: "The thing you MEANT to say",
      label: 'SHORT_LABEL',
      
      // Which stat filters how this line lands
      statKey: 'swagger',
      
      // The 5 tiers of how it's RECEIVED
      receivedVariants: {
        1: "You stammer and trail off. Dave looks away.",
        2: "It comes out a little forced. Dave nods politely.",
        3: "A normal, reasonable response. Dave acknowledges it.",
        4: "Delivered with confidence. Dave leans in, interested.",
        5: "Perfectly timed, perfectly weighted. Dave's entire posture changes.",
      },
      
      // Stat and story effects
      traitEffects: { swagger: 3, focus: -1 },
      partnerEffect: { impression: 5 },
      setFlags: { mentioned_anderson: true },
      shotModifier: -0.2, // slight bonus on next shot
      
      // Where the dialogue goes next
      next: 'dave_responds',
    },
  ],
}
```

### How to Write a Walking Moment

Walking moments are micro-narratives that happen between shots. They're short (1-3 paragraphs) and always end with a small choice or observation.

```javascript
{
  id: 'walk_h3_corporate',
  trigger: { hole: 3, afterShot: 'tee', conditions: { flagNotSet: 'ignored_sharon' } },
  
  text: (state) => {
    return `Your phone buzzes in your pocket. You feel it against your thigh, ` +
           `insistent. The fairway stretches ahead. Dave is twenty yards to your right, ` +
           `walking to his ball. He hasn't noticed.`;
  },
  
  choices: [
    {
      text: "Check it. Quickly.",
      label: 'CHECK PHONE',
      traitEffects: { focus: -3 },
      setFlags: { checked_phone_h3: true },
      unlocks: 'phone_sharon_h3', // triggers the phone content
    },
    {
      text: "Pocket stays closed. Eyes on the fairway.",
      label: 'IGNORE',
      traitEffects: { zen: 3, focus: 2 },
      setFlags: { ignored_sharon_h3: true },
      narrative: "The buzzing stops. Whatever it was, it can wait. The ocean doesn't check its email.",
    },
  ],
}
```

### How to Write a Phone Event

Phone events are triggered by walking moment choices or between-hole triggers.

```javascript
{
  id: 'phone_sharon_h3',
  type: 'text',
  from: 'Sharon Whitfield (VP)',
  preview: 'Quick question about the Anderson deck...',
  
  fullText: `Hey — did Dave mention anything about the Anderson renewal 
             when you were chatting? Just curious. Also, make sure you're 
             hitting it well out there. Tom might stop by the turn. 😊`,
  
  // Player can respond via phone
  responses: [
    {
      text: "Dave hasn't said anything. I'll keep my ears open.",
      label: 'COOPERATIVE',
      traitEffects: { focus: -2 },
      partnerEffect: { /* no direct effect, but sets a flag */ },
      setFlags: { cooperating_with_sharon: true },
    },
    {
      text: "Haven't had a chance to talk shop. Just playing golf.",
      label: 'DEFLECT',
      traitEffects: { zen: 2 },
      setFlags: { deflected_sharon: true },
    },
    {
      text: "(Don't reply)",
      label: 'LEAVE ON READ',
      traitEffects: { swagger: 2, zen: 3 },
      setFlags: { left_sharon_on_read: true },
      // Sharon will reference this later
    },
  ],
}
```

### How Main Story Connects to Moment-Level Play

The main story (Arc) doesn't play out in a separate cutscene. It's embedded in everything:

```
ARC BEAT: "Sharon wants intel on Dave"
  ↓ delivered via...
PHONE EVENT: Sharon texts you on Hole 3
  ↓ which colors...
WALKING MOMENT: You're thinking about what she asked as you walk to your ball
  ↓ which affects...
SWING THOUGHT: "Your boss's face flashes in your mind" appears as a choice
  ↓ which determines...
SHOT RESULT: The distraction costs you (or the anger helps you)
  ↓ which triggers...
DAVE REACTION: "You okay? You seem distracted." (dialogue tree)
  ↓ which opens...
DIALOGUE CHOICE: Tell Dave about Sharon's text? Lie? Deflect?
  ↓ which sets...
FLAG: shared_sharon_text = true
  ↓ which affects...
LATER ARC BEAT: Dave confronts Sharon at the turn (or doesn't)
```

Every moment is load-bearing. There's no filler. Even the sea otter observation feeds your zen stat, which determines if you choke on the next putt, which determines if Dave thinks you can handle pressure, which determines if he backs you for the Anderson Account.

---

## 11. THE WINDOWS 95 AESTHETIC

### Visual Language
- **Color palette:** Beige (#c0c0c0), teal (#008080), navy (#000080), white, black
- **Fonts:** System fonts, monospace, bitmap-style
- **UI elements:** Raised/sunken 3D bevels, title bars with minimize/maximize/close buttons, scrollbars, progress bars
- **Dialogue boxes:** Windows message boxes with OK/Cancel
- **Scorecard:** Spreadsheet-style grid (Excel 95)
- **Phone UI:** Nokia-style pixel display
- **Character sheet:** Control Panel applet
- **Menus:** Start menu-style dropdowns

### Sound Design
- UI clicks: Windows 95 system sounds
- Ambient: Lo-fi ocean, wind, birds (compressed, 8-bit flavored)
- Music: Smooth jazz elevator music, MIDI-quality
- Phone: Nokia ringtone, SMS buzz

---

## 12. GAME FLOW — COMPLETE LOOP

```
LAUNCH → ALWAYS ONLINE → CLUBHOUSE LOBBY
  ↓
CLUBHOUSE: See other players, check board, customize, accept objectives
  ↓
TEE IT UP → Matched with playing partner (Dave in story mode, or real player)
  ↓
FOR EACH HOLE (1-9):
  ├─ HOLE INTRO (course description, thematic setup)
  ├─ TEE SHOT
  │   ├─ Setup narration
  │   ├─ Swing thought choices (stat-filtered outcome)
  │   └─ Result + Dave/NPC reaction
  ├─ WALKING MOMENT (micro-narrative, phone check, thought)
  ├─ APPROACH SHOT (same cycle)
  ├─ WALKING MOMENT
  ├─ PUTT (same cycle)
  ├─ HOLE SUMMARY (score, Dave reaction, stat changes)
  ├─ BETWEEN HOLES
  │   ├─ Dialogue tree with Dave (main story advances)
  │   ├─ Possible multiplayer encounter
  │   ├─ Phone event
  │   └─ Objective check
  └─ LOOP
  ↓
ROUND SUMMARY → Full narrative wrap-up, arc resolution, stats review
  ↓
CLUBHOUSE → 19th hole bar, share scorecard, meet other players
  ↓
PLAY AGAIN (new story variations, different choices, different outcomes)
```

---

## 13. REPLAYABILITY

The game is designed for MULTIPLE playthroughs:
- Different dialogue choices → different story branches → different endings
- Different stat builds → different social outcomes → different NPC relationships
- Different golf performance → different pressure situations → different narrative
- Multiplayer encounters → always unique
- Secret objectives → discovered through exploration
- Multiple story arcs planned (Season 1: The Anderson Account, Season 2: The Merger, etc.)
- Different playing partners (Dave is Season 1, future seasons introduce new characters)

---

## 14. WHAT TO BUILD NEXT (PRIORITY ORDER)

1. **Rebrand UI** to Corporate Golf / Windows 95 aesthetic
2. **Implement stat-filtered NPC dialogue** (Dave sees the tier-version, not your intended text)
3. **Add walking moments** between every shot
4. **Add phone mechanic** (buzzes, check/ignore, Sharon texts)
5. **Write Act 1** (Holes 1-3) of the Anderson Account story
6. **Add objectives system** (Sharon's assignments)
7. **Tune golf difficulty** to match the birdie/eagle targets
8. **Write Acts 2-3** (Holes 4-9)
9. **Expand multiplayer** interactions (clubhouse board, scorecard exchange, etc.)
10. **Voice lines** via ElevenLabs for key moments

---

*This document is the source of truth for Corporate Golf. All implementation should reference it.*
