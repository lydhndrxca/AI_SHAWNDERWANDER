// ─── Corporate Golf — Story Arc: "The Anderson Account" ───
//
// This file defines the main narrative arc that threads through all 9 holes.
// The arc is delivered through phone events, walking moments, and dialogue.
// Nothing here is exposition — it's all embedded in the gameplay.

// ─── Characters ───
const CHARACTERS = {
  player: {
    role: 'Mid-level associate at Meridian Partners',
    goal: 'Survive the golf outing, maybe get the Anderson Account lead',
    secret: 'You\'re not sure you even want it',
  },
  dave: {
    name: 'Dave Kowalski',
    role: 'Senior associate, 8 years at Meridian',
    goal: 'Also wants the Anderson lead, but it\'s complicated',
    secret: 'He\'s been passed over twice. This is his last shot before he starts looking elsewhere.',
    personality: 'Friendly, self-deprecating, competitive underneath. Genuinely decent.',
  },
  sharon: {
    name: 'Sharon Whitfield',
    role: 'VP of Client Services',
    goal: 'Place the right person on Anderson. She has her own agenda.',
    secret: 'She\'s leaving Meridian in 3 months. She needs Anderson locked down as her legacy.',
    personality: 'Sharp, strategic, uses corporate-speak as a weapon. Not evil — just playing a different game.',
  },
  tom: {
    name: 'Tom Anderson',
    role: 'CEO of Anderson Industrial, Meridian\'s biggest client',
    goal: 'Evaluate Meridian\'s bench. Might not renew.',
    secret: 'He\'s already talking to a competitor. This golf outing is partly a goodbye tour.',
    personality: 'Old money charm, plays dumb but misses nothing.',
  },
};

// ─── Arc Beats — What happens when ───
const ARC_STRUCTURE = {
  // ACT 1: ESTABLISHMENT (Holes 1-3)
  act1: {
    theme: 'First Impressions',
    tension: 'Low → rising',
    beats: [
      {
        hole: 1,
        event: 'intro_dave',
        description: 'Dave and the player meet. Light small talk. Dave mentions Sharon "putting these outings together." Seeds planted.',
        deliveredVia: 'dialogue',
        flags_set: [],
        flags_read: [],
      },
      {
        hole: 2,
        event: 'dave_tests',
        description: 'Dave asks what department you\'re in. Based on your answer, he reveals he knows more about you than expected. Sharon briefed him? Or he did his homework?',
        deliveredVia: 'dialogue',
        flags_set: ['dave_knows_your_role'],
        flags_read: [],
      },
      {
        hole: 3,
        event: 'sharon_first_text',
        description: 'Phone buzzes on the walk. Sharon\'s first text: casual on the surface ("How\'s the round going?") but asks about Dave. The hook is set.',
        deliveredVia: 'phone',
        flags_set: ['sharon_contacted', 'cooperating_with_sharon', 'deflected_sharon', 'left_sharon_on_read'],
        flags_read: [],
      },
    ],
  },

  // ACT 2: ESCALATION (Holes 4-6)
  act2: {
    theme: 'Hidden Agendas',
    tension: 'Medium → high',
    beats: [
      {
        hole: 4,
        event: 'ambition_reveal',
        description: 'The par 5 — risk/reward hole. Dave mentions the Anderson Account directly. Asks if you\'ve heard anything. Your response shapes the rest of the round.',
        deliveredVia: 'dialogue',
        flags_set: ['told_dave_about_anderson', 'deflected_anderson_question', 'lied_about_anderson'],
        flags_read: ['cooperating_with_sharon'],
      },
      {
        hole: 5,
        event: 'stakes_real',
        description: 'The chasm hole. Sharon texts again — Tom Anderson might stop by the turn. Everything is real now. A walking moment where you realize this isn\'t just golf.',
        deliveredVia: 'phone + walking_moment',
        flags_set: ['aware_tom_watching', 'ignored_tom_warning'],
        flags_read: ['cooperating_with_sharon', 'deflected_sharon'],
      },
      {
        hole: 6,
        event: 'dave_vulnerable',
        description: 'Dave opens up. Depending on impression, he shares something personal — he\'s been passed over twice. This might be his last chance. Or he doesn\'t share, and you sense something\'s off.',
        deliveredVia: 'dialogue',
        flags_set: ['dave_shared_struggle', 'empathized_with_dave', 'used_dave_info'],
        flags_read: ['told_dave_about_anderson', 'partner_impression'],
      },
    ],
  },

  // ACT 3: RESOLUTION (Holes 7-9)
  act3: {
    theme: 'Consequences',
    tension: 'High → resolution',
    beats: [
      {
        hole: 7,
        event: 'sharon_call',
        description: 'Sharon calls (not texts). Short par 3 — you might answer on the tee. She wants a decision: are you in or out? This is the point of no return.',
        deliveredVia: 'phone_call',
        flags_set: ['accepted_sharon_deal', 'rejected_sharon_deal', 'stalled_sharon'],
        flags_read: ['cooperating_with_sharon', 'warned_dave_about_sharon', 'dave_shared_struggle'],
      },
      {
        hole: 8,
        event: 'moment_of_truth',
        description: 'The signature hole. The chasm. Dave says something that lands differently depending on every flag set so far. This is where the relationship crystallizes.',
        deliveredVia: 'dialogue',
        flags_set: ['chose_dave', 'chose_career', 'chose_honesty', 'chose_self'],
        flags_read: ['ALL — this is the convergence point'],
      },
      {
        hole: 9,
        event: 'landing',
        description: 'Final hole. The round wraps. Depending on flags and stats, one of multiple endings plays out. Tom Anderson may or may not appear. Dave and you walk off the course as allies, rivals, strangers, or something harder to name.',
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
    conditions: 'impression >= 70 AND (warned_dave OR chose_dave) AND NOT used_dave_info',
    description: 'You and Dave walk off the ninth green as genuine allies. He trusts you. You trust him. When the Anderson Account comes up on Monday, you\'re going to propose a joint lead. Sharon won\'t like it. But Sharon\'s leaving anyway, and you know that now.',
    tone: 'Warm, earned, hopeful',
  },
  rival: {
    id: 'rival',
    name: 'THE COMPETITION',
    conditions: 'impression 40-70 AND chose_career AND NOT empathized_with_dave',
    description: 'You and Dave shake hands at the turn. Firm grip, eye contact, professional. You both know what\'s happening. Monday is going to be interesting. But you hit a hell of a drive on 8, and he knows you\'re not going away.',
    tone: 'Tense, respectful, electric',
  },
  betrayal: {
    id: 'betrayal',
    name: 'THE DEAL',
    conditions: 'cooperating_with_sharon AND used_dave_info AND NOT warned_dave',
    description: 'Dave doesn\'t know yet. He will by Monday. Sharon got what she needed, and she\'s already written the email recommending you for the Anderson lead. Your phone buzzes as you reach the parking lot. "Good work today. —SW." The sun is warm. The ocean is beautiful. You feel nothing.',
    tone: 'Cold, effective, hollow',
  },
  transcendent: {
    id: 'transcendent',
    name: 'THE ROUND',
    conditions: 'zen >= 80 AND chose_self AND impression >= 50',
    description: 'Somewhere around the seventh hole, you stopped caring about Anderson. About Sharon. About your title and your quarterly review. You were just... playing golf. At Pebble Beach. With a guy named Dave who tells bad jokes and has a surprisingly good short game. That\'s enough. Monday will sort itself out.',
    tone: 'Peaceful, philosophical, free',
  },
  collapse: {
    id: 'collapse',
    name: 'THE SPIRAL',
    conditions: 'impression < 30 AND (focus < 30 OR zen < 30)',
    description: 'The round fell apart somewhere around Hole 5 and never recovered. Dave stopped trying to make conversation after 7. Your phone has 4 unread texts from Sharon, each more terse than the last. The parking lot is quiet. Your car is the only one left. You sit in it for a long time before turning the key.',
    tone: 'Bleak, honest, rock bottom (but there\'s a restart button)',
  },
};

// ─── Phone Events (ordered by trigger) ───
const PHONE_EVENTS = [
  {
    id: 'phone_sharon_h3',
    hole: 3,
    trigger: 'walking_after_tee',
    from: 'Sharon Whitfield',
    type: 'text',
    preview: 'Hey! How\'s the round going?',
    fullText: `Hey! How's the round going? Getting along with Dave? He's a good guy. Smart. Sometimes I wonder if he's too comfortable though, you know? Anyway, have fun out there. Tom might swing by the turn. 😊`,
    subtext: 'She\'s asking you to evaluate Dave. The emoji is a weapon.',
    responses: [
      {
        text: 'Dave\'s great. Solid golfer. We\'re having a good time.',
        label: 'PLAY ALONG',
        statKey: 'swagger',
        traitEffects: { focus: -2 },
        setFlags: { cooperating_with_sharon: true },
        next_phone: null,
      },
      {
        text: 'Just trying to keep my head down and play golf.',
        label: 'DEFLECT',
        statKey: 'zen',
        traitEffects: { zen: 2 },
        setFlags: { deflected_sharon: true },
        next_phone: null,
      },
      {
        text: '(Don\'t reply)',
        label: 'LEAVE ON READ',
        traitEffects: { swagger: 2, zen: 3 },
        setFlags: { left_sharon_on_read: true },
        next_phone: 'phone_sharon_h5_followup',
      },
    ],
  },
  {
    id: 'phone_sharon_h5',
    hole: 5,
    trigger: 'walking_after_tee',
    from: 'Sharon Whitfield',
    type: 'text',
    preview: 'Quick heads up...',
    fullText: (state) => {
      if (hasFlag(state, 'left_sharon_on_read')) {
        return `I noticed you didn't respond earlier. No worries! Just wanted to let you know — Tom Anderson is at the turn. He's watching. Don't overthink it.`;
      }
      if (hasFlag(state, 'cooperating_with_sharon')) {
        return `Tom Anderson is definitely at the turn. He asked about you specifically. This is your moment. Stay sharp.`;
      }
      return `FYI — Tom Anderson is at the turn. Might come say hello. Just be yourself (but, you know, the best version).`;
    },
    subtext: 'The stakes just went up. Her tone varies based on your earlier response.',
  },
  {
    id: 'phone_sharon_h7_call',
    hole: 7,
    trigger: 'before_tee',
    from: 'Sharon Whitfield',
    type: 'call',
    preview: 'INCOMING CALL — Sharon Whitfield',
    dialogue: [
      {
        speaker: 'sharon',
        text: '"Hey, quick call. I know you\'re playing. Listen — I need to know where your head is on Anderson. Are you interested in the lead? Because I need to make a recommendation by end of week."',
      },
    ],
    responses: [
      {
        text: '"I\'m in. I want it."',
        label: 'COMMIT',
        statKey: 'swagger',
        traitEffects: { swagger: 3, zen: -4, focus: -2 },
        setFlags: { accepted_sharon_deal: true },
        sharonReply: '"Good. We\'ll talk Monday. Finish strong out there."',
      },
      {
        text: '"I need to think about it. Can we talk Monday?"',
        label: 'STALL',
        statKey: 'zen',
        traitEffects: { zen: 2 },
        setFlags: { stalled_sharon: true },
        sharonReply: '"...sure. Monday." Click.',
      },
      {
        text: '"What about Dave? He\'s been at the firm longer."',
        label: 'ADVOCATE FOR DAVE',
        statKey: 'knowledge',
        traitEffects: { knowledge: 2, swagger: -3 },
        setFlags: { advocated_for_dave: true },
        sharonReply: '"That\'s... interesting. I appreciate the honesty. We\'ll discuss." There\'s a long pause before she hangs up.',
      },
      {
        text: '(Let it go to voicemail)',
        label: 'DECLINE CALL',
        traitEffects: { zen: 5, focus: 3 },
        setFlags: { rejected_sharon_deal: true },
        narrative: 'The phone stops ringing. You breathe. The shortest hole on the course is in front of you. For once, you\'re just going to play golf.',
      },
    ],
  },
];

// ─── Walking Moments (story-driven micro-narratives) ───
const STORY_WALKING_MOMENTS = [
  {
    id: 'walk_h2_dave_knows',
    hole: 2,
    afterShot: 'tee',
    text: (state) => {
      return `You and Dave walk side by side. The second fairway is wider — more room to breathe. "So," Dave says, not looking at you, "you're on the analytics team, right? Working under Phil?" He knows your name. He knows your team. He knows your boss's name. This wasn't random.`;
    },
    choices: [
      {
        text: '"You\'ve done your homework."',
        label: 'CALL IT OUT',
        statKey: 'swagger',
        traitEffects: { swagger: 3 },
        partnerEffect: { impression: 4 },
        setFlags: { called_out_dave_research: true },
        narrative: 'Dave laughs. "LinkedIn. It\'s not stalking if it\'s professional." But there\'s something in his eyes — respect, maybe, for not letting it slide.',
      },
      {
        text: '"Yeah, that\'s me. How about you?"',
        label: 'PLAY IT NORMAL',
        traitEffects: { zen: 2 },
        narrative: 'You keep it casual. Dave talks about his role in business development. He\'s been at Meridian eight years. That\'s a long time in consulting.',
      },
    ],
  },
  {
    id: 'walk_h4_ambition',
    hole: 4,
    afterShot: 'tee',
    conditions: (state) => state.scorecard[3] !== null, // after hole 4 tee
    text: (state) => {
      let base = `The fourth is a par 5. The fairway stretches ahead, inviting. Risk and reward. `;
      if (hasFlag(state, 'cooperating_with_sharon')) {
        base += `Sharon's text from earlier is still on your mind. She said Tom Anderson "asked about you specifically." What does that mean?`;
      } else {
        base += `Something about long holes makes you introspective. There's a lot of green between you and the flag. A lot of time to think.`;
      }
      return base;
    },
    choices: [
      {
        text: 'Think about where you want to be in five years.',
        label: 'CAREER REFLECTION',
        traitEffects: { focus: -2, knowledge: 3 },
        setFlags: { reflected_on_career: true },
        narrative: 'VP by 35? Your own firm by 40? Or is that someone else\'s ambition wearing your clothes? The ball is 230 yards ahead. Focus on that.',
      },
      {
        text: 'Think about absolutely nothing. Just walk.',
        label: 'EMPTY MIND',
        traitEffects: { zen: 4 },
        narrative: 'The ocean. The grass. Your shoes on the path. For about forty-five seconds, you achieve something monks spend decades pursuing. Then your phone buzzes.',
      },
    ],
  },
  {
    id: 'walk_h6_dave_personal',
    hole: 6,
    afterShot: 'approach',
    conditions: (state) => state.partner.impression >= 55,
    text: (state) => {
      return `Dave is quiet as you walk to the green. Unusually quiet. He\'s looking at the ocean. After a minute, without turning: "You ever think about whether this is it? Like, is this the thing? Consulting? Meridian? This?" He gestures vaguely at the course, the sky, everything.`;
    },
    choices: [
      {
        text: '"Yeah. More than I\'d like to admit."',
        label: 'VULNERABLE',
        statKey: 'swagger',
        traitEffects: { zen: 4, swagger: -2 },
        partnerEffect: { impression: 8 },
        setFlags: { shared_doubt_with_dave: true },
        narrative: 'Dave nods slowly. "Yeah." A long pause. "I\'ve been here eight years. Eight years. And I still don\'t know if I\'m building something or just... occupying space." The green is ahead. You both have putts to make. But something just shifted.',
      },
      {
        text: '"I try not to think about it on the golf course."',
        label: 'DEFLECT WITH HUMOR',
        statKey: 'humor',
        traitEffects: { humor: 3, zen: 1 },
        partnerEffect: { impression: 2 },
        narrative: 'Dave manages a smile. "Smart." He pulls his putter. The moment passes. But it was there.',
      },
      {
        text: '"This is the thing. We\'re at Pebble Beach. This is the thing."',
        label: 'PRESENT MOMENT',
        statKey: 'zen',
        traitEffects: { zen: 5 },
        partnerEffect: { impression: 5 },
        setFlags: { grounded_dave: true },
        narrative: '"The thing," Dave repeats, looking at the ocean again. "Yeah. Yeah, you might be right." He straightens up. Something resolves in his posture. The green is twenty yards away.',
      },
    ],
  },
];

// ─── Corporate Swing Thought Intrusions ───
// These replace generic swing thoughts when the story requires it
const CORPORATE_SWING_THOUGHTS = {
  hole_5_tee: {
    conditions: (state) => hasFlag(state, 'aware_tom_watching'),
    setup: `188 yards over the chasm. You take the club back and—`,
    extraChoice: {
      text: `Tom Anderson might be watching from the clubhouse patio right now. This shot is a job interview disguised as a 5-iron. Don't mess this up.`,
      label: 'CAREER PRESSURE',
      baseQualityIndex: 3,
      traitEffects: { focus: -4, swagger: -3, knowledge: 2 },
      resultNarrative: {
        good: `The pressure sharpens you. The ball bores through the wind, lands on the green, and checks. If Tom was watching, he just saw someone who performs under pressure. That's worth more than any PowerPoint.`,
        bad: `The weight of it all crushes your swing. You decelerate, the ball comes up short, catches the slope, and rolls back toward the rocks. You watch it stop six inches from disaster. Tom Anderson, if he saw that, saw a person who chokes.`,
      },
    },
  },
  hole_8_tee: {
    conditions: (state) => hasFlag(state, 'accepted_sharon_deal') || hasFlag(state, 'dave_shared_struggle'),
    setup: `The signature hole. The chasm. You take the club back—`,
    extraChoice: {
      text: (state) => {
        if (hasFlag(state, 'accepted_sharon_deal') && hasFlag(state, 'dave_shared_struggle')) {
          return `Dave doesn't know you've already committed to Sharon. He shared his fears with you twenty minutes ago. And now you're both standing over a chasm. The metaphor is not subtle.`;
        }
        if (hasFlag(state, 'accepted_sharon_deal')) {
          return `You said yes to Sharon. The Anderson Account. Your name on the door. The ball is on the tee. The Pacific is below. Everything after this is yours to lose.`;
        }
        return `Dave told you this might be his last chance. He's standing five feet behind you. You can feel him watching. What do you owe him? What do you owe yourself?`;
      },
      label: 'THE WEIGHT',
      baseQualityIndex: 3,
      traitEffects: { focus: -3, zen: -3 },
      resultNarrative: {
        good: `Something cracks open inside you and the swing just happens. Pure, committed, unburdened. The ball sails over the chasm like it was never in doubt. You were never in doubt. Whatever happens Monday, you hit this shot.`,
        bad: `The weight is too much. Your body knows it even if your mind won't admit it. The swing flinches. The ball fades, catches the wind, and drops. It doesn't reach the ocean — it lands on the rocks, bounces twice, and settles in thick brush. You'll take a penalty. The chasm won.`,
      },
    },
  },
};
