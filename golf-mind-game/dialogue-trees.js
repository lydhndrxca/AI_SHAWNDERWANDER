// â”€â”€â”€ Dialogue Trees â”€â”€â”€
// Multi-turn branching dialogues for between-holes and special moments.
// Every response directly affects traits, impression, shot modifiers, or narrative flags.

// Helper: builds text that references past choices via flags
function memoryText(state, flagKey, ifSet, ifNotSet) {
  return hasFlag(state, flagKey) ? ifSet : ifNotSet;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BETWEEN HOLES 1 â†’ 2
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DIALOGUE_AFTER_HOLE_1 = {
  id: 'after_h1',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `You leave the first green at Fujo International. Mist threads through the pines. Somewhere below, a stream finds the valley. Martin Voss walks beside you, shoes quiet on the path. Kenji Sato is a half-step ahead â€” precise, unhurried, already reading the next hole as if it owed him money.`,
      next: 'martin_opener',
    },
    {
      id: 'martin_opener',
      speaker: 'martin',
      text: (state) => {
        const score = state.scorecard[0];
        const par = COURSE_DATA.holes[0].par;
        if (score <= par) {
          return `"Not bad. Sato's tempo on the range was almost irritating. Yours was acceptable." A beat. "Interesting."`;
        }
        return `"First hole is paperwork. We file it and move on." He glances at Sato's back. "The mountain does not grade on a curve."`;
      },
      responses: [
        {
          text: `"Acceptable is generous. My hands were not on speaking terms with my brain."`,
          label: 'HONEST',
          traitEffects: { humor: 4, zen: -2 },
          partnerEffect: { impression: 6 },
          setFlags: { admitted_nerves: true },
          next: 'martin_after_nerves',
        },
        {
          text: `"I rehearsed this tee box until the slide deck felt jealous."`,
          label: 'CONFIDENT',
          traitEffects: { swagger: 5, focus: 3 },
          partnerEffect: { impression: -2 },
          setFlags: { h1_claimed_prep: true },
          next: 'martin_after_prep',
        },
        {
          text: `"The fairway tilts more than it looks from the tee. You commit to the left half or you don't commit at all."`,
          label: 'GOLF IQ',
          requires: { knowledge: 55 },
          traitEffects: { knowledge: 4, focus: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { h1_course_detail: true },
          next: 'martin_after_course',
        },
        {
          text: `[Say nothing. Let the mist do the talking.]`,
          label: 'STOIC',
          traitEffects: { zen: 5 },
          partnerEffect: { impression: 1 },
          next: 'walk_quiet',
        },
      ],
    },
    {
      id: 'martin_after_nerves',
      speaker: 'martin',
      text: `"Honesty is inefficient, but it saves time." He almost smiles. "I once shanked one into a sponsor tent. The tent pretended it didn't happen. So did I."`,
      responses: [
        {
          text: `"That story makes me feel almost employable."`,
          label: 'WIT',
          traitEffects: { humor: 3 },
          partnerEffect: { impression: 3 },
          end: true,
        },
        {
          text: `"Recovery matters more than the first swing. That's the whole thesis."`,
          label: 'GRACIOUS',
          traitEffects: { zen: 3, knowledge: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { h1_martin_shared: true },
          end: true,
        },
      ],
    },
    {
      id: 'martin_after_prep',
      speaker: 'martin',
      text: `"Rehearsed." He says it like a spreadsheet error. "And the round is matching your deck so far?"`,
      responses: [
        {
          text: `"Line by line. Sports psych isn't magic â€” it's redundancy."`,
          label: 'DOUBLE DOWN',
          traitEffects: { swagger: 4, knowledge: 2 },
          partnerEffect: { impression: -3 },
          setFlags: { h1_swagger_double: true },
          shotModifier: -0.3,
          next: 'martin_skeptical',
        },
        {
          text: `"I watched a video on the Shinkansen. Close enough."`,
          label: 'DEFLECT WITH HUMOR',
          traitEffects: { humor: 5, swagger: -2 },
          partnerEffect: { impression: 5 },
          end: true,
        },
      ],
    },
    {
      id: 'martin_skeptical',
      speaker: 'martin',
      text: `"Interesting." He sips water like he's auditing it. "Number two is long. Show me redundancy."`,
      next: 'end_node',
    },
    {
      id: 'martin_after_course',
      speaker: 'martin',
      text: `Sato turns his head a fraction â€” acknowledgment without applause. Martin nods once. "You did homework. Most people only do scenery."`,
      responses: [
        {
          text: `"This isn't tourism for me. Takeda-Mori expects preparation."`,
          label: 'COURSE SCHOLAR',
          requires: { knowledge: 60 },
          traitEffects: { knowledge: 6, focus: 3 },
          partnerEffect: { impression: 3 },
          setFlags: { h1_deep_read: true },
          shotModifier: -0.5,
          end: true,
        },
        {
          text: `"The course is doing most of the talking. I'm just trying to listen."`,
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
      text: `Silence, but not empty â€” negotiation without words. Martin adjusts his glove. Sato studies a distant ridgeline. You realize you're being allowed to exist without performing.`,
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BETWEEN HOLES 2 â†’ 3
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DIALOGUE_AFTER_HOLE_2 = {
  id: 'after_h2',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `The path climbs toward the third tee. Cherry blossoms drift across the cart path like paper errors someone keeps resubmitting. Your phone buzzes once â€” Claire Okada, Martin's assistant, VK.`,
      next: 'claire_ping',
    },
    {
      id: 'claire_ping',
      speaker: 'narrator',
      text: `Preview: "Takeda deck on your phone? Martin asked me to confirm. Also â€” breathe. â€”C"`,
      responses: [
        {
          text: `[Fire back: "Deck is on my phone. Tell him green." ]`,
          label: 'PLAY ALONG',
          traitEffects: { focus: -2, swagger: 1 },
          partnerEffect: { impression: 2 },
          setFlags: { claire_contacted: true, cooperating_with_claire: true },
          next: 'martin_topic',
        },
        {
          text: `[Reply: "I'll send a clean PDF after the round." ]`,
          label: 'BOUNDARY',
          traitEffects: { zen: 2, focus: 1 },
          setFlags: { claire_contacted: true },
          next: 'martin_topic',
        },
        {
          text: `[Silence the phone. The ridgeline can wait.]`,
          label: 'FOCUS',
          traitEffects: { zen: 3, focus: 2 },
          next: 'martin_topic',
        },
      ],
    },
    {
      id: 'martin_topic',
      speaker: 'martin',
      text: (state) => {
        if (hasFlag(state, 'admitted_nerves')) return `"The shaking hands â€” are we done with that, or is it a recurring agenda item?"`;
        if (hasFlag(state, 'h1_claimed_prep')) return `"Your rehearsal narrative â€” still tracking? Or did reality add footnotes?"`;
        return `"You're analytics at VK. Mid-level. You report through Rina's shop, not mine â€” officially." He looks ahead. "Unofficially, I know your last three models. Interesting."`;
      },
      responses: [
        {
          text: `"You knew my project codes before I knew I was on this trip. That's not networking. That's a file."`,
          label: 'CALL IT OUT',
          traitEffects: { swagger: 3, focus: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { called_out_martin_research: true },
          next: 'martin_research_reply',
        },
        {
          text: `"Yes â€” analytics. If you already know the work, maybe we can skip the interview portion."`,
          label: 'STEADY',
          traitEffects: { zen: 2, knowledge: 2 },
          partnerEffect: { impression: 3 },
          next: 'martin_role_deep',
        },
        {
          text: `"What do you want me to say? I'm flattered you're paying attention."`,
          label: 'DEFLECT',
          traitEffects: { humor: 3, swagger: -1 },
          partnerEffect: { impression: 2 },
          next: 'martin_role_deep',
        },
      ],
    },
    {
      id: 'martin_research_reply',
      speaker: 'martin',
      text: `"LinkedIn is public. Your last conference deck leaked in a PDF cache. I did not break laws. I read."`,
      responses: [
        {
          text: `"Fair. Creepy, but fair."`,
          label: 'CLOSE TOPIC',
          traitEffects: { humor: 2, zen: 2 },
          partnerEffect: { impression: 3 },
          next: 'sato_bridge',
        },
      ],
    },
    {
      id: 'martin_role_deep',
      speaker: 'sato',
      text: `"A course like this punishes greed early," Sato says softly, as if commenting on weather. "People confuse reach with courage. Courage is knowing which risk is beneath you."`,
      responses: [
        {
          text: `"Is that golf advice or a memo?"`,
          label: 'WINK',
          traitEffects: { humor: 3, swagger: 2 },
          partnerEffect: { impression: 2 },
          shotModifier: -0.2,
          end: true,
        },
        {
          text: `"Then I'll stay beneath my risks until the number tells me otherwise."`,
          label: 'ALIGN',
          traitEffects: { knowledge: 4, zen: 3, focus: 2 },
          partnerEffect: { impression: 5 },
          setFlags: { h2_plays_smart: true },
          end: true,
        },
        {
          text: `"I'm trying to birdie my career out here. Forgive the reach."`,
          label: 'AGGRESSIVE',
          traitEffects: { swagger: 6, zen: -3 },
          partnerEffect: { impression: 2 },
          setFlags: { h2_going_low: true },
          shotModifier: -0.2,
          next: 'martin_bet_offer',
        },
      ],
    },
    {
      id: 'martin_bet_offer',
      speaker: 'martin',
      text: `"Birdie your career?" Martin's voice is flat. "Fine. Under par through nine â€” lunch is mine. Over â€” yours. Sato witnesses. No slides."`,
      responses: [
        {
          text: `"Witnessed. Hope your expense policy likes kaiseki."`,
          label: 'ACCEPT THE BET',
          traitEffects: { swagger: 5, focus: 3 },
          partnerEffect: { impression: 5 },
          setFlags: { bet_with_martin: true },
          end: true,
        },
        {
          text: `"I'd rather not turn today into a spreadsheet with appetizers."`,
          label: 'DECLINE',
          traitEffects: { zen: 4, swagger: -2 },
          partnerEffect: { impression: -1 },
          next: 'sato_bridge',
        },
      ],
    },
    {
      id: 'sato_bridge',
      speaker: 'narrator',
      text: `Sato waits while a maintenance cart passes â€” patience as power. The third tee comes into view: tighter than the card suggests.`,
      next: 'martin_warns_three',
    },
    {
      id: 'martin_warns_three',
      speaker: 'martin',
      text: `"Three plays uphill into a lie you can't see from here. Wind finds you even when you're sure it won't."`,
      responses: [
        {
          text: `"I'll club up and aim for the fat side."`,
          label: 'PRACTICAL',
          traitEffects: { knowledge: 4, focus: 3 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"If the wind is a partner, I'll stop fighting it for a line."`,
          label: 'ZEN',
          requires: { zen: 50 },
          traitEffects: { zen: 5, focus: 2 },
          partnerEffect: { impression: 3 },
          end: true,
        },
      ],
    },
  ],
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BETWEEN HOLES 3 â†’ 4
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DIALOGUE_AFTER_HOLE_3 = {
  id: 'after_h3',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `An old stone bridge spans a narrow gorge â€” lichen, moss, the sense that thousands of feet have crossed exactly where your spikes land. Sato slows. Martin slows too, uncharacteristically.`,
      next: 'sato_history',
    },
    {
      id: 'sato_history',
      speaker: 'sato',
      text: `"This club began as a retreat for industrialists who needed silence more than score," Sato says. "Silence became a brand. Now we rent it by the hour."`,
      responses: [
        {
          text: `"The history matters. It also prices out the people who built the silence."`,
          label: 'ENGAGE SATO',
          traitEffects: { knowledge: 3, zen: 2 },
          partnerEffect: { impression: 2 },
          next: 'sato_philosophy',
        },
        {
          text: `[Turn to Martin.] "Your read on the next hole â€” I'd rather hear your numbers than mine."`,
          label: 'DEFER TO BOSS',
          traitEffects: { focus: 3, swagger: -1 },
          partnerEffect: { impression: 5 },
          next: 'martin_after_defer',
        },
        {
          text: `[Nod, say nothing. Let the bridge hold all three of you.]`,
          label: 'SILENCE',
          traitEffects: { zen: 5 },
          partnerEffect: { impression: 3 },
          next: 'bridge_quiet',
        },
      ],
    },
    {
      id: 'sato_philosophy',
      speaker: 'sato',
      text: `"A fair point. But exclusivity is also a filter. The wrong people create noise. Noise kills deals." He looks past you â€” not through you. "Interesting filter, today."`,
      responses: [
        {
          text: `"I'll try not to be noise."`,
          label: 'HUMBLE',
          traitEffects: { zen: 4, focus: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { aware_sato_watching: true },
          end: true,
        },
      ],
    },
    {
      id: 'martin_after_defer',
      speaker: 'martin',
      text: `"Four is short on the card. Long in the mind." He doesn't thank you for the deference. He files it. "Pin front, ridge behind. Miss short, not long."`,
      responses: [
        {
          text: `"Short-side miss. Understood."`,
          label: 'EXECUTE',
          traitEffects: { knowledge: 4, focus: 3 },
          shotModifier: -0.4,
          end: true,
        },
      ],
    },
    {
      id: 'bridge_quiet',
      speaker: 'narrator',
      text: `Martin exhales through his nose â€” the smallest surrender. Sato smiles without teeth. The bridge does what bridges do: it keeps you from falling while you pretend you're not afraid of heights.`,
      next: 'h3_martin_four',
    },
    {
      id: 'h3_martin_four',
      speaker: 'martin',
      text: (state) => {
        if (hasFlag(state, 'bet_with_martin')) {
          const total = state.totalScore;
          if (total <= 0) return `"You're ${total === 0 ? 'even' : formatScore(total)}. The bet still breathes."`;
          return `"You're ${formatScore(total)}. My wallet is philosophically comfortable."`;
        }
        return `"Four is a postcard that bites. Choose your ego carefully."`;
      },
      responses: [
        {
          text: `"I'm taking less club and swinging smooth â€” let the ridge feed the ball."`,
          label: 'STRATEGIC',
          requires: { knowledge: 50 },
          traitEffects: { knowledge: 5, zen: 4, focus: 2 },
          partnerEffect: { impression: 5 },
          setFlags: { h4_play_smart: true },
          shotModifier: -0.4,
          end: true,
        },
        {
          text: `"I'm going at the pin. Short hole, short memory if it goes wrong."`,
          label: 'AGGRESSIVE',
          traitEffects: { swagger: 6, zen: -2, focus: -2 },
          partnerEffect: { impression: 3 },
          setFlags: { h4_pin_hunt: true },
          shotModifier: 0.4,
          next: 'martin_pin_hunt',
        },
        {
          text: `[Frame the volcano through your phone â€” one quiet shot for the people who aren't here.]`,
          label: 'TOURIST MOMENT',
          traitEffects: { zen: 4, focus: -3, humor: 2 },
          partnerEffect: { impression: 2 },
          setFlags: { h4_photo: true },
          end: true,
        },
      ],
    },
    {
      id: 'martin_pin_hunt',
      speaker: 'martin',
      text: `"Aggressive." Sato's eyes stay on your hands â€” not your face. "The mountain rewards commitment. It punishes theater."`,
      responses: [
        {
          text: `"Then I'll commit. No theater. Just math and contact."`,
          label: 'LOCK IN',
          traitEffects: { focus: 4, swagger: 3 },
          partnerEffect: { impression: 3 },
          setFlags: { aware_sato_watching: true },
          shotModifier: -0.2,
          end: true,
        },
        {
          text: `"You're right. I'll take the fat part of the green."`,
          label: 'WALK IT BACK',
          traitEffects: { knowledge: 3, zen: 3, swagger: -3 },
          shotModifier: -0.5,
          end: true,
        },
      ],
    },
  ],
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BETWEEN HOLES 4 â†’ 5
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DIALOGUE_AFTER_HOLE_4 = {
  id: 'after_h4',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: `The fifth tee opens onto air. The gorge inhales. Mist rises from below like a second sky. Martin sets his bag down with care â€” reverence or superstition, you can't tell.`,
      next: 'martin_topic',
    },
    {
      id: 'martin_topic',
      speaker: 'martin',
      text: `"VK lost a diligence fight on a bridge loan in '19 because someone chased yield in a crosswind." He watches your face, not the drop. "This is that shot. How do you feel?"`,
      responses: [
        {
          text: `"I feel clear. Fear is just incomplete data."`,
          label: 'FEARLESS',
          requires: { swagger: 50 },
          traitEffects: { swagger: 5, zen: 2 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.3,
          next: 'martin_fearless_reply',
        },
        {
          text: `"Honestly? I'd like to be teleported to the green."`,
          label: 'VULNERABLE',
          traitEffects: { humor: 5, zen: -3, swagger: -2 },
          partnerEffect: { impression: 6 },
          setFlags: { scared_of_five: true },
          next: 'martin_reassure',
        },
        {
          text: `"I've been thinking about my five-year plan more than this carry. That's probably wrong."`,
          label: 'CAREER REFLECTION',
          traitEffects: { knowledge: 3, focus: -1, zen: 2 },
          partnerEffect: { impression: 3 },
          setFlags: { reflected_on_career: true },
          next: 'martin_career_reply',
        },
        {
          text: `"What are you hitting â€” and why?"`,
          label: 'TACTICAL',
          traitEffects: { knowledge: 4, focus: 3 },
          partnerEffect: { impression: 2 },
          next: 'martin_clubs',
        },
      ],
    },
    {
      id: 'martin_fearless_reply',
      speaker: 'sato',
      text: `"Incomplete data," Sato repeats, tasting the phrase. "Then you are already ahead of most consultants."`,
      end: true,
    },
    {
      id: 'martin_reassure',
      speaker: 'martin',
      text: `"Good. Fear means you're awake." He hands you a tee. "Aim at the center of the safest color. Do not be interesting."`,
      responses: [
        {
          text: `"You say 'interesting' like it's a threat."`,
          label: 'PUSH BACK',
          traitEffects: { humor: 3, swagger: 2 },
          partnerEffect: { impression: 3 },
          end: true,
        },
        {
          text: `"Center color. Boring swing. I can do boring."`,
          label: 'GROUND',
          traitEffects: { zen: 4, focus: 3 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.3,
          end: true,
        },
      ],
    },
    {
      id: 'martin_career_reply',
      speaker: 'martin',
      text: `"Five-year plans are fiction. Quarterly plans are comedy." A pause. "Still, at least you're thinking in horizons. That's rarer than talent."`,
      responses: [
        {
          text: `"Horizons are just hazards with better branding."`,
          label: 'WIT',
          traitEffects: { humor: 4, knowledge: 2 },
          partnerEffect: { impression: 3 },
          end: true,
        },
      ],
    },
    {
      id: 'martin_clubs',
      speaker: 'martin',
      text: `"5-iron. Wind is helping until it isn't. If you steer, you add spin you can't afford."`,
      responses: [
        {
          text: `"I'll match your 5 and trust the number."`,
          label: 'MIRROR',
          traitEffects: { focus: 3, knowledge: 3 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.2,
          end: true,
        },
        {
          text: `"I'm one club less. I need to prove something to nobody."`,
          label: 'FLEX',
          requires: { swagger: 60 },
          traitEffects: { swagger: 5, focus: -2 },
          partnerEffect: { impression: -3 },
          setFlags: { h5_flex_club: true },
          shotModifier: 0.4,
          end: true,
        },
      ],
    },
  ],
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BETWEEN HOLES 5 â†’ 6
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DIALOGUE_AFTER_HOLE_5 = {
  id: 'after_h5',
  nodes: [
    {
      id: 'start',
      speaker: 'narrator',
      text: (state) => {
        const score5 = state.scorecard[4];
        const par5 = COURSE_DATA.holes[4].par;
        if (score5 !== null && score5 <= par5) {
          return `You walk off the fifth green. The gorge exhales without you. Somewhere, a crow sounds pleased with itself.`;
        }
        return `The fifth lets you leave anyway. Golf is rude that way. The path bends toward water â€” a mirror waiting to argue with your tempo.`;
      },
      next: 'martin_topic',
    },
    {
      id: 'martin_topic',
      speaker: 'martin',
      text: (state) => {
        if (hasFlag(state, 'scared_of_five')) {
          const score5 = state.scorecard[4];
          const par5 = COURSE_DATA.holes[4].par;
          if (score5 !== null && score5 <= par5) {
            return `"You were afraid," Martin says. "Then you executed. Interesting combination."`;
          }
          return `"Still breathing? Good. That's the minimum viable outcome."`;
        }
        if (hasFlag(state, 'h5_flex_club')) return `"Your club choice made a statement." He doesn't say whether it was literature or a memo.`;
        if (state.partner.impression >= 55) {
          return `"When I started VK," Martin says, not looking at you, "I told myself I was building shelter for competent people. Not empires. Shelter." He stops. "That sounds sentimental. Ignore half of it."`;
        }
        return `"Six is water and ego. Keep the first, lose the second."`;
      },
      responses: [
        {
          text: `"Shelter is load-bearing honesty. That's not sentimental. It's structural."`,
          label: 'EMPATHY',
          requires: (state) => state.partner.impression >= 55,
          traitEffects: { zen: 5, knowledge: 2 },
          partnerEffect: { impression: 6 },
          setFlags: { martin_family_story: true, empathized_with_martin: true },
          end: true,
        },
        {
          text: `"Six is water and ego â€” I'll keep the water."`,
          label: 'ACK',
          requires: (state) => state.partner.impression < 55,
          traitEffects: { zen: 3, focus: 3 },
          partnerEffect: { impression: 3 },
          end: true,
        },
        {
          text: `"Fear helped on five. I'm not proud of how sane that makes me."`,
          label: 'AFTERMATH',
          requires: (state) => hasFlag(state, 'scared_of_five'),
          traitEffects: { humor: 3, zen: 3 },
          partnerEffect: { impression: 4 },
          end: true,
        },
        {
          text: `"VK is an empire now whether you meant it or not."`,
          label: 'PROVOKE',
          requires: (state) => state.partner.impression >= 55,
          traitEffects: { swagger: 3, knowledge: 2 },
          partnerEffect: { impression: -2 },
          setFlags: { martin_family_story: true, missed_moment: true },
          end: true,
        },
        {
          text: `"Tell me the real sentence you didn't say."`,
          label: 'PRESS',
          requires: (state) => state.partner.impression >= 55 && state.traits.swagger >= 55,
          traitEffects: { swagger: 2, focus: 2 },
          partnerEffect: { impression: 4 },
          setFlags: { martin_family_story: true },
          next: 'martin_family_more',
        },
      ],
    },
    {
      id: 'martin_family_more',
      speaker: 'martin',
      text: `"The real sentence is that I started VK because I was tired of being someone's appendix." His laugh is dry soil. "There. Career therapy. Invoice Claire."`,
      responses: [
        {
          text: `"Then today's round is the opposite of an appendix. It's the main body."`,
          label: 'EMPATHETIC',
          traitEffects: { zen: 5, humor: 1 },
          partnerEffect: { impression: 8 },
          setFlags: { empathized_with_martin: true },
          end: true,
        },
        {
          text: `"Good to know my boss has origin lore."`,
          label: 'LIGHT',
          traitEffects: { humor: 3 },
          partnerEffect: { impression: 4 },
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
      text: `The sixth hugs a lake so still it looks staged. Cherry petals float on the water like rejected cover sheets. Sato's phone vibrates once — a sound too polite to be ignored.`,
      next: 'sato_excuse',
    },
    {
      id: 'sato_excuse',
      speaker: 'narrator',
      text: `Sato bows slightly. "Forgive me — Tokyo." He steps onto the path ahead, voice low, syllables you don't need to understand to recognize weight.`,
      next: 'claire_h6',
    },
    {
      id: 'claire_h6',
      speaker: 'narrator',
      text: `Your phone lights up. Claire: "Takeda-Mori asked for a clean timeline narrative by close. I can keep it fuzzy if you text YES. No one else sees this thread. —C"`,
      responses: [
        {
          text: `[Text YES. Let her handle the thread.]`,
          label: 'DEAL',
          traitEffects: { focus: -3, swagger: 1 },
          partnerEffect: { impression: 1 },
          setFlags: { claire_contacted: true, cooperating_with_claire: true, accepted_claire_deal: true },
          next: 'martin_private',
        },
        {
          text: `[Text: "No. I'll own the timeline after the round."]`,
          label: 'REFUSE',
          traitEffects: { zen: 2, focus: 2 },
          setFlags: { claire_contacted: true },
          next: 'martin_private',
        },
        {
          text: `[Archive the message unread. The lake is loud enough.]`,
          label: 'SILENCE',
          traitEffects: { zen: 4, focus: 1 },
          next: 'martin_private',
        },
      ],
    },
    {
      id: 'martin_private',
      speaker: 'martin',
      onEnter: (state) => {
        setFlag(state, 'sato_stepped_away_h6', true);
      },
      text: (state) => {
        if (hasFlag(state, 'accepted_claire_deal')) {
          return `"Claire is efficient." Martin doesn't look at your pocket. "Efficiency is a kind of love language. Be careful who you let translate."`;
        }
        return `"VK is not immortal," Martin says, too calmly. "Partnerships like Takeda-Mori — they don't fail in boardrooms. They fail in small moments. Like this walk."`;
      },
      responses: [
        {
          text: `"Sometimes I don't know if I'm building a career or renting one."`,
          label: 'DOUBT',
          traitEffects: { zen: 4, swagger: -2 },
          partnerEffect: { impression: 7 },
          setFlags: { shared_doubt_with_martin: true },
          next: 'martin_doubt_reply',
        },
        {
          text: `"Then we make this walk count. Small moment, clean swing."`,
          label: 'GROUND',
          traitEffects: { zen: 5, focus: 3 },
          partnerEffect: { impression: 6 },
          setFlags: { grounded_martin: true },
          end: true,
        },
        {
          text: `"Is that vulnerability, or are you testing whether I flinch?"`,
          label: 'CALL OUT',
          requires: { knowledge: 55 },
          traitEffects: { knowledge: 4, swagger: 2 },
          partnerEffect: { impression: 3 },
          next: 'martin_test_reply',
        },
      ],
    },
    {
      id: 'martin_doubt_reply',
      speaker: 'martin',
      text: `"Rent is honest. Ownership is a story we tell so we can sleep." He adjusts his glove. "Interesting doubt. Don't put it in the deck."`,
      end: true,
    },
    {
      id: 'martin_test_reply',
      speaker: 'martin',
      text: `"Yes." No pause. "Both."`,
      end: true,
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
      text: `Paper lanterns hang along the short seventh — soft light against the ridge. The hole is a haiku: short, disciplined, easy to ruin with ambition.`,
      next: 'martin_topic',
    },
    {
      id: 'martin_topic',
      speaker: 'martin',
      text: (state) => {
        if (hasFlag(state, 'grounded_martin')) {
          return `"You grounded me back there," Martin says quietly. "I don't like needing that. I needed it anyway."`;
        }
        if (hasFlag(state, 'bet_with_martin')) {
          const score = state.totalScore;
          return `"Scorecheck: ${formatScore(score)}. ${score <= 0 ? "The bet is alive. So are my ulcers." : "The bet is comfortable. For me."}"`;
        }
        return `"Short hole. Big silence." He watches the lantern light on the water. "Pick a club and mean it."`;
      },
      responses: [
        {
          text: `"Wedge. Full. No story."`,
          label: 'COMMIT',
          traitEffects: { focus: 4, swagger: 2 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.4,
          end: true,
        },
        {
          text: `"Sato's still on his call. We're being watched by the course itself."`,
          label: 'PARANOID ZEN',
          traitEffects: { zen: 4, focus: 2 },
          setFlags: { aware_sato_watching: true },
          next: 'sato_returns',
        },
        {
          text: `"If I shank this, I'm changing my name and moving to Hokkaido."`,
          label: 'GALLOWS',
          requires: { humor: 50 },
          traitEffects: { humor: 5, zen: -2 },
          partnerEffect: { impression: 4 },
          setFlags: { h7_shank_joke: true },
          end: true,
        },
        {
          text: `"I'm going to stand here ten seconds and pretend nothing on my phone exists."`,
          label: 'PRESENCE',
          requires: { zen: 50 },
          traitEffects: { zen: 5, focus: 2 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.3,
          end: true,
        },
      ],
    },
    {
      id: 'sato_returns',
      speaker: 'sato',
      text: `Sato reappears at the cart path, pocketing his phone. "The shortest holes ask the longest questions," he says. "Answer with your feet, not your resume."`,
      responses: [
        {
          text: `"Then my feet say: middle of the green."`,
          label: 'AGREE',
          traitEffects: { knowledge: 3, zen: 3 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"My resume is already in the lake."`,
          label: 'JOKE',
          traitEffects: { humor: 4, swagger: 1 },
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
        if (score8 !== null && score8 <= par8) {
          return `You walk off the eighth green along the volcanic ridgeline. The drop-off doesn't negotiate. Neither did that putt.`;
        }
        return `Eight releases you back to solid earth — a cruel kindness. Mist gathers in the trees like an NDA you never signed.`;
      },
      next: 'martin_topic',
    },
    {
      id: 'martin_topic',
      speaker: 'martin',
      text: (state) => {
        if (hasFlag(state, 'h7_shank_joke')) return `"Hokkaido can wait," Martin says. "You survived seven first."`;
        if (hasFlag(state, 'bet_with_martin')) {
          const score = state.totalScore;
          return `"Last hole of the front. ${formatScore(score)}. ${score <= 0 ? "My wallet is in danger. Interesting." : "Still time. Interesting."}"`;
        }
        return `"Nine is business length. Wind off the ridge. Don't romanticize the landing zone."`;
      },
      responses: [
        {
          text: `"I don't want this round to end."`,
          label: 'SENTIMENTAL',
          traitEffects: { zen: 5, humor: 2 },
          partnerEffect: { impression: 6 },
          setFlags: { sentimental_9: true },
          next: 'martin_sentimental',
        },
        {
          text: `"One more. Clean card, clean story for Tokyo."`,
          label: 'CLOSE STRONG',
          traitEffects: { focus: 4, swagger: 3 },
          partnerEffect: { impression: 3 },
          shotModifier: -0.3,
          end: true,
        },
        {
          text: `"Martin — whatever happens on nine, thank you for today. I mean it."`,
          label: 'THANK',
          traitEffects: { zen: 4, humor: 2 },
          partnerEffect: { impression: 8 },
          setFlags: { thanked_martin: true },
          next: 'martin_thanked',
        },
        {
          text: `"Talk me through nine like a diligence memo: hazards, bailout, intent."`,
          label: 'ANALYTICAL',
          requires: { knowledge: 55 },
          traitEffects: { knowledge: 5, focus: 4 },
          partnerEffect: { impression: 2 },
          shotModifier: -0.4,
          next: 'martin_nine_brief',
        },
        {
          text: `"If I miss left, I'm volunteering as tribute to the volcano."`,
          label: 'GALLOWS',
          requires: { humor: 55 },
          traitEffects: { humor: 6, zen: -1 },
          partnerEffect: { impression: 5 },
          setFlags: { gallows_humor_8: true },
          end: true,
        },
      ],
    },
    {
      id: 'martin_sentimental',
      speaker: 'martin',
      text: (state) => {
        if (hasFlag(state, 'martin_family_story')) return `"Rounds end," Martin says. "That's why people like us over-schedule. My mother used to call golf 'negotiated loss.' She wasn't wrong."`;
        return `"Neither do I." He looks at the lanterns behind you as if they're inventory. "But loss is coming. Might as well name it."`;
      },
      responses: [
        {
          text: `"Negotiated loss still beats unnegotiated chaos."`,
          label: 'CALLBACK',
          requiresFlag: 'martin_family_story',
          traitEffects: { zen: 4, knowledge: 2 },
          partnerEffect: { impression: 6 },
          end: true,
        },
        {
          text: `"Then let's make the last hole honest."`,
          label: 'RESOLVE',
          traitEffects: { focus: 4, swagger: 2 },
          shotModifier: -0.3,
          end: true,
        },
      ],
    },
    {
      id: 'martin_thanked',
      speaker: 'martin',
      text: (state) => {
        const imp = state.partner.impression;
        if (imp >= 70) return `Martin stops. Actually stops. "You're welcome." Two words, fully audited. "VK could use more people who say what they mean. Dangerous habit."`;
        return `"Noted." He almost smiles. "Let's finish before the mist makes us poetic."`;
      },
      end: true,
    },
    {
      id: 'martin_nine_brief',
      speaker: 'martin',
      text: `"Driver for position, not theater. Center ridge line. Approach plays shorter than the card — altitude steals yardage. Miss short. Long is a story you don't want told."`,
      responses: [
        {
          text: `"Center ridge. Short miss. Intent clear."`,
          label: 'LOCKED',
          traitEffects: { knowledge: 4, focus: 4 },
          partnerEffect: { impression: 4 },
          shotModifier: -0.5,
          end: true,
        },
        {
          text: `"Or I could just hit it hard and hope the mountain forgives me."`,
          label: 'CHAOS',
          traitEffects: { swagger: 4, zen: -1 },
          partnerEffect: { impression: 1 },
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
