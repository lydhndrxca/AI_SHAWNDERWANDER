# CORPORATE GOLF — Narrative Writing Guide

## How to Write the Story at Every Scale

---

## THE PROBLEM

This game has narrative happening at four simultaneous scales:
1. The **Arc** (career, relationships, identity — the whole round)
2. The **Hole** (each hole has a theme and a mini-story)
3. The **Moment** (each shot, each walk, each phone check)
4. The **Thought** (the swing thought — one split second)

You need to write ALL of these, and they need to feel like one seamless experience. This guide explains how.

---

## RULE 1: THE ARC NEVER SPEAKS DIRECTLY

The main story (The Anderson Account) is never delivered as exposition. There is no cutscene where Sharon explains the situation. Instead:

- The arc is delivered through **fragments**: a text from Sharon, a comment from Dave, a phone notification, an overheard conversation.
- The player **assembles** the arc from these fragments. They're a detective in their own story.
- By Hole 5, the player should understand the full situation — not because anyone told them, but because they pieced it together.

**Template for Arc Delivery:**

```
Hole 1-2: SEEDS    — Drop 2-3 details that seem like small talk but aren't
Hole 3-4: WATER    — A phone event or Dave comment that recontextualizes the seeds
Hole 5:   BLOOM    — The player realizes what's actually happening
Hole 6-7: STAKES   — Now every choice carries the weight of understanding
Hole 8-9: HARVEST  — Consequences of everything the player has done
```

**Example seed (Hole 1, Dave dialogue):**
> "Sharon roped you into this too, huh? She's been putting these outings together every quarter. I think she thinks golf is where deals happen." He laughs, but there's something behind it.

The player doesn't know yet that Sharon is evaluating both of them. But when they find out on Hole 5, this line recontextualizes everything Dave has said.

---

## RULE 2: EVERY HOLE HAS A QUESTION

Each hole is built around a single dramatic question that the player answers through their choices.

| Hole | Question |
|------|----------|
| 1 | Who are you? (Establish personality through first interactions) |
| 2 | Can you be trusted? (Dave tests you with small talk that isn't small) |
| 3 | Who are you loyal to? (Sharon's first text — do you engage or ignore?) |
| 4 | How ambitious are you? (The par 5 as metaphor — do you go for it?) |
| 5 | Can you handle pressure? (The chasm hole — literally and metaphorically) |
| 6 | What do you value? (Dave reveals something personal, you choose how to respond) |
| 7 | Can you keep it simple? (Short hole, big phone call — don't overcomplicate) |
| 8 | What kind of person are you? (The signature hole — everything on the line) |
| 9 | What did this round mean? (Final hole — wrap everything, every flag pays off) |

When writing content for a specific hole, always ask: **"Does this serve the hole's question?"** If not, move it to a different hole or cut it.

---

## RULE 3: WALKING MOMENTS ARE THE CONNECTIVE TISSUE

Walking moments are the most important content to get right. They're where the player LIVES most of the time. A good walking moment:

1. Grounds you in the physical space (the fairway, the ocean, the wind)
2. Introduces one small story element (a thought, a phone buzz, a Dave comment)
3. Gives you a small choice that feels insignificant but ISN'T
4. Takes 15-30 seconds to read

**Template:**

```javascript
{
  id: 'walk_h{HOLE}_{CONTEXT}',
  trigger: {
    hole: NUMBER,
    afterShot: 'tee' | 'approach',
    conditions: { /* required flags, stat thresholds, etc */ },
  },

  text: (state) => {
    // 1-2 sentences of physical grounding
    // 1-2 sentences introducing the story element
    // Optional: reference to a previous choice via flags
    return `GROUNDING. STORY ELEMENT. MAYBE A CALLBACK.`;
  },

  choices: [
    {
      text: "The active choice (engage)",
      label: 'VERB',
      traitEffects: { /* small nudge */ },
      setFlags: { /* breadcrumb for later */ },
      // Optional: unlocks phone event, dialogue, or objective
    },
    {
      text: "The passive choice (let it go)",
      label: 'VERB',
      traitEffects: { /* different small nudge */ },
      // Choosing NOT to engage is always valid and has its own consequences
    },
  ],
}
```

**Example:**

```javascript
{
  id: 'walk_h3_osprey',
  trigger: { hole: 3, afterShot: 'tee' },

  text: (state) => {
    let base = `You walk toward your ball. The fairway slopes gently toward the ocean. `;
    base += `An osprey circles overhead, hunting. `;
    if (hasFlag(state, 'checked_phone_h2')) {
      base += `Sharon's text from the last hole is still in your head. "Keep your ears open." What does she think this is?`;
    } else {
      base += `The morning is quiet. Just you, Dave, and the Pacific. Dave is humming something.`;
    }
    return base;
  },

  choices: [
    {
      text: "Watch the osprey. Take a breath.",
      label: 'OBSERVE',
      traitEffects: { zen: 3 },
      narrative: "The osprey dives. Misses. Circles back up. Tries again. There's something in that.",
    },
    {
      text: "Speed up. You want to get to your ball and focus.",
      label: 'HUSTLE',
      traitEffects: { focus: 2, zen: -1 },
      narrative: "You reach your ball and pull a club immediately. All business.",
    },
  ],
}
```

---

## RULE 4: SWING THOUGHTS SERVE TWO MASTERS

Every swing thought serves the golf game AND the story. The four choice archetypes:

### A. The Golf Thought
Pure technique. Best shot outcome. Builds focus/knowledge.
> "Maintain spine angle, square the clubface, accelerate through."
- **Golf:** Best base quality
- **Story:** You're in control, locked in. But are you having fun?

### B. The Distraction
Terrible for the shot. Builds personality stats. Feeds the story.
> "That osprey is still circling. You wonder what it would be like to just... fly."
- **Golf:** Bad base quality
- **Story:** You're human. Maybe too human for corporate golf.

### C. The Corporate Intrusion
Medium shot quality. Directly advances the arc.
> "Sharon said Tom Anderson might be watching. Every shot counts. Every. Single. One."
- **Golf:** Pressure can help or hurt (depends on focus/zen)
- **Story:** The arc is in your head. It's affecting your game.

### D. The Character Moment
Variable shot quality. Defines who you are.
> "Dave's been quiet since you told him about the Anderson thing. Maybe you shouldn't have."
- **Golf:** Emotional state affects the shot
- **Story:** This IS the story

Every hole's swing thought menu should include at least one from each category.

---

## RULE 5: DIALOGUE TREES ARE CONVERSATIONS, NOT MENUS

Dialogue with Dave (and future NPCs) should feel like real conversations, not branching surveys. Rules:

### Start with Dave speaking
Dave always initiates. He says something. Your response options react to what HE said.

### Maximum 3-4 options per node
More than 4 and the player feels paralyzed. Less than 2 and there's no choice.

### Options should be EMOTIONALLY distinct, not just factually distinct
Bad: "Yes" / "No" / "Maybe"
Good: "Honest deflection" / "Confident assertion" / "Vulnerable admission" / "Humorous dodge"

### Every option COSTS something
There is no free lunch. The "nice" answer might lower focus. The "honest" answer might lower impression. The "funny" answer might lower knowledge perception. Always trade.

### The 5-tier variants are the RECEIVED version
When writing, think of it as:
1. Write the player's INTENT (what they chose)
2. Write the 5 tiers of how it LANDED (what Dave experiences)
3. Write Dave's response to each tier (or have Dave respond to the tier naturally)

**Example of full node with received variants:**

```javascript
{
  id: 'dave_h5_asks_about_anderson',
  speaker: 'dave',
  text: `"Hey, real talk for a second. You hear anything about the Anderson Account? Sharon's been weird about it."`,

  responses: [
    {
      text: `"Yeah, I've heard some things. Sounds like there might be changes coming."`,
      label: 'HONEST',
      statKey: 'swagger',
      receivedVariants: {
        1: `You start to say something but your voice cracks. You clear your throat twice. Dave waits. And waits. "...changes," you finally manage. Dave looks concerned. For you, not about Anderson.`,
        2: `"Yeah, I, um, I've heard some... things? Like, changes? Maybe?" Dave nods slowly, clearly processing that you know nothing useful.`,
        3: `"Yeah, I've heard some things. Sounds like there might be changes coming." Dave nods. "Yeah, I figured."`,
        4: `"I've heard rumblings. Nothing concrete, but the wind's shifting." Dave leans closer. "Go on."`,
        5: `"Between you and me?" You lower your voice. "Anderson's in play. And not everyone at Meridian is going to come out of this the same." Dave's eyes widen. He trusts you completely.`,
      },
      traitEffects: { knowledge: -2 },
      partnerEffect: { impression: 3 },
      setFlags: { told_dave_about_anderson: true },
      next: 'dave_processes',
    },
    {
      text: `"News to me. I just work here." [Deflect]`,
      label: 'DEFLECT',
      statKey: 'humor',
      receivedVariants: {
        1: `"I just work here." It comes out bitter and defensive. Dave steps back slightly.`,
        2: `"News to me!" Too cheerful. Clearly hiding something. Dave squints at you.`,
        3: `"News to me. I just work here." Dave shrugs. "Fair enough."`,
        4: `"Me? I'm just the guy they let hit balls." A half-smile. Dave chuckles. "Right."`,
        5: `"My friend, I am but a humble employee." A perfect deadpan. Dave laughs. "Okay, okay. But seriously though—" He lets it go. For now.`,
      },
      traitEffects: { humor: 2, zen: 1 },
      setFlags: { deflected_anderson_question: true },
      next: 'dave_drops_it',
    },
    // ... more options ...
  ],
}
```

---

## RULE 6: FLAGS ARE THE MEMORY SYSTEM

Flags are how the game remembers. Every meaningful choice sets a flag. Flags are NAMED DESCRIPTIVELY:

```javascript
// Good flag names — you can read the story from the flag list
'admitted_nerves_h1'
'told_dave_about_anderson'
'cooperating_with_sharon'
'left_sharon_on_read'
'dave_shared_dad_story'
'bet_with_dave'
'chose_courage_on_8'

// Bad flag names — meaningless
'flag1'
'choice_a'
'h3_option_2'
```

**Flag Callback Patterns:**

```javascript
// Pattern 1: Dave references a previous choice
text: (state) => {
  if (hasFlag(state, 'admitted_nerves_h1')) {
    return `"You said your hands were shaking on the first tee. Mine still are." Dave shows you his hands. They're steady.`;
  }
  return `"Hell of a round so far." Dave glances at the ocean.`;
}

// Pattern 2: A choice from 3 holes ago unlocks a new option
responses: [
  {
    text: `"Sharon texted me about you."`,
    label: 'COME CLEAN',
    requires: { flag: 'cooperating_with_sharon' }, // only visible if this flag is set
    requiresNoFlag: 'already_warned_dave',
    traitEffects: { swagger: -3, zen: 5 },
    partnerEffect: { impression: 10 },
    setFlags: { warned_dave_about_sharon: true, already_warned_dave: true },
  },
]

// Pattern 3: The ending reads all the flags
text: (state) => {
  const flags = [
    hasFlag(state, 'bet_with_dave'),
    hasFlag(state, 'dave_shared_dad_story'),
    hasFlag(state, 'cooperating_with_sharon'),
    hasFlag(state, 'warned_dave_about_sharon'),
  ];
  // Build a unique ending from the combination
}
```

---

## RULE 7: THE STORY HAS MULTIPLE THREADS, NOT MULTIPLE STORIES

Don't think of the story as a branching tree with separate paths. Think of it as THREADS that weave together:

```
THREAD: Dave Relationship     ──────────────────────────────
THREAD: Sharon's Agenda       ─── ── ─ ──── ─── ──── ──────
THREAD: Anderson Account      ──── ───── ── ──── ──── ──────
THREAD: Your Inner Life       ── ── ── ── ── ── ── ── ── ──
THREAD: The Golf Round        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The Golf Round thread is the backbone — it never stops. The other threads weave in and out. Some threads can be missed entirely (you never cooperate with Sharon). Some are always present (your inner life). The ending is determined by which threads are active and how they resolved.

### Thread Tracking Template:

For each thread, maintain:
- **Status:** dormant → introduced → active → resolved
- **Key flags:** the 3-5 flags that determine this thread's outcome
- **Trigger points:** which holes/moments activate or advance this thread
- **Resolution conditions:** what determines the thread's ending

```
THREAD: Sharon's Agenda
  Status: dormant (Holes 1-2) → introduced (Hole 3, phone) → active (Holes 4-7) → resolved (Hole 8-9)
  Key flags: cooperating_with_sharon, deflected_sharon, left_sharon_on_read, warned_dave_about_sharon
  Triggers: Hole 3 phone event, Hole 5 walking moment, Hole 7 phone call
  Resolution: 
    - If cooperating + didn't warn Dave → Sharon uses your intel, Dave gets blindsided
    - If cooperating + warned Dave → Dave confronts Sharon, you're caught in the middle
    - If deflected all → Sharon finds another source, you're safe but uninvolved
    - If left on read → Sharon is annoyed, you lose corporate standing but gain Dave's trust
```

---

## RULE 8: OBJECTIVES ARE STORY IN DISGUISE

Objectives aren't to-do items. They're DRAMATIC TENSION given a checkbox.

**Bad objective:** "Score par or better on Hole 5"
**Good objective:** "Sharon says Tom Anderson might be watching Hole 5. Don't embarrass yourself."

The good version creates story pressure. The bad version is just a score gate.

**Template:**

```javascript
{
  id: 'obj_sharon_impress_tom',
  type: 'corporate', // corporate | personal | secret
  from: 'Sharon Whitfield',
  deliveredVia: 'text', // how the player receives it
  triggerHole: 3,

  // What the player sees
  title: 'MAKE AN IMPRESSION',
  description: 'Tom Anderson might swing by the turn. No worse than bogey on 4, 5, and 6.',

  // The actual conditions
  conditions: (state) => {
    return [4, 5, 6].every(h =>
      state.scorecard[h - 1] !== null &&
      state.scorecard[h - 1] <= COURSE_DATA.holes[h - 1].par + 1
    );
  },

  // Success
  onComplete: {
    narrative: `Your phone buzzes. Sharon: "Nice stretch. Tom noticed. 👍"`,
    traitEffects: { swagger: 5 },
    setFlags: { impressed_tom: true },
  },

  // Failure
  onFail: {
    narrative: `Sharon's text is just: "..."`,
    traitEffects: { swagger: -3 },
    setFlags: { disappointed_sharon: true },
  },
}
```

---

## QUICK REFERENCE — CONTENT CHECKLIST PER HOLE

For each hole, write:

- [ ] **Hole intro** (course description + thematic setup, 2-3 paragraphs)
- [ ] **Tee swing thoughts** (4 choices: golf, distraction, corporate, character)
- [ ] **Walking moment 1** (after tee shot, micro-narrative + choice)
- [ ] **Approach swing thoughts** (4 choices, or skip for par 3)
- [ ] **Walking moment 2** (after approach, micro-narrative + choice)
- [ ] **Putt swing thoughts** (4 choices)
- [ ] **Hole summary reactions** (Dave's response to score, 5 variants by mood)
- [ ] **Between-holes dialogue tree** (multi-turn, advances main arc)
- [ ] **Phone event** (0-2 per hole, triggered by walking moment or timing)
- [ ] **Objective check** (if any objectives are active for this hole)

Total per hole: ~20-30 authored nodes, ~80-120 lines of dialogue/narration.
Total for 9 holes: ~200-270 nodes, ~800-1000+ lines.

This is a novel's worth of content, delivered in fragments. Write it like a novelist. Edit it like a game designer.

---

*"The course doesn't care about your quarterly numbers. The ocean doesn't check its email. But you do. And that's the game."*
