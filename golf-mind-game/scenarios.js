// ─── Swing Thought Scenarios ───
// baseQualityIndex: 0=perfect, 1=great, 2=good, 3=okay, 4=bad, 5=terrible, 6=shank

const TEE_THOUGHTS = {
  generic: [
    {
      setup: `Backswing. Cherry branches overhead. Your mind wanders...`,
      choices: [
        {
          text: `Breathe. Trust the line. One smooth tempo.`,
          label: 'SWING THOUGHT',
          baseQualityIndex: 1,
          traitEffects: { focus: 5, knowledge: 3 },
          resultNarrative: {
            good: `Clean contact. Ball rides the fairway's spine.`,
            bad: `Rushed the transition. Leaks toward the bamboo.`,
          },
        },
        {
          text: `This is Fujo. Make it count.`,
          label: 'FUJO SWAGGER',
          baseQualityIndex: 2,
          traitEffects: { swagger: 6, zen: 3, focus: 2 },
          resultNarrative: {
            good: `Ball floats high, finds short grass. Sato watches the whole flight.`,
            bad: `Quick at the top. Polite fade toward the rough.`,
          },
        },
        {
          text: `Claire's text. The 3am ceiling. Jet lag.`,
          label: 'DISTRACTION',
          baseQualityIndex: 5,
          traitEffects: { focus: -8, humor: 4, zen: -3 },
          partnerEffect: { impression: 4 },
          resultNarrative: {
            good: `Body swings on autopilot. Ball finds the grass somehow.`,
            bad: `Over the top. Ball chases bamboo shadows.`,
          },
        },
        {
          text: `Kanji on the scorecard you can't read. You don't belong on this tee sheet.`,
          label: 'FOREIGN WEIGHT',
          baseQualityIndex: 4,
          traitEffects: { focus: -5, zen: -4, humor: 2 },
          resultNarrative: {
            good: `Discomfort sharpens you. Down the middle.`,
            bad: `Steering. Ball starts left and keeps going.`,
          },
        },
      ],
    },
    {
      setup: `Top of the backswing. Mist in the pines. A thought arrives uninvited...`,
      choices: [
        {
          text: `Martin is watching. Sato is measuring. Swing your swing.`,
          label: 'EVALUATION',
          baseQualityIndex: 4,
          traitEffects: { focus: -5, zen: -4, swagger: 2 },
          resultNarrative: {
            good: `Pressure becomes focus. Flushed. Martin's nod is almost imperceptible.`,
            bad: `Grip tightens. Pull toward the treeline.`,
          },
        },
        {
          text: `Spine angle. Hands lead. Accelerate through.`,
          label: 'TECHNICAL',
          baseQualityIndex: 1,
          traitEffects: { knowledge: 5, focus: 4 },
          resultNarrative: {
            good: `Textbook. High flight, soft descent.`,
            bad: `Too many checkpoints. Caught it heavy.`,
          },
        },
        {
          text: `Bamboo rustles. No wind. You want stillness.`,
          label: 'ZEN DISTRACTION',
          baseQualityIndex: 3,
          traitEffects: { zen: 6, focus: -3, humor: 3 },
          partnerEffect: { impression: 3 },
          resultNarrative: {
            good: `Soft hands, borrowed calm. Sato: "Nice tempo."`,
            bad: `Lower body quits early. Thin bullet through shadow.`,
          },
        },
        {
          text: `Send it. For the swing you'll replay in the hotel bar at midnight.`,
          label: 'SEND IT',
          baseQualityIndex: 3,
          traitEffects: { swagger: 6, focus: -3, zen: -2 },
          resultNarrative: {
            good: `Crack echoes off the ridge. Ball chases the horizon.`,
            bad: `Power without sequence. Hooks toward trouble.`,
          },
        },
      ],
    },
  ],

  holeSpecific: {
    5: [
      {
        setup: `The Gorge. 185 yards over the void. Long iron. Pin floats in cloud.`,
        choices: [
          {
            text: `Aim right of the pin. The shelf is wider. Commit.`,
            label: 'COURSE MANAGEMENT',
            baseQualityIndex: 1,
            traitEffects: { knowledge: 6, focus: 4, zen: 3 },
            resultNarrative: {
              good: `Safe side of the green. Straightforward putt.`,
              bad: `Catches the fringe. On, but barely.`,
            },
          },
          {
            text: `Straight at the pin. If you can see it, the shot exists.`,
            label: 'AGGRESSIVE',
            baseQualityIndex: 2,
            traitEffects: { swagger: 5, focus: 2 },
            resultNarrative: {
              good: `Pin-high. Sato inclines his head.`,
              bad: `Drifts. Short-sided against the sky.`,
            },
          },
          {
            text: `The gorge is bottomless. Don't look. Why are you looking?`,
            label: 'VERTIGO',
            baseQualityIndex: 5,
            traitEffects: { focus: -8, zen: -6, humor: 4 },
            partnerEffect: { impression: 4 },
            resultNarrative: {
              good: `Carries. Barely. Front of the green.`,
              bad: `Comes up short. Kisses rock. Gone.`,
            },
          },
          {
            text: `Earth and air. Breathe once. Swing once.`,
            label: 'ZEN',
            baseQualityIndex: 1,
            traitEffects: { zen: 8, focus: 4 },
            resultNarrative: {
              good: `Clean parabola. Mid-green. The mist feels like privacy.`,
              bad: `Thin. Skates low, releases long.`,
            },
          },
        ],
      },
    ],
    8: [
      {
        setup: `The Ridge. 435 yards along the volcanic spine. Wind finds you.`,
        choices: [
          {
            text: `Pick the lone pine. Aim. Commit.`,
            label: 'PICK A TARGET',
            baseQualityIndex: 1,
            traitEffects: { focus: 5, knowledge: 4 },
            resultNarrative: {
              good: `Rides the wind. Settles on the fairway.`,
              bad: `Hands flinch. Push to the right rough.`,
            },
          },
          {
            text: `This is the shot you'll replay at midnight.`,
            label: 'MAIN CHARACTER',
            baseQualityIndex: 2,
            traitEffects: { swagger: 7, humor: 3, zen: -2 },
            partnerEffect: { impression: 5 },
            resultNarrative: {
              good: `High draw against the ridge wind. Sato watches every yard.`,
              bad: `Movie in your head is 4K. Swing is buffering.`,
            },
          },
          {
            text: `What if it goes over the edge? Stop spiraling. Stop—`,
            label: 'CATASTROPHIZING',
            baseQualityIndex: 5,
            traitEffects: { focus: -7, zen: -8 },
            resultNarrative: {
              good: `Fear borrows speed. Clears trouble. Heart hammers.`,
              bad: `Tentative. Low leak toward the wrong side.`,
            },
          },
          {
            text: `Feet on the ridge. Wind on face. Inhale. Commit.`,
            label: 'MINDFULNESS',
            baseQualityIndex: 1,
            traitEffects: { zen: 8, focus: 4 },
            resultNarrative: {
              good: `Splits the fairway. Martin walks without comment.`,
              bad: `Hang back. Push into the left rough.`,
            },
          },
        ],
      },
    ],
  },
};

const APPROACH_THOUGHTS = {
  generic: [
    {
      setup: `Approach shot. Club selected. Backswing begins...`,
      choices: [
        {
          text: `See the flight. High, soft, one hop and check.`,
          label: 'VISUALIZATION',
          baseQualityIndex: 1,
          traitEffects: { focus: 4, knowledge: 3 },
          resultNarrative: {
            good: `Lands past the pin, spins back. Textbook.`,
            bad: `Comes out low. Chases through to the fringe.`,
          },
        },
        {
          text: `Club up. Eighty percent. Better long than bunker.`,
          label: 'SMART PLAY',
          baseQualityIndex: 1,
          traitEffects: { knowledge: 5, zen: 3 },
          resultNarrative: {
            good: `Pin-high. Smart play looks like talent.`,
            bad: `Still swung hard. Sails long.`,
          },
        },
        {
          text: `Vending machine melody from the halfway house. In your head now.`,
          label: 'DISTRACTION',
          baseQualityIndex: 4,
          traitEffects: { focus: -6, humor: 5 },
          partnerEffect: { impression: 3 },
          resultNarrative: {
            good: `On the green despite the earworm.`,
            bad: `Chunked. Ball dies in the apron.`,
          },
        },
        {
          text: `Pin's tucked. Go at it. Make the number.`,
          label: 'FLAG HUNTER',
          baseQualityIndex: 2,
          traitEffects: { swagger: 5, focus: 2 },
          resultNarrative: {
            good: `Checks ten feet below the hole. Sato: "Aggressive."`,
            bad: `Find sand. Polite kind. Still costs a stroke.`,
          },
        },
      ],
    },
  ],
};

const PUTT_THOUGHTS = {
  generic: [
    {
      setup: `Over the putt. Putter back...`,
      choices: [
        {
          text: `Pick a spot. Roll it over the spot. Let the hole happen.`,
          label: 'SPOT PUTTING',
          baseQualityIndex: 1,
          traitEffects: { focus: 4, knowledge: 4 },
          resultNarrative: {
            good: `Over the spot. Into the cup.`,
            bad: `Line right, pace wrong. Knee-knocker coming back.`,
          },
        },
        {
          text: `Die it in. Soft hands. Let gravity work.`,
          label: 'FEEL PLAYER',
          baseQualityIndex: 2,
          traitEffects: { zen: 4, swagger: 2 },
          resultNarrative: {
            good: `Loses speed, kisses the edge, drops.`,
            bad: `Too much respect. Dies a foot short.`,
          },
        },
        {
          text: `Your wrists feel wrong. It's only four feet. It's only everything.`,
          label: 'THE YIPS',
          baseQualityIndex: 5,
          traitEffects: { zen: -6, focus: -5 },
          resultNarrative: {
            good: `Stroke stutters. Line holds. Rattles in.`,
            bad: `A jab. Three feet by.`,
          },
        },
        {
          text: `Sato is watching your routine. Are you grounding the putter wrong?`,
          label: 'OVERTHINKING',
          baseQualityIndex: 4,
          traitEffects: { focus: -5, humor: 5 },
          partnerEffect: { impression: -2 },
          resultNarrative: {
            good: `Stop thinking. Roll it. In.`,
            bad: `Freeze between customs and contact. Pushed short.`,
          },
        },
      ],
    },
  ],
};

const BETWEEN_HOLES_DIALOGUE = {
  moods: {
    great: [
      `Martin: "That was impressive. Keep that tempo."`,
      `Sato falls into step. "Discipline today." Martin glances over.`,
      `Martin puts his phone away unread. "Claire can wait."`,
    ],
    good: [
      `Martin: "Solid. That kind of golf makes the flight shorter."`,
      `Sato: "Nice shot." Martin, quieter: "He doesn't say that often."`,
    ],
    neutral: [
      `Martin talks about the course routing. Sato listens. Safe territory.`,
      `"The air up here," Sato says. None of you mention the score.`,
    ],
    annoyed: [
      `Martin checks his phone mid-fairway. Sato fills the silence with weather.`,
      `Martin's pace quickens. "Losing light." The sky disagrees.`,
    ],
    cold: [
      `Martin walks ahead. Sato lingers. "The mountain is patient."`,
      `Martin doesn't slow down. Sato makes small talk about tea.`,
    ],
  },
};

function getScenario(type, holeNumber) {
  let pool;
  if (type === 'tee') {
    const holeSpecific = TEE_THOUGHTS.holeSpecific[holeNumber];
    if (holeSpecific && holeSpecific.length > 0) {
      return holeSpecific[Math.floor(Math.random() * holeSpecific.length)];
    }
    pool = TEE_THOUGHTS.generic;
  } else if (type === 'approach') {
    pool = APPROACH_THOUGHTS.generic;
  } else if (type === 'putt') {
    pool = PUTT_THOUGHTS.generic;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function getBetweenHolesDialogue(mood) {
  const lines = BETWEEN_HOLES_DIALOGUE.moods[mood] || BETWEEN_HOLES_DIALOGUE.moods.neutral;
  return lines[Math.floor(Math.random() * lines.length)];
}
