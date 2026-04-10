// ─── Dialogue Trees ───
// Multi-turn branching dialogues for between-holes and special moments.
// Every response directly affects traits, impression, shot modifiers, or narrative flags.

// Helper: builds text that references past choices via flags
function memoryText(state, flagKey, ifSet, ifNotSet) {
  return hasFlag(state, flagKey) ? ifSet : ifNotSet;
}

// ─────────────────────────────────────────────
// BETWEEN HOLES 1 → 2
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_1 = {
  id: 'after_h1',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `You and Dave walk off the first green toward the second tee. The mist is lifting. He's loosening up, rolling his shoulders.`,
      next: 'dave_opener',
    },
    {
      id: 'dave_opener',
      speaker: 'dave',
      text: (state) => {
        const score = state.scorecard[0];
        const par = COURSE_DATA.holes[0].par;
        if (score <= par) return `"Not a bad start. You know, most guys come out here and hack it around the first hole. Nerves, I guess. You looked pretty calm out there."`;
        return `"Shake it off. First hole at Pebble Beach — everyone's nervous. The course opens up from here."`;
      },
      responses: [
        {
          text: `"Calm? My hands were shaking the entire time. I just have a good poker face."`,
          label: 'HONEST',
          traitEffects: { humor: 4, zen: -2 },
          partnerEffect: { impression: 6 },
          setFlags: { admitted_nerves: true },
          next: 'dave_laughs',
        },
        {
          text: `"I've been visualizing this round for weeks. Every shot, every hole. I came prepared."`,
          label: 'CONFIDENT',
          traitEffects: { swagger: 5, focus: 3 },
          partnerEffect: { impression: -2 },
          setFlags: { claimed_prepared: true },
          next: 'dave_raises_eyebrow',
        },
        {
          text: `"The key on that first hole is committing to your line off the tee. That fairway plays wider than it looks if you trust the slope."`,
          label: 'GOLF IQ',
          requires: { knowledge: 55 },
          traitEffects: { knowledge: 4, focus: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { showed_knowledge_h1: true },
          next: 'dave_impressed',
        },
        {
          text: `[Say nothing. Just nod and take in the view.]`,
          label: 'STOIC',
          traitEffects: { zen: 5 },
          partnerEffect: { impression: 1 },
          next: 'walk_quiet',
        },
      ],
    },
    {
      id: 'dave_laughs',
      speaker: 'dave',
      text: `Dave laughs — a genuine one, not the polite kind. "Yeah, I get it. My first time here I topped my opening tee shot. Like, topped it. Went maybe forty yards. The starter pretended not to see."`,
      responses: [
        {
          text: `"That makes me feel significantly better about my life choices."`,
          label: 'WIT',
          traitEffects: { humor: 3 },
          partnerEffect: { impression: 3 },
          end: true,
        },
        {
          text: `"Everyone's got a first-tee story. What matters is whether you recovered."`,
          label: 'GRACIOUS',
          traitEffects: { zen: 3, knowledge: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { dave_shared_story: true },
          end: true,
        },
      ],
    },
    {
      id: 'dave_raises_eyebrow',
      speaker: 'dave',
      text: `Dave raises an eyebrow. "Visualizing? Like, with your eyes closed and everything?" There's a half-smile. He's not sure if you're serious.`,
      responses: [
        {
          text: `"Dead serious. Sports psychology. The best golfers in the world do it."`,
          label: 'DOUBLE DOWN',
          traitEffects: { swagger: 4, knowledge: 2 },
          partnerEffect: { impression: -3 },
          setFlags: { swagger_doubled: true },
          shotModifier: -0.3,
          next: 'dave_skeptical',
        },
        {
          text: `"...Okay, I watched a YouTube video on the plane. Same thing."`,
          label: 'DEFLECT WITH HUMOR',
          traitEffects: { humor: 5, swagger: -2 },
          partnerEffect: { impression: 5 },
          end: true,
        },
      ],
    },
    {
      id: 'dave_skeptical',
      speaker: 'dave',
      text: `"Sure. Well, let's see how the visualization holds up on number two. It's a long one." He pulls a water bottle from his bag and takes a slow sip. He's watching you now, curious. Maybe a little competitive.`,
      next: 'end_node',
    },
    {
      id: 'dave_impressed',
      speaker: 'dave',
      text: `Dave tilts his head. "Huh. You actually know this course." He pulls out his yardage book and flips a page. "Most guys just see the ocean and forget to play golf."`,
      responses: [
        {
          text: `"I've studied every hole. Pin positions, prevailing winds, where the bailouts are. This isn't a vacation round for me."`,
          label: 'COURSE SCHOLAR',
          requires: { knowledge: 60 },
          traitEffects: { knowledge: 6, focus: 3 },
          partnerEffect: { impression: 3 },
          setFlags: { deep_knowledge: true },
          shotModifier: -0.5,
          end: true,
        },
        {
          text: `"I just love the game. The course does the rest of the talking."`,
          label: 'HUMBLE',
          traitEffects: { zen: 4, swagger: 2 },
          partnerEffect: { impression: 6 },
          end: true,
        },
      ],
    },
    {
      id: 'walk_quiet',
      speaker: 'narrator',
      text: `The two of you walk in comfortable silence. The sound of the Pacific fills the gap. Sometimes not saying anything says enough. Dave seems to respect it.`,
      next: 'end_node',
    },
    {
      id: 'end_node',
      speaker: 'narrator',
      text: '',
      end: true,
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 2 → 3
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_2 = {
  id: 'after_h2',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `Walking to the third tee, you catch your first real glimpse of the ocean through the pines. The light is shifting — golden now, the mist fully gone.`,
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'admitted_nerves')) return `"Hey — the shaking hands from the first tee? Completely gone now, right?" He grins.`;
        if (hasFlag(state, 'claimed_prepared')) return `"So the visualization guy — how's the mental movie going so far? Matching up?"`;
        return `"You know what I like about this course? It rewards patience. The guys who try to force it always blow up by hole six."`;
      },
      responses: [
        {
          text: `"Patience? Dave, I'm here to make birdies. You can be patient. I'm going low."`,
          label: 'AGGRESSIVE',
          traitEffects: { swagger: 6, zen: -3 },
          partnerEffect: { impression: 2 },
          setFlags: { going_low: true },
          shotModifier: -0.2,
          next: 'dave_challenge',
        },
        {
          text: `"You're right. This course punishes greed. I'd rather make nine pars than chase birdies and make doubles."`,
          label: 'COURSE MANAGEMENT',
          requires: { knowledge: 50 },
          traitEffects: { knowledge: 5, zen: 4, focus: 2 },
          partnerEffect: { impression: 5 },
          setFlags: { plays_smart: true },
          end: true,
        },
        {
          text: `"I'm just trying to enjoy the scenery and not embarrass myself, honestly."`,
          label: 'SELF-DEPRECATING',
          traitEffects: { humor: 4, swagger: -2 },
          partnerEffect: { impression: 4 },
          end: true,
        },
        {
          text: `"My buddy told me the third hole is where this course starts showing its teeth. Is that true?"`,
          label: 'CURIOUS',
          traitEffects: { knowledge: 3, focus: 2 },
          partnerEffect: { impression: 3 },
          next: 'dave_warns_three',
        },
      ],
    },
    {
      id: 'dave_challenge',
      speaker: 'dave',
      text: `Dave stops walking for a second. "Going low? At Pebble?" He grins. "Alright. Tell you what — if you're under par through nine, lunch is on me. If you're over par, you're buying."`,
      responses: [
        {
          text: `"You're on. Hope you brought your wallet."`,
          label: 'ACCEPT THE BET',
          traitEffects: { swagger: 5, focus: 3 },
          partnerEffect: { impression: 5 },
          setFlags: { bet_with_dave: true },
          end: true,
        },
        {
          text: `"I don't bet on golf. Bad karma. Let's just play."`,
          label: 'DECLINE',
          traitEffects: { zen: 4, swagger: -2 },
          partnerEffect: { impression: -1 },
          end: true,
        },
      ],
    },
    {
      id: 'dave_warns_three',
      speaker: 'dave',
      text: `"Three is where you first play along the cliffs. It's gorgeous and terrifying in equal measure. The fairway slopes toward the ocean. And the wind—" He pauses, holding up a finger to feel the breeze. "Yeah, it's going to be in your face."`,
      responses: [
        {
          text: `"Good to know. I'll club up."`,
          label: 'PRACTICAL',
          traitEffects: { knowledge: 4, focus: 3 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"Wind, cliffs, ocean... sounds like my ex's personality. I can handle it."`,
          label: 'JOKE',
          requires: { humor: 45 },
          traitEffects: { humor: 5, swagger: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { ex_joke: true },
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 3 → 4
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_3 = {
  id: 'after_h3',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `The walk from three to four is short but the scenery is relentless. The entire Pacific coastline stretches south. A seal barks somewhere below.`,
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'bet_with_dave')) {
          const total = state.totalScore;
          if (total <= 0) return `Dave checks his phone's calculator. "You're ${total === 0 ? 'even' : formatScore(total)}. The bet is very much alive. I'm starting to regret this."`;
          return `Dave grins. "You're ${formatScore(total)}. My wallet is feeling very safe right now."`;
        }
        return `"Four is a sneaky one," Dave says, shading his eyes against the sun. "Short par 4, looks easy. It is not easy."`;
      },
      responses: [
        {
          text: `"Short par 4? I'm going for the green off the tee. Driver."`,
          label: 'GO FOR IT',
          traitEffects: { swagger: 7, focus: -2, zen: -3 },
          partnerEffect: { impression: 3 },
          setFlags: { went_for_4_green: true },
          shotModifier: 0.5,
          next: 'dave_react_driver',
        },
        {
          text: `"What's the smart play? Iron off the tee and wedge in?"`,
          label: 'STRATEGIC',
          traitEffects: { knowledge: 5, focus: 3 },
          partnerEffect: { impression: 3 },
          setFlags: { played_4_smart: true },
          shotModifier: -0.4,
          next: 'dave_strategy',
        },
        {
          text: `[Pull out your phone and sneak a photo of the coastline]`,
          label: 'TOURIST MOMENT',
          traitEffects: { zen: 4, focus: -3, humor: 2 },
          partnerEffect: { impression: 2 },
          setFlags: { took_photo: true },
          end: true,
        },
      ],
    },
    {
      id: 'dave_react_driver',
      speaker: 'dave',
      text: `Dave's eyes widen. "Driver? On four? It's 327 yards. The green is the size of your living room and there's a cliff on the left." He pauses. "...But if you pull it off, it'd be legendary."`,
      responses: [
        {
          text: `"Legends aren't made with 7-irons, Dave."`,
          label: 'FULL SEND',
          requires: { swagger: 55 },
          traitEffects: { swagger: 5 },
          partnerEffect: { impression: 4 },
          setFlags: { legend_line: true },
          end: true,
        },
        {
          text: `"You know what, you're right. I'll take the iron. Live to fight another hole."`,
          label: 'WALK IT BACK',
          traitEffects: { knowledge: 3, zen: 3, swagger: -3 },
          setFlags: { walked_back_driver: true },
          shotModifier: -0.5,
          end: true,
        },
      ],
    },
    {
      id: 'dave_strategy',
      speaker: 'dave',
      text: `"Exactly. 5-iron to the center, wedge to the pin. That's how the pros play it." He looks at you with something approaching respect. "Most amateurs can't resist the driver here."`,
      responses: [
        {
          text: `"I've made enough doubles this year to learn the hard way."`,
          label: 'EXPERIENCE',
          traitEffects: { knowledge: 3, zen: 3 },
          partnerEffect: { impression: 4 },
          end: true,
        },
        {
          text: `"What do the pros know? They get paid. I'm here for fun."`,
          label: 'REBEL',
          traitEffects: { humor: 4, swagger: 3, knowledge: -2 },
          partnerEffect: { impression: 2 },
          setFlags: { rebel_h4: true },
          shotModifier: 0.3,
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 4 → 5
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_4 = {
  id: 'after_h4',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `You approach the fifth tee. The ocean opens up completely. The chasm between tee and green is impossible to ignore. Dave stops and just stares for a moment.`,
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: `"Alright. This is it. The fifth hole. 188 yards over the abyss." He looks at you. "How are you feeling? Honestly."`,
      responses: [
        {
          text: `"I feel great. This is why we're here, right? Bring it on."`,
          label: 'FEARLESS',
          requires: { swagger: 50 },
          traitEffects: { swagger: 5, zen: 2 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.3,
          next: 'dave_respects_bravery',
        },
        {
          text: `"Honestly? I might throw up. This is terrifying."`,
          label: 'VULNERABLE',
          traitEffects: { humor: 5, zen: -3, swagger: -2 },
          partnerEffect: { impression: 6 },
          setFlags: { scared_of_five: true },
          next: 'dave_reassures',
        },
        {
          text: `"I need to think about club selection. What are you hitting?"`,
          label: 'TACTICAL',
          traitEffects: { knowledge: 4, focus: 3 },
          partnerEffect: { impression: 2 },
          next: 'dave_club_talk',
        },
        {
          text: `"Let me take a minute. I want to remember this."`,
          label: 'MINDFUL',
          requires: { zen: 55 },
          traitEffects: { zen: 6, focus: 2 },
          partnerEffect: { impression: 3 },
          setFlags: { savored_moment: true },
          shotModifier: -0.4,
          end: true,
        },
      ],
    },
    {
      id: 'dave_respects_bravery',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'legend_line')) return `"Legends aren't made with 7-irons..." He quotes you back. "Alright, let's see if that energy holds over a hundred-foot drop."`;
        return `"I like that attitude. Most people freeze up here." He claps you on the shoulder. "Don't freeze up."`;
      },
      end: true,
    },
    {
      id: 'dave_reassures',
      speaker: 'dave',
      text: `Dave laughs softly. "Hey, I lost two balls here my first time. Two. Just aim at the center of the green and make a swing. Don't think about the cliff. ...Which, now that I've said it, is all you're going to think about."`,
      responses: [
        {
          text: `"Great pep talk, Dave. Really nailed it."`,
          label: 'SARCASM',
          traitEffects: { humor: 4, swagger: 2 },
          partnerEffect: { impression: 3 },
          end: true,
        },
        {
          text: `"Two balls? Okay, that actually makes me feel better. I only brought a dozen."`,
          label: 'SELF-AWARE',
          traitEffects: { humor: 3, zen: 2 },
          partnerEffect: { impression: 4 },
          end: true,
        },
      ],
    },
    {
      id: 'dave_club_talk',
      speaker: 'dave',
      text: `"I'm hitting 5-iron. The wind is into us, so it's playing more like 200. You've got to commit to the club and commit to the swing. No in-between shots here. If you steer it, it dies in the wind."`,
      responses: [
        {
          text: `"5-iron it is. Same club, same target. I'll match you."`,
          label: 'MIRROR DAVE',
          traitEffects: { focus: 3, knowledge: 3 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.2,
          end: true,
        },
        {
          text: `"I hit my 5-iron further than you. I'm going 6-iron, maybe even 7."`,
          label: 'FLEX',
          requires: { swagger: 60 },
          traitEffects: { swagger: 5, focus: -2 },
          partnerEffect: { impression: -3 },
          setFlags: { flexed_on_dave: true },
          shotModifier: 0.4,
          end: true,
        },
        {
          text: `"What about a punched 4-iron? Keep it under the wind?"`,
          label: 'ADVANCED PLAY',
          requires: { knowledge: 65 },
          traitEffects: { knowledge: 6, focus: 4 },
          partnerEffect: { impression: 5 },
          setFlags: { punch_shot_idea: true },
          shotModifier: -0.6,
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 5 → 6
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_5 = {
  id: 'after_h5',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: (state) => {
        const score5 = state.scorecard[4];
        const par5 = COURSE_DATA.holes[4].par;
        if (score5 !== null && score5 <= par5) return `You walk off the fifth green with a grin you can't suppress. Dave is nodding. The ocean roars its approval below.`;
        return `You walk off the fifth green. The ocean below is indifferent to your scorecard. Hole six awaits — mercifully, it's away from the cliffs.`;
      },
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'scared_of_five')) {
          const score5 = state.scorecard[4];
          const par5 = COURSE_DATA.holes[4].par;
          if (score5 !== null && score5 <= par5) return `"You said you were going to throw up back there. Then you go and do THAT?" He shakes his head. "The scared ones always play better."`;
          return `"Hey, you survived. That's the main thing. A lot of golf left." He's being kind. You appreciate it.`;
        }
        if (hasFlag(state, 'flexed_on_dave')) return `Dave is quiet for a moment. "So... how'd the 6-iron work out?" There's a glint in his eye.`;
        return `"Six is a breather," Dave says. "Par 5, wide fairway. Time to make a birdie and put some momentum together."`;
      },
      responses: [
        {
          text: `"I need a water and a breather. Those last two holes took years off my life."`,
          label: 'EXHAUSTED',
          traitEffects: { humor: 3, zen: 3 },
          partnerEffect: { impression: 3 },
          next: 'dave_water',
        },
        {
          text: `"Birdie sounds good. What's the play on six — go for it in two?"`,
          label: 'HUNTING',
          traitEffects: { swagger: 3, knowledge: 3 },
          partnerEffect: { impression: 2 },
          next: 'dave_strategy_6',
        },
        {
          text: `"Dave, real talk — how often do you play here?"`,
          label: 'PERSONAL',
          traitEffects: { humor: 2, zen: 2 },
          partnerEffect: { impression: 5 },
          setFlags: { asked_dave_personal: true },
          next: 'dave_opens_up',
        },
      ],
    },
    {
      id: 'dave_water',
      speaker: 'dave',
      text: `He tosses you a water from his bag. "Here. Hydrate. Six is long — you'll need the energy." He takes a pull from his own bottle and looks back at the coastline. "Still can't believe we're here, honestly."`,
      responses: [
        {
          text: `"Same. I keep expecting someone to tell me I'm not supposed to be here."`,
          label: 'IMPOSTOR SYNDROME',
          traitEffects: { humor: 3, swagger: -2, zen: 2 },
          partnerEffect: { impression: 5 },
          setFlags: { impostor_feeling: true },
          end: true,
        },
        {
          text: `"I earned this. Let's make the most of it."`,
          label: 'OWNED IT',
          traitEffects: { swagger: 4, focus: 2 },
          partnerEffect: { impression: 2 },
          end: true,
        },
      ],
    },
    {
      id: 'dave_strategy_6',
      speaker: 'dave',
      text: `"In two? There's a creek about 80 out from the green. If you can carry it, the green's accessible. If you can't, lay up and wedge it close. Depends on how you're hitting your long clubs."`,
      responses: [
        {
          text: `"I'll decide when I see my lie. No point committing now."`,
          label: 'PATIENT',
          traitEffects: { knowledge: 4, zen: 3, focus: 2 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"If it's in the fairway, I'm going for it. Period."`,
          label: 'COMMITTED',
          traitEffects: { swagger: 5, focus: 2, zen: -2 },
          setFlags: { going_for_6_in_two: true },
          end: true,
        },
      ],
    },
    {
      id: 'dave_opens_up',
      speaker: 'dave',
      text: `Dave looks surprised by the question. "This is my third time. First was a corporate thing — barely played, just drank. Second was with my dad, right before his knee surgery. He couldn't finish. We made it through seven." He pauses. "This is the first time I've actually been able to enjoy it."`,
      responses: [
        {
          text: `"That's a hell of a thing, man. Your dad would love to see you out here finishing what you started."`,
          label: 'EMPATHETIC',
          traitEffects: { zen: 5, humor: 1 },
          partnerEffect: { impression: 8 },
          setFlags: { dave_dad_story: true, empathized_with_dave: true },
          end: true,
        },
        {
          text: `"Well, you're playing great. He'd be proud."`,
          label: 'ENCOURAGING',
          traitEffects: { zen: 3 },
          partnerEffect: { impression: 6 },
          setFlags: { dave_dad_story: true },
          end: true,
        },
        {
          text: `"Corporate golf is the worst. All politics, no fun."`,
          label: 'DEFLECT',
          traitEffects: { humor: 2, swagger: 2 },
          partnerEffect: { impression: -2 },
          setFlags: { dave_dad_story: true, missed_moment: true },
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 6 → 7
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_6 = {
  id: 'after_h6',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `The seventh tee is ahead — the postcard hole. Even from here you can see the tiny green perched on the rocks. A crowd of spectators has gathered. Someone has a camera with a long lens.`,
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'empathized_with_dave')) return `Dave walks close. "Hey, thanks for what you said back there. About my dad. Means a lot." He clears his throat. "Now, seven. The postcard hole. 106 yards. Sand wedge. Don't overthink it."`;
        if (hasFlag(state, 'bet_with_dave')) {
          const score = state.totalScore;
          return `"Scorecheck: you're ${formatScore(score)}. ${score <= 0 ? "I'm genuinely worried about my wallet." : "My wallet's still feeling good."} But seven can flip anything. 106 yards. All or nothing."`;
        }
        return `"Seven. The shortest hole at Pebble Beach and the scariest. 106 yards. Pick your club and pray." Dave grins.`;
      },
      responses: [
        {
          text: `"106 yards? That's just a sand wedge. I hit my sand wedge in my sleep."`,
          label: 'COCKY',
          traitEffects: { swagger: 5, focus: -2 },
          partnerEffect: { impression: 1 },
          setFlags: { cocky_on_7: true },
          shotModifier: 0.3,
          end: true,
        },
        {
          text: `"The wind is the entire game here, right? What's it doing?"`,
          label: 'TACTICAL',
          traitEffects: { knowledge: 4, focus: 4 },
          partnerEffect: { impression: 3 },
          next: 'dave_wind_read',
        },
        {
          text: `"Hold on. I need to take this in for a second. This is the most photographed hole in golf."`,
          label: 'APPRECIATE',
          requires: { zen: 50 },
          traitEffects: { zen: 5, focus: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { appreciated_seven: true },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"Dave. I need you to be honest. If I shank this into the ocean in front of all these people, can we leave the country?"`,
          label: 'PANIC HUMOR',
          requires: { humor: 50 },
          traitEffects: { humor: 6, zen: -2, swagger: -1 },
          partnerEffect: { impression: 5 },
          setFlags: { shank_joke: true },
          end: true,
        },
      ],
    },
    {
      id: 'dave_wind_read',
      speaker: 'dave',
      text: `Dave holds up a pinch of grass and lets it fall. "Left to right, maybe 10-15 miles per hour. See the flag? It's stiff. I'd aim left edge and let the wind bring it back. But the key is committing. Any hesitation and the wind eats you alive."`,
      responses: [
        {
          text: `"Left edge, full commit. Got it. Thanks."`,
          label: 'ABSORB',
          traitEffects: { knowledge: 3, focus: 3, zen: 2 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.5,
          end: true,
        },
        {
          text: `"What if I just punch a low one under the wind?"`,
          label: 'CREATIVE',
          requires: { knowledge: 60 },
          traitEffects: { knowledge: 5, swagger: 3 },
          partnerEffect: { impression: 4 },
          setFlags: { creative_7: true },
          shotModifier: -0.3,
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 7 → 8
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_7 = {
  id: 'after_h7',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `The walk to eight is short and heavy with anticipation. This is the hole you see on television. The chasm shot. Dave is quiet. You're both thinking the same thing.`,
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'shank_joke')) return `"So, about that shank joke on seven — you survived. Now do it again. Except this one is 200 yards. Over a cliff." He's grinning but his eyes aren't.`;
        if (hasFlag(state, 'cocky_on_7')) {
          const score7 = state.scorecard[6];
          const par7 = COURSE_DATA.holes[6].par;
          if (score7 !== null && score7 > par7) return `"The 'sand wedge in your sleep' didn't exactly work out, did it? Maybe wake up for this one. Eight is no joke."`;
          return `"Okay, the confidence is paying off. But eight is different. This one tests your soul, not your sand wedge."`;
        }
        return `"This is it. The eighth at Pebble Beach. I don't care what your handicap is — this tee shot is going to make your heart race."`;
      },
      responses: [
        {
          text: `"I've been thinking about this shot since I booked the round. I'm ready."`,
          label: 'PREPARED',
          traitEffects: { focus: 4, swagger: 3 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"Let's not talk about it. Just let me hit it before I think too much."`,
          label: 'DON\'T OVERTHINK',
          traitEffects: { zen: 5, focus: -2 },
          partnerEffect: { impression: 2 },
          end: true,
        },
        {
          text: `"Tell me about the wind. Tell me about the distance. Tell me everything. I need data."`,
          label: 'ANALYTICAL',
          requires: { knowledge: 55 },
          traitEffects: { knowledge: 5, focus: 4 },
          partnerEffect: { impression: 2 },
          next: 'dave_briefing',
        },
        {
          text: `"Dave, if I don't make it across, tell my family I died doing what I loved."`,
          label: 'GALLOWS HUMOR',
          requires: { humor: 55 },
          traitEffects: { humor: 6, zen: -1 },
          partnerEffect: { impression: 5 },
          setFlags: { gallows_humor_8: true },
          end: true,
        },
      ],
    },
    {
      id: 'dave_briefing',
      speaker: 'dave',
      text: `"Okay, here's the deal. It's 200 yards to the far cliff. The fairway is up there on the right — you can't see it from here, but it's wide. Aim at the lone tree on the ridge. Wind is cross, left to right. You need a full committed swing — if you bail out or decelerate, the ball doesn't clear. This is a 'trust your swing' shot."`,
      responses: [
        {
          text: `"Lone tree, full send, don't flinch. Got it."`,
          label: 'LOCKED IN',
          traitEffects: { focus: 5, knowledge: 3, zen: 2 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.5,
          end: true,
        },
        {
          text: `"What if I aimed further right for a bigger margin? Play for the wide part of the fairway?"`,
          label: 'SAFE ROUTE',
          requires: { knowledge: 60 },
          traitEffects: { knowledge: 4, zen: 3, swagger: -1 },
          shotModifier: -0.4,
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// BETWEEN HOLES 8 → 9
// ─────────────────────────────────────────────
const DIALOGUE_AFTER_HOLE_8 = {
  id: 'after_h8',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: (state) => {
        const score8 = state.scorecard[7];
        const par8 = COURSE_DATA.holes[7].par;
        if (score8 !== null && score8 <= par8) return `You walk off the eighth green buzzing. That hole — the chasm, the cliff, the shot — it's the reason people come to Pebble Beach. And you just played it.`;
        return `Eight is behind you. The chasm is behind you. Whatever the scorecard says, you hit a shot over the Pacific Ocean at Pebble Beach. That counts for something.`;
      },
      next: 'dave_topic',
    },
    {
      id: 'dave_topic',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'gallows_humor_8')) return `"You're alive! I was ready to call your family." He's beaming. The shared tension of eight has bonded you.`;
        if (hasFlag(state, 'bet_with_dave')) {
          const score = state.totalScore;
          return `"Last hole. ${formatScore(score)} through eight. ${score <= 0 ? "I can't believe this. One more hole and I'm buying lunch for the guy I met four hours ago." : "Still time to make a run. Nine is a tough par 4 though."}"`;
        }
        return `"One more hole. The ninth. Longest par 4 on the course, right along the cliff." He exhales. "What a front nine this has been."`;
      },
      responses: [
        {
          text: `"I don't want this round to end."`,
          label: 'SENTIMENTAL',
          traitEffects: { zen: 5, humor: 2 },
          partnerEffect: { impression: 6 },
          setFlags: { sentimental_9: true },
          next: 'dave_sentimental',
        },
        {
          text: `"One more. Let's finish strong."`,
          label: 'COMPETITIVE',
          traitEffects: { focus: 4, swagger: 3 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"Dave, whatever happens on nine — this has been a great round. Thanks for the company."`,
          label: 'GENUINE',
          traitEffects: { zen: 4, humor: 2 },
          partnerEffect: { impression: 8 },
          setFlags: { thanked_dave: true },
          next: 'dave_touched',
        },
        {
          text: `"Alright, nine. 466 yards. What's the strategy?"`,
          label: 'ALL BUSINESS',
          requires: { focus: 55 },
          traitEffects: { focus: 5, knowledge: 3 },
          partnerEffect: { impression: 2 },
          shotModifier: -0.4,
          next: 'dave_nine_strategy',
        },
      ],
    },
    {
      id: 'dave_sentimental',
      speaker: 'dave',
      text: (state) => {
        if (hasFlag(state, 'dave_dad_story')) return `Dave nods slowly. "I know what you mean. My dad said the same thing — the first time we played here. 'Every round ends, Dave. That's what makes them matter.'"`;
        return `"Me neither." Dave looks out at the ocean. "But that's the thing about golf, right? The round always ends. You just hope the next one comes soon enough."`;
      },
      responses: [
        {
          text: `"Your dad sounds like a wise guy."`,
          label: 'CALLBACK',
          requiresFlag: 'dave_dad_story',
          traitEffects: { zen: 4 },
          partnerEffect: { impression: 6 },
          end: true,
        },
        {
          text: `"Let's make this last hole count, then."`,
          label: 'RESOLVE',
          traitEffects: { focus: 4, swagger: 2 },
          shotModifier: -0.3,
          end: true,
        },
      ],
    },
    {
      id: 'dave_touched',
      speaker: 'dave',
      text: (state) => {
        const imp = state.partner.impression;
        if (imp >= 70) return `Dave stops walking. He actually stops. "You know what — same. I wasn't sure what to expect today, and this has been one of the best rounds I've ever played. Not the score. The round." He extends a fist bump. That's the highest honor in guy language.`;
        return `Dave nods. "Yeah. Yeah, it's been solid." He seems to mean it, even if he's not the sentimental type. "Let's close it out."`;
      },
      end: true,
    },
    {
      id: 'dave_nine_strategy',
      speaker: 'dave',
      text: `"466, wind behind us. The fairway runs along the cliff — ocean left. It's the longest par 4 but the wind helps. Driver, aim right-center, and let the wind push it. The approach is long, so position off the tee is everything."`,
      responses: [
        {
          text: `"Right-center, let the wind work. This is a three-club hole — driver, long iron, putter."`,
          label: 'CLINICAL',
          requires: { knowledge: 60 },
          traitEffects: { knowledge: 5, focus: 4 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.5,
          end: true,
        },
        {
          text: `"I'm just going to rip it and see what happens. Last hole energy."`,
          label: 'LAST HOLE ENERGY',
          traitEffects: { swagger: 5, zen: -1 },
          partnerEffect: { impression: 2 },
          end: true,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Registry: maps hole index to dialogue tree
// ─────────────────────────────────────────────
const DIALOGUE_TREES = {
  0: DIALOGUE_AFTER_HOLE_1,
  1: DIALOGUE_AFTER_HOLE_2,
  2: DIALOGUE_AFTER_HOLE_3,
  3: DIALOGUE_AFTER_HOLE_4,
  4: DIALOGUE_AFTER_HOLE_5,
  5: DIALOGUE_AFTER_HOLE_6,
  6: DIALOGUE_AFTER_HOLE_7,
  7: DIALOGUE_AFTER_HOLE_8,
};

function getDialogueTree(holeIndex) {
  return DIALOGUE_TREES[holeIndex] || null;
}

function getDialogueNode(tree, nodeId) {
  return tree.nodes.find(n => n.id === nodeId) || null;
}
