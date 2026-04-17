// ─── Corporate Golf — Story Arc: "The Fujo Round" ───
//
// This file defines the main narrative arc that threads through all 9 holes.
// The arc is delivered through phone events, walking moments, and dialogue.
// Nothing here is exposition — it's all embedded in the gameplay.

// ─── Characters ───
const CHARACTERS = {
  player: {
    role: 'Mid-level analyst at Voss-Kellner (VK), a mid-tier American consulting firm',
    goal: 'Survive the outing; you were told this trip was a reward — it is not. You are here to perform.',
    secret: 'You still half-believe merit is real until days like this.',
  },
  martin: {
    name: 'Martin Voss',
    role: 'Co-founder of VK',
    goal: 'Navigate Sato, close or kill a path forward for VK, and not look desperate doing it',
    secret: 'He is weighing a sale of VK to Takeda-Mori. This round is his audition too.',
    personality: 'Dry. Unreadable. Says "interesting" when he means twelve different things. Plays golf like a spreadsheet until the mask slips.',
  },
  claire: {
    name: 'Claire Okada',
    role: 'Martin\'s executive assistant',
    goal: 'Keep the principals aligned while protecting her own trajectory',
    secret: 'Takeda-Mori offered her a role directly. She has not told Martin.',
    personality: 'Half-Japanese, Chicago-raised, bilingual. Texts in lowercase with minimal punctuation. Sharp, ambiguous — help and evaluation wear the same face.',
  },
  sato: {
    name: 'Kenji Sato',
    role: 'VP of International Partnerships, Takeda-Mori Group',
    goal: 'Confirm what he already suspects about VK — and about you',
    secret: 'He has largely decided. This round is a formality. He is watching how you handle pressure.',
    personality: 'Quiet. Precise. Excellent golfer. English is perfect; he still pauses before he speaks, as if translating ruthlessness into politeness.',
  },
};

// ─── Arc Beats — What happens when ───
const ARC_STRUCTURE = {
  // ACT 1: ESTABLISHMENT (Holes 1-3)
  act1: {
    theme: 'Establishment',
    tension: 'Low → rising',
    beats: [
      {
        hole: 1,
        event: 'intro_martin_sato',
        description: 'You are not on vacation. Martin is cordial in the way a door is cordial — it opens, it closes. Sato bows slightly; the bow is grammar, not warmth. The mountain is too beautiful. That is part of the test.',
        deliveredVia: 'dialogue',
        flags_set: [],
        flags_read: [],
      },
      {
        hole: 2,
        event: 'martin_tests',
        description: 'Martin mentions details he should not casually know. You realize the firm has been reading you like a footnote long before this tee time.',
        deliveredVia: 'dialogue',
        flags_set: ['martin_knows_your_file'],
        flags_read: [],
      },
      {
        hole: 3,
        event: 'claire_first_text',
        description: 'Your phone buzzes on the walk. Claire\'s first message is lowercase and light — and still somehow like a hand on your collarbone. She asks about Martin. She mentions Sato asked about your background.',
        deliveredVia: 'phone',
        flags_set: ['claire_contacted', 'cooperating_with_claire', 'deflected_claire', 'left_claire_on_read'],
        flags_read: [],
      },
    ],
  },

  // ACT 2: ESCALATION (Holes 4-6)
  act2: {
    theme: 'Escalation',
    tension: 'Medium → high',
    beats: [
      {
        hole: 4,
        event: 'acquisition_reveal',
        description: 'The par 5 gives the round room to breathe — and room for Martin to probe. The Takeda-Mori thread surfaces obliquely, then less obliquely. Your answer is a kind of contract.',
        deliveredVia: 'dialogue',
        flags_set: ['told_martin_about_pressure', 'deflected_takeda_questions', 'postured_for_sato'],
        flags_read: ['cooperating_with_claire'],
      },
      {
        hole: 5,
        event: 'stakes_sato',
        description: 'The gorge hole. Claire texts again — acquisition language, not merger language. Sato is not a spectator; he is a lens. You feel the walk become a performance review with seagulls.',
        deliveredVia: 'phone + walking_moment',
        flags_set: ['aware_sato_watching', 'ignored_sato_warning'],
        flags_read: ['cooperating_with_claire', 'deflected_claire'],
      },
      {
        hole: 6,
        event: 'martin_vulnerable',
        description: 'Martin opens up if you have earned enough room — a question about a life without VK, asked like he is asking about weather. Sato watches you listen.',
        deliveredVia: 'dialogue',
        flags_set: ['martin_shared_struggle', 'empathized_with_martin', 'used_martin_info'],
        flags_read: ['told_martin_about_pressure', 'partner_impression'],
      },
    ],
  },

  // ACT 3: RESOLUTION (Holes 7-9)
  act3: {
    theme: 'Resolution',
    tension: 'High → resolution',
    beats: [
      {
        hole: 7,
        event: 'claire_call',
        description: 'Claire calls on the short par 3. Her voice is steady; the content is not. She lays her offer on the table. She asks where you stand — VK, yourself, or some third thing you will pretend is integrity.',
        deliveredVia: 'phone_call',
        flags_set: ['accepted_claire_deal', 'rejected_claire_deal', 'stalled_claire', 'advocated_for_martin'],
        flags_read: ['cooperating_with_claire', 'warned_martin_about_claire', 'martin_shared_struggle'],
      },
      {
        hole: 8,
        event: 'moment_of_truth',
        description: 'The signature hole. The ridge. Martin is beside you in a way that feels heavier than proximity. Whatever you have been carrying — Claire\'s secrets, Sato\'s silence, your own ambition — it wants to show up in the swing.',
        deliveredVia: 'dialogue',
        flags_set: ['chose_martin', 'chose_career', 'chose_honesty', 'chose_self'],
        flags_read: ['ALL — this is the convergence point'],
      },
      {
        hole: 9,
        event: 'landing',
        description: 'The last walk. Sato\'s assessment has already been written somewhere you cannot see. Martin\'s face returns to neutral — or maybe this is what neutral always was. The round ends. The story does not.',
        deliveredVia: 'dialogue + narration',
        flags_set: [],
        flags_read: ['ALL'],
      },
    ],
  },
};

// ─── Endings ───
const ENDINGS = {
  ally: {
    id: 'ally',
    name: 'THE PARTNERSHIP',
    conditions: 'impression >= 70 AND (warned_martin_about_claire OR advocated_for_martin OR chose_martin) AND NOT used_martin_info',
    description: 'You and Martin walk off the ninth green with the strange quiet of two people who have survived the same weather. Sato\'s nod is small — not approval, but acknowledgment. On Monday the emails will start again. But you did something rarer than a clean ledger: you chose a side without pretending you had no stake. VK may still change shape. You will not pretend you did not see it coming.',
    tone: 'Warm, wary, earned',
  },
  rival: {
    id: 'rival',
    name: 'THE NEGOTIATION',
    conditions: 'impression 40-69 AND (accepted_claire_deal OR chose_career) AND NOT empathized_with_martin',
    description: 'You shake hands at the turn — firm, eyes up, the way people do when they respect the knife. Claire\'s thread is still in your pocket. Sato looks past you at the horizon, calculating nothing you can read. You did not lose. You positioned. The next conversation will be in conference rooms with worse lighting and better coffee. You will be ready for that language.',
    tone: 'Cool, competitive, precise',
  },
  betrayal: {
    id: 'betrayal',
    name: 'THE ACQUISITION',
    conditions: 'cooperating_with_claire AND used_martin_info AND NOT warned_martin_about_claire',
    description: 'Martin does not know yet — not fully. But Claire got what she needed from your mouth, and Sato got what he needed from your silence. The acquisition was always going to be a sentence spoken in polite tense. You helped the grammar. Your phone lights up as you reach the gravel lot. A lowercase message: "nice work." The mountain is beautiful. You feel nothing that does not feel like a receipt.',
    tone: 'Cold, efficient, hollow',
  },
  transcendent: {
    id: 'transcendent',
    name: 'THE ROUND',
    conditions: 'zen >= 80 AND chose_self AND impression >= 50',
    description: 'Somewhere after the seventh hole, the firm stopped being the sky. You still hit bad shots. You still cared — but not the way they wanted you to care. Sato watched you swing like a person, not a slide deck. Martin said "interesting" once and meant none of the twelve things. For a few holes, you were only here: salt, cypress, the absurd task of putting a ball in a cup while your life tried to call you back to voicemail.',
    tone: 'Peaceful, uncanny, free',
  },
  collapse: {
    id: 'collapse',
    name: 'THE SPIRAL',
    conditions: 'impression < 30 AND (focus < 30 OR zen < 30)',
    description: 'The round thinned out somewhere around the fifth hole and never thickened again. Martin stopped asking questions that sounded like interest. Sato remained polite — which is its own verdict. Your phone shows three texts from Claire; you cannot bring yourself to open them. The lot empties. The mountain keeps doing what mountains do. You sit in the car with your hands on the wheel, not driving, listening to a silence that sounds like feedback.',
    tone: 'Bleak, honest, rock bottom (but there\'s a restart button)',
  },
};

// ─── Phone Events (ordered by trigger) ───
const PHONE_EVENTS = [
  {
    id: 'phone_claire_h3',
    hole: 3,
    trigger: 'walking_after_tee',
    from: 'Claire Okada',
    type: 'text',
    preview: 'hey',
    fullText: `hey. how's martin. he seems tense. sato asked about your background btw — nothing weird, just... precise questions. you ok`,
    subtext: 'Lowercase calm is a kind of pressure. She is not asking if you are okay. She is asking what you will do with the answer.',
    responses: [
      {
        text: 'Martin\'s fine. Focused. We\'re managing the round.',
        label: 'PLAY ALONG',
        statKey: 'swagger',
        traitEffects: { focus: -2 },
        setFlags: { cooperating_with_claire: true },
        next_phone: null,
      },
      {
        text: 'Trying to stay in the golf. Will circle back later.',
        label: 'DEFLECT',
        statKey: 'zen',
        traitEffects: { zen: 2 },
        setFlags: { deflected_claire: true },
        next_phone: null,
      },
      {
        text: '(Don\'t reply)',
        label: 'LEAVE ON READ',
        traitEffects: { swagger: 2, zen: 3 },
        setFlags: { left_claire_on_read: true },
        next_phone: null,
      },
    ],
  },
  {
    id: 'phone_claire_h5',
    hole: 5,
    trigger: 'walking_after_tee',
    from: 'Claire Okada',
    type: 'text',
    preview: 'heads up',
    implicitFlags: { aware_sato_watching: true },
    fullText: (state) => {
      if (hasFlag(state, 'left_claire_on_read')) {
        return `i know you didn't text back earlier. not judging. but you should know: sato's been watching this round like a diligence checklist. martin still thinks it's a "relationship visit." takeda-mori isn't flirting. they're pricing. acquisition, not merger. be careful what you say about vk out here.`;
      }
      if (hasFlag(state, 'cooperating_with_claire')) {
        return `sato's locked in on you today — in a good way, mostly. martin doesn't know this part yet: takeda-mori is leaning acquisition. not merger. if that lands, everything shifts. watch your nouns.`;
      }
      return `quick one. sato's impressed enough to be dangerous. also: takeda-mori is circling vk as an acquisition target — not a partnership fairy tale. martin's still performing calm. don't let his calm become your script.`;
    },
    subtext: 'The stakes just went vertical. Her tone shifts with your earlier choice — cooperation reads as intimacy; silence reads as guilt.',
  },
  {
    id: 'phone_claire_h7_call',
    hole: 7,
    trigger: 'before_tee',
    from: 'Claire Okada',
    type: 'call',
    preview: 'INCOMING CALL — Claire Okada',
    dialogue: [
      {
        speaker: 'claire',
        text: '"hey — sorry, i know. tee box. i need a straight answer. sato offered me a role at takeda-mori. if this acquisition happens, i\'m gone. martin doesn\'t know. are you with vk — like, actually — or are you just trying to survive the day?"',
      },
    ],
    responses: [
      {
        text: '"I\'m with VK. That\'s my answer."',
        label: 'COMMIT TO VK',
        statKey: 'swagger',
        traitEffects: { swagger: 3, zen: -4, focus: -2 },
        setFlags: { committed_to_vk_on_call: true },
        claireReply: '"...okay. okay. that\'s — thank you. finish the hole. we\'ll talk when you\'re not holding a wedge."',
      },
      {
        text: '"I can\'t do this on the tee. Monday. Please."',
        label: 'STALL',
        statKey: 'zen',
        traitEffects: { zen: 2 },
        setFlags: { stalled_claire: true, accepted_claire_deal: true },
        claireReply: '"yeah. fine. monday." she hangs up mid-breath — not angry. worse: disappointed in a controlled way.',
      },
      {
        text: '"Martin deserves to know what\'s happening before you disappear."',
        label: 'ADVOCATE FOR MARTIN',
        statKey: 'knowledge',
        traitEffects: { knowledge: 2, swagger: -3 },
        setFlags: { advocated_for_martin: true },
        claireReply: '"interesting." a pause. "you\'re not wrong. just... expensive." click.',
      },
      {
        text: '(Let it go to voicemail)',
        label: 'DECLINE CALL',
        traitEffects: { zen: 5, focus: 3 },
        setFlags: { rejected_claire_deal: true },
        narrative: 'The ringing stops. Wind off the water fills the silence like an excuse. The shortest hole on the course is in front of you. For a moment, the only stakeholder is the ball.',
      },
    ],
  },
];

// ─── Walking Moments (story-driven micro-narratives) ───
const STORY_WALKING_MOMENTS = [
  {
    id: 'walk_h2_martin_knows',
    hole: 2,
    afterShot: 'tee',
    text: (state) => {
      return `You walk with Martin while Sato lingers a few paces behind — not eavesdropping, just present in the way a verdict is present. Martin does not look at you when he speaks. "Three years," he says. "Chicago office before the transfer. Analytics." He says your old manager's name correctly. The ridgeline is too perfect. It feels impolite.`;
    },
    choices: [
      {
        text: '"You did homework. Or someone briefed you."',
        label: 'CALL IT OUT',
        statKey: 'swagger',
        traitEffects: { swagger: 3 },
        partnerEffect: { impression: 4 },
        setFlags: { called_out_martin_research: true },
        narrative: 'Martin\'s mouth twitches — not quite a smile. "Interesting." The word lands like a weight class. Sato glances up, then away, as if he saw something he was not supposed to name.',
      },
      {
        text: '"That\'s right. Good memory."',
        label: 'PLAY IT NORMAL',
        traitEffects: { zen: 2 },
        narrative: 'You let the moment pass through you like weather. Martin nods once. Sato\'s silence feels less like emptiness and more like storage.',
      },
    ],
  },
  {
    id: 'walk_h4_ambition',
    hole: 4,
    afterShot: 'tee',
    conditions: (state) => state.scorecard[3] !== null,
    text: (state) => {
      let base = `The fourth is a par 5. The fairway pulls your eye toward a horizon that does not care about org charts. The beauty of Fujo — the brochure called it that, absurdly — makes your ambition feel both small and exposed. `;
      if (hasFlag(state, 'cooperating_with_claire')) {
        base += `Claire's earlier text flickers behind your eyes: precise questions. You wonder what you have already given away without meaning to.`;
      } else {
        base += `You notice you are calculating again — not yardage. Survival in two different languages at once.`;
      }
      return base;
    },
    choices: [
      {
        text: 'Let your mind run the career tape: titles, exits, timelines.',
        label: 'CAREER REFLECTION',
        traitEffects: { focus: -2, knowledge: 3 },
        setFlags: { reflected_on_career: true, chose_career: true },
        narrative: 'You imagine decks. You imagine signing authority. You imagine the quiet thrill of being chosen. Then you imagine the cost of being easy to read. The ball is far ahead. So is everything else.',
      },
      {
        text: 'Empty your mind until there is only footfalls and wind.',
        label: 'EMPTY MIND',
        traitEffects: { zen: 4 },
        setFlags: { chose_self: true },
        narrative: 'For forty seconds you are not an analyst. You are a mammal walking on grass near a mountain that does not know your firm\'s acronym. Then your phone weighs in your pocket again — a small gravity.',
      },
    ],
  },
  {
    id: 'walk_h6_martin_personal',
    hole: 6,
    afterShot: 'approach',
    conditions: (state) => state.partner.impression >= 55,
    text: (state) => {
      return `Martin waits while Sato studies a yardage book with ceremonial patience. Martin's voice drops, not soft — stripped. "Do you ever think about what you'd do," he asks, "if VK didn't exist?" He says it like he is asking about lunch. The question is not theoretical. It is a trapdoor with polite hinges.`;
    },
    choices: [
      {
        text: '"Often. More than I admit in meetings."',
        label: 'VULNERABLE',
        statKey: 'swagger',
        traitEffects: { zen: 4, swagger: -2 },
        partnerEffect: { impression: 8 },
        setFlags: { shared_doubt_with_martin: true, empathized_with_martin: true },
        narrative: 'Martin exhales through his nose — acknowledgement, not relief. Sato looks up once, then returns to the book, as if granting privacy by not pretending he cannot hear. The green waits. So does the rest of your life.',
      },
      {
        text: '"I try not to outsource identity to the letterhead."',
        label: 'DEFLECT WITH HUMOR',
        statKey: 'humor',
        traitEffects: { humor: 3, zen: 1 },
        partnerEffect: { impression: 2 },
        setFlags: { used_martin_info: true },
        narrative: 'Martin makes a sound that could be a laugh in a country with a different climate. "Interesting." The word means: noted — and you realize, too late, that you answered a real question with a quip. That is also data.',
      },
      {
        text: '"Right now VK exists. So I\'m going to read this putt."',
        label: 'PRESENT MOMENT',
        statKey: 'zen',
        traitEffects: { zen: 5 },
        partnerEffect: { impression: 5 },
        setFlags: { grounded_martin: true },
        narrative: 'Martin holds your gaze a half-beat longer than necessary. Something like gratitude — or recognition — passes without a handshake. The wind does the rest.',
      },
    ],
  },
];

// ─── Corporate Swing Thought Intrusions ───
// These replace generic swing thoughts when the story requires it
const CORPORATE_SWING_THOUGHTS = {
  hole_5_tee: {
    conditions: (state) => hasFlag(state, 'aware_sato_watching'),
    setup: `185 yards over the gorge. You take the club back and—`,
    extraChoice: {
      text: `185 yards over the gorge. Sato is evaluating this swing like a balance sheet.`,
      label: 'CAREER PRESSURE',
      baseQualityIndex: 3,
      traitEffects: { focus: -4, swagger: -3, knowledge: 2 },
      resultNarrative: {
        good: `The swing arrives clean — not brave, just accountable. The ball holds its line against the wind, finds the green, and remembers to look humble. If Sato is watching, he sees a person who can execute under observation. That is its own currency.`,
        bad: `Your body flinches halfway through — politeness as physics. The ball comes up short, wobbles toward trouble, stops like it got scolded. Sato does not have to say anything. The silence does the memo.`,
      },
    },
  },
  hole_8_tee: {
    conditions: (state) => hasFlag(state, 'accepted_claire_deal') || hasFlag(state, 'martin_shared_struggle'),
    setup: `The ridge. The drop-off. You take the club back—`,
    extraChoice: {
      text: (state) => {
        if (hasFlag(state, 'accepted_claire_deal') && hasFlag(state, 'martin_shared_struggle')) {
          return `The ridge. The drop-off. Martin is right there. You have both — Claire's offer in your head and Martin's doubt in your ear. The swing is not a swing; it is a disclosure.`;
        }
        if (hasFlag(state, 'accepted_claire_deal')) {
          return `The ridge. The drop-off. You said yes to something on the seventh tee without a slide deck to hide behind. Claire's voice is still in your skull, lowercase and binding.`;
        }
        return `The ridge. The drop-off. Martin is right there. Claire's secret is in your pocket like a stone — heavy, smooth, impossible to explain without breaking something.`;
      },
      label: 'THE WEIGHT',
      baseQualityIndex: 3,
      traitEffects: { focus: -3, zen: -3 },
      resultNarrative: {
        good: `You swing as if honesty can be physical. The ball flies committed, clears the troubled air, finds the fairway with the strange dignity of a well-run meeting that actually ends on time. Whatever happens Monday, you hit this shot.`,
        bad: `The weight arrives at the wrong moment — late, like bad data. You steer. The ball leaks, searches for help, finds none. The gorge does what gorges do: it reminds you what thin margins look like from above.`,
      },
    },
  },
};
