// ─── Panic Attack System ───
// Multi-phase psychological event: ONSET → SPIRAL → THE VOID → RECOVERY
// Triggers when zen < 15 AND focus < 20. Each attack is unique to the
// game state that caused it. David Lynch meets late-night Adult Swim.

const PANIC_TRIGGERS = {
  check(state) {
    if (state.panicAttackActive || state.panicCooldown > 0) return false;
    return state.traits.zen < 15 && state.traits.focus < 20;
  },
};

// ─── Onset Scripts ───
// Fragmented text that plays line-by-line with glitch timing.
// Each line is { text, delay, cssClass }.
function getPanicOnset(state) {
  const hole = COURSE_DATA.holes[state.currentHole];
  const holeNum = hole ? hole.number : '?';

  if (hasFlag(state, 'accepted_claire_deal')) {
    return {
      type: 'guilt',
      lines: [
        { text: 'Your hands are—', delay: 400, css: 'panic-frag' },
        { text: 'Your hands are—', delay: 300, css: 'panic-frag' },
        { text: 'Your hands are not your hands.', delay: 600, css: 'panic-line' },
        { text: 'You told Claire you would circle back. You told yourself that was neutral.', delay: 800, css: 'panic-line' },
        { text: 'Martin is five feet away. Martin does not know the whole map.', delay: 700, css: 'panic-line' },
        { text: `Martin is five feet away on hole ${holeNum} at Fujo and the acquisition is a word you can taste—`, delay: 900, css: 'panic-line' },
        { text: 'The air tastes like the inside of the Voss-Kellner Tokyo office, third floor, the one with the window facing the train tracks.', delay: 700, css: 'panic-lynch' },
        { text: 'You can hear fluorescent lights. There are no fluorescent lights.', delay: 800, css: 'panic-lynch' },
      ],
    };
  }

  if (state.totalScore >= 5) {
    return {
      type: 'performance',
      lines: [
        { text: 'Your chest is—', delay: 400, css: 'panic-frag' },
        { text: 'Your chest—', delay: 200, css: 'panic-frag' },
        { text: 'Something is sitting on your chest.', delay: 600, css: 'panic-line' },
        { text: `Plus ${state.totalScore}. You are plus ${state.totalScore} at Fujo.`, delay: 800, css: 'panic-line' },
        { text: 'The scorecard is a performance review. The scorecard has always been a performance review.', delay: 900, css: 'panic-lynch' },
        { text: 'Claire is reading your scorecard through your phone. The pixels are warm.', delay: 900, css: 'panic-lynch' },
        { text: 'Every stroke is a line item. Every bogey is a quarterly result.', delay: 700, css: 'panic-line' },
        { text: 'A temple bell answers somewhere. Cicadas. Bamboo rustling. It sounds like applause. Or the opposite of applause.', delay: 800, css: 'panic-lynch' },
      ],
    };
  }

  if (hasFlag(state, 'aware_sato_watching')) {
    return {
      type: 'impostor',
      lines: [
        { text: 'Sato is—', delay: 400, css: 'panic-frag' },
        { text: 'Sato is watching and you are—', delay: 500, css: 'panic-frag' },
        { text: 'You are not supposed to be here.', delay: 700, css: 'panic-line' },
        { text: 'Everyone at Fujo International Golf Club knows how to hold a club. You are holding it wrong.', delay: 800, css: 'panic-line' },
        { text: 'You have always been holding it wrong.', delay: 600, css: 'panic-lynch' },
        { text: 'Sato can see the way you hold it. He does not need a notebook. He is the notebook.', delay: 900, css: 'panic-lynch' },
        { text: 'The cherry blossoms are too perfect. The fairways are too manicured. Like a painting you walked into. You are inside the painting.', delay: 900, css: 'panic-lynch' },
        { text: 'You can\'t feel your feet.', delay: 500, css: 'panic-line' },
      ],
    };
  }

  if (state.partner.impression < 25) {
    return {
      type: 'isolation',
      lines: [
        { text: 'Martin hasn\'t—', delay: 300, css: 'panic-frag' },
        { text: 'When was the last time Martin—', delay: 400, css: 'panic-frag' },
        { text: 'Martin hasn\'t looked at you since the last hole. Or the one before.', delay: 800, css: 'panic-line' },
        { text: 'You are alone at Fujo with a co-founder who is pretending you don\'t exist.', delay: 900, css: 'panic-line' },
        { text: 'The mountain is the loneliest sound you\'ve ever heard.', delay: 700, css: 'panic-lynch' },
        { text: 'Somewhere a phone is ringing—hotel hallway, 3 AM, wrong country. It might be yours. It might be from 1997.', delay: 800, css: 'panic-lynch' },
        { text: 'The gravel path goes on forever. You\'ve been walking forever.', delay: 700, css: 'panic-line' },
        { text: 'Your shadow is slightly ahead of you. It shouldn\'t be.', delay: 600, css: 'panic-lynch' },
      ],
    };
  }

  // Default existential panic
  return {
    type: 'void',
    lines: [
      { text: 'Something is—', delay: 300, css: 'panic-frag' },
      { text: 'Something—', delay: 200, css: 'panic-frag' },
      { text: 'Something is wrong and you can\'t—', delay: 500, css: 'panic-frag' },
      { text: 'You can\'t identify what is wrong because everything is wrong.', delay: 800, css: 'panic-line' },
      { text: `You are standing on hole ${holeNum}. You think. The number doesn't feel right.`, delay: 800, css: 'panic-line' },
      { text: 'The fairway is a corridor in a Japanese business hotel. The green is the tatami room from the ryokan.', delay: 700, css: 'panic-lynch' },
      { text: 'You have a meeting at the Takeda-Mori building with someone whose name you can\'t—', delay: 600, css: 'panic-lynch' },
      { text: 'The wind stops. Everything stops. Except your heart. Your heart does not stop.', delay: 900, css: 'panic-line' },
    ],
  };
}

// ─── Spiral Thoughts ───
// Three rounds of 800ms micro-thought selection. All options are bad.
// Round 1: some okay options. Round 2: fewer. Round 3: all terrible.
function getPanicSpiralRounds(state, onsetType) {
  const rounds = [];

  // Round 1 — the mind races
  rounds.push({
    label: 'YOUR MIND IS RACING',
    timerMs: 900,
    thoughts: [
      { text: 'BREATHE.', quality: 0.3, category: 'anxiety', traitEffects: { zen: -1 }, recovery: 2 },
      { text: 'Stop it stop it.', quality: 0.8, category: 'anxiety', traitEffects: { zen: -3, focus: -2 }, recovery: 0 },
      { text: 'Count to ten.', quality: 0.2, category: 'focus', traitEffects: { focus: 1 }, recovery: 3 },
      { text: 'Nobody sees.', quality: 0.5, category: 'anxiety', traitEffects: { swagger: -2 }, recovery: 1 },
      { text: 'What\'s happening?', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3 }, recovery: 0 },
      { text: 'Walk it off.', quality: 0.3, category: 'neutral', traitEffects: { zen: 1 }, recovery: 2 },
      { text: 'NOT NOW.', quality: 0.7, category: 'anxiety', traitEffects: { zen: -2, swagger: -1 }, recovery: 0 },
      { text: 'Feet on ground.', quality: 0.1, category: 'focus', traitEffects: { zen: 2 }, recovery: 4 },
    ],
  });

  // Round 2 — losing control
  const r2Corporate = hasFlag(state, 'cooperating_with_claire')
    ? { text: 'Be professional.', quality: 0.9, category: 'anxiety', traitEffects: { zen: -4, focus: -2 }, recovery: -1 }
    : { text: 'This is fine.', quality: 0.6, category: 'anxiety', traitEffects: { zen: -2 }, recovery: 0 };

  rounds.push({
    label: 'THE BACKSWING WON\'T STOP',
    timerMs: 800,
    thoughts: [
      { text: 'I can\'t—', quality: 1.0, category: 'anxiety', traitEffects: { zen: -4, focus: -3 }, recovery: -1 },
      { text: 'Just breathe.', quality: 0.4, category: 'focus', traitEffects: { zen: 1 }, recovery: 2 },
      r2Corporate,
      { text: 'Martin. Look at Martin.', quality: 0.3, category: 'focus', traitEffects: { focus: 1 }, recovery: 3 },
      { text: 'Am I dying?', quality: 1.2, category: 'anxiety', traitEffects: { zen: -5, focus: -4 }, recovery: -2 },
      { text: 'The mountain.', quality: 0.2, category: 'neutral', traitEffects: { zen: 2 }, recovery: 3 },
      { text: 'EVERYONE SEES.', quality: 1.1, category: 'anxiety', traitEffects: { zen: -4, swagger: -4 }, recovery: -2 },
      { text: 'Five things I see.', quality: 0.1, category: 'focus', traitEffects: { focus: 2, zen: 1 }, recovery: 4 },
    ],
  });

  // Round 3 — the pit
  const r3Claire = hasFlag(state, 'accepted_claire_deal')
    ? { text: 'Claire knows.', quality: 1.3, category: 'anxiety', traitEffects: { zen: -5, focus: -5 }, recovery: -3 }
    : { text: 'Make it stop.', quality: 1.0, category: 'anxiety', traitEffects: { zen: -3, focus: -3 }, recovery: -1 };

  rounds.push({
    label: 'THE GROUND IS MOVING',
    timerMs: 700,
    thoughts: [
      { text: 'LET GO.', quality: 0.3, category: 'neutral', traitEffects: { zen: 2 }, recovery: 3 },
      r3Claire,
      { text: 'Heart. Heart. Heart.', quality: 1.2, category: 'anxiety', traitEffects: { zen: -5 }, recovery: -2 },
      { text: 'I am here.', quality: 0.0, category: 'focus', traitEffects: { focus: 2, zen: 2 }, recovery: 5 },
      { text: 'Run.', quality: 1.4, category: 'anxiety', traitEffects: { zen: -6, swagger: -5 }, recovery: -3 },
      { text: 'Grass. Smell the grass.', quality: 0.1, category: 'focus', traitEffects: { zen: 3 }, recovery: 4 },
      { text: 'Please please please.', quality: 1.1, category: 'anxiety', traitEffects: { zen: -4 }, recovery: -2 },
      { text: 'It will pass.', quality: 0.2, category: 'neutral', traitEffects: { zen: 2, focus: 1 }, recovery: 3 },
    ],
  });

  return rounds;
}

// ─── The Void ───
// Lynchian surreal interlude between spiral and recovery.
// One passage, then one binary choice.
function getPanicVoid(state, onsetType, recoveryScore) {
  if (onsetType === 'guilt') {
    return {
      passage: [
        'The fairway is gone.',
        'You are in the Voss-Kellner Tokyo office.',
        'The fluorescent light hums at 60 hertz. You know the exact frequency because you counted once during a meeting about Q3 projections.',
        'Claire is at the head of the table. She\'s smiling. Her teeth are very white.',
        '"We\'re so glad you could join us," she says. She\'s looking through you. At the wall behind you. At something on the wall behind you.',
        'You turn around. The wall is a window. Through the window: Fujo, the mountain beyond—the ridgeline, the mist. Hole ' + (state.currentHole + 1) + '. Martin is out there, alone, lining up a putt.',
        'He looks up. He can see you through the window.',
        'He waves.',
        'Claire\'s hand is on your shoulder. It\'s been there for a while.',
        '"Shall we continue?" she says. She means the round. She means the meeting. She means everything.',
      ],
      choices: [
        { text: 'Go back to the course.', label: 'RETURN', effect: 'ground', traitEffects: { zen: 5, focus: 3 }, partnerEffect: 0 },
        { text: 'Stay in the Tokyo office.', label: 'SURRENDER', effect: 'dissociate', traitEffects: { zen: -2, swagger: -3 }, partnerEffect: -5 },
      ],
    };
  }

  if (onsetType === 'performance') {
    return {
      passage: [
        'The scorecard is floating.',
        'It\'s in front of you. Eye level. The numbers are large and red.',
        'Behind the scorecard: the mountain. Behind the mountain: clouds. Behind the clouds: nothing. The world ends at the ridgeline.',
        'Your score is written in a font you recognize from performance reviews.',
        'Calibri. 11 point. The font of corporate evaluation.',
        'A voice that sounds like the office printer says: "Please see me regarding your Q4 results."',
        'You look down. You\'re standing on a putting green. Or tatami. The tatami from the ryokan last night.',
        'It\'s the same shade of green. It has always been the same shade of green.',
        'Martin is somewhere. You can hear his laugh. It sounds normal. Normal is the most terrifying sound.',
      ],
      choices: [
        { text: 'Tear up the scorecard.', label: 'REJECT', effect: 'ground', traitEffects: { zen: 4, swagger: 4 }, partnerEffect: 3 },
        { text: 'Read it again. Closer.', label: 'FIXATE', effect: 'dissociate', traitEffects: { focus: -4, zen: -3 }, partnerEffect: -3 },
      ],
    };
  }

  if (onsetType === 'impostor') {
    return {
      passage: [
        'Sato is sitting in a golf cart.',
        'The golf cart is on the fairway. The golf cart has wood paneling. Like a boardroom. The seats are leather.',
        'The path alongside is lined with stone lanterns.',
        'He\'s reading a newspaper. The newspaper is from next Monday.',
        'The headline says your name. The columns are kanji. You can\'t read the rest.',
        'He looks up. His glasses catch the sun. You can\'t see his eyes.',
        '"Play through," he says. He means something else.',
        'You look at your hands. You are holding a 7-iron. You have always been holding a 7-iron.',
        'The 7-iron is a ballpoint pen.',
        'The ballpoint pen is a 7-iron.',
        'Sato folds his newspaper and drives away. The cart doesn\'t make a sound.',
      ],
      choices: [
        { text: 'You belong here.', label: 'CLAIM IT', effect: 'ground', traitEffects: { swagger: 5, focus: 3 }, partnerEffect: 2 },
        { text: 'Follow the cart.', label: 'CHASE', effect: 'dissociate', traitEffects: { focus: -5, zen: -2 }, partnerEffect: -4 },
      ],
    };
  }

  if (onsetType === 'isolation') {
    return {
      passage: [
        'The course is empty.',
        'Not empty like early morning. Empty like a hotel hallway at 3 AM in Shinjuku.',
        'Martin is gone. He was here a moment ago. His bag is still on the cart. His glove is on the seat.',
        'The glove is warm.',
        'You call his name. The mountain takes the sound and doesn\'t give it back.',
        'There\'s a phone ringing in the clubhouse. Nobody answers. It rings eleven times. You count.',
        'On the twelfth ring, you realize it\'s your phone. It has always been your phone.',
        'You answer. Nobody speaks. The line is open. You can hear breathing. It might be yours.',
        'The sun moves. It moves too fast. It\'s afternoon now. It was morning.',
      ],
      choices: [
        { text: 'Find Martin.', label: 'RECONNECT', effect: 'ground', traitEffects: { zen: 4, focus: 2 }, partnerEffect: 5 },
        { text: 'Keep walking alone.', label: 'DRIFT', effect: 'dissociate', traitEffects: { zen: -3, swagger: -2 }, partnerEffect: -6 },
      ],
    };
  }

  // Default void
  return {
    passage: [
      'You blink.',
      'When you open your eyes, you are not on the golf course.',
      'You are in a corridor in a business hotel in Tokyo. The corridor has no doors. The carpet is burgundy.',
      'The lights are fluorescent. They hum. They have always been humming.',
      'At the end of the corridor, a vending machine glows and hums. The labels are kanji you can\'t read. A paper cup sits on the tray. The cup is full.',
      'You can hear golf. Distant. The sound of a club hitting a ball. It echoes down the corridor like it\'s coming from every direction.',
      'A man in a hotel yukata walks past you. He doesn\'t look at you. He\'s carrying a putter.',
      'He turns a corner that doesn\'t exist. The corridor is straight. He turned a corner.',
      'The cup is empty now.',
      'You blink again.',
    ],
    choices: [
      { text: 'Open your eyes.', label: 'WAKE UP', effect: 'ground', traitEffects: { zen: 5, focus: 4 }, partnerEffect: 2 },
      { text: 'Follow the man with the putter.', label: 'GO DEEPER', effect: 'dissociate', traitEffects: { zen: -4, focus: -4 }, partnerEffect: -5 },
    ],
  };
}

// ─── Recovery Dialogue ───
// Martin notices. Multiple response paths.
function getPanicRecovery(state, onsetType, voidChoice) {
  const grounded = voidChoice === 'ground';
  const imp = state.partner.impression;

  const martinOpener = imp >= 50
    ? (grounded
      ? `Martin is looking at you. Not the way people look at you in meetings — the way someone looks at you when you're a variable. "Hey," he says. Quietly. "Status."`
      : `Martin is beside you. When did he get there? "Talk," he says. One word. Two obligations.`)
    : (grounded
      ? `Martin glances over. He noticed something. He doesn't name it. "You need a minute," he says. Not a question.`
      : `Martin stands at a distance beside Sato's shadow. "You don't look aligned," he says.`);

  const claireRecovery = hasFlag(state, 'accepted_claire_deal')
    ? {
      text: '"I made a mistake. On the phone. With Claire. I don\'t know if—" You can\'t finish. Martin waits.',
      label: 'CONFESS',
      traitEffects: { zen: 8, swagger: -4 },
      partnerEffect: { impression: 10 },
      setFlags: { panic_confessed_to_martin: true, warned_martin_about_claire: true },
      narrative: `Martin is quiet for a long time. The mountain fills the silence. "Interesting," he says finally — and this time it means only one thing. "I assumed pressure. I didn't assume theater." He picks up his bag. "Walk. We finish the round."`,
    }
    : null;

  const responses = [
    {
      text: '"I\'m fine. Just... give me a second." You press your palms into your thighs. You feel the grass through your pants. You count the blades.',
      label: 'GROUND YOURSELF',
      traitEffects: { zen: 6, focus: 4 },
      partnerEffect: { impression: 2 },
      setFlags: { panic_grounded: true },
      narrative: grounded
        ? `You breathe. In through the nose. Out through the mouth. The fairway comes back. The mountain comes back. The bamboo comes back. Martin comes back. The world reassembles itself, piece by piece, like someone rebuilding a jigsaw puzzle in real time. Not all the pieces fit perfectly. But enough of them do. "Take your time," Martin says. He means it — as much as he means anything.`
        : `You breathe. It takes longer than it should. The world is slower coming back this time. The edges are still soft. But Martin is there, and the grass is there, and the ball is there. That's three things. Three things is enough.`,
    },
    {
      text: '"Yeah, I\'m great. Totally fine. Let\'s go." You smile. The smile does not reach your eyes. It does not try.',
      label: 'FAKE IT',
      traitEffects: { swagger: 3, zen: -1, focus: 2 },
      partnerEffect: { impression: -3 },
      setFlags: { panic_faked: true },
      narrative: `Martin looks at you for a beat too long. He doesn't believe you. He decides to let you have it anyway. "Okay," he says. "Okay." He walks toward his ball. You follow. Your legs work. That's something. The smile stays on. It has a job to do and it will do its job. That's what smiles are for. That's what you're for.`,
    },
    {
      text: '"Martin." Your voice cracks on the single syllable. "I\'m not— I don\'t think I\'m—"',
      label: 'LET MARTIN IN',
      traitEffects: { zen: 10, focus: 2, swagger: -5 },
      partnerEffect: { impression: 8 },
      setFlags: { panic_martin_helped: true, empathized_with_martin: true },
      narrative: `Martin sets his club down without drama. He doesn't touch you — he's smart about that — but he stands close enough that you can feel someone is there. "I get these," he says. "Not on the course. In the office. When the numbers stop behaving." He doesn't look at you when he says this. He looks at the mountain—the ridgeline, the distance where the deal lives. "It passes. It always passes. But it doesn't feel like it will." A beat. "Breathe anyway."`,
    },
    {
      text: 'You say nothing. You pick up your club. You walk to the ball. You are going to hit this ball if it\'s the last thing you do on this earth.',
      label: 'FIGHT THROUGH IT',
      traitEffects: { focus: 8, swagger: 4, zen: -2 },
      partnerEffect: { impression: 4 },
      setFlags: { panic_fought_through: true },
      narrative: `Your hands are shaking. Your hands have been shaking since the second hole, maybe, you've lost track. But the club is in them, and the ball is on the ground, and the flag is out there somewhere in the blur. You swing. It's ugly. It's desperate. It's the most honest swing you've made all day. Martin watches. He doesn't say a word. He doesn't need to. Some things you just have to walk through.`,
    },
  ];

  if (claireRecovery) {
    responses.splice(2, 0, claireRecovery);
  }

  return {
    martinOpener,
    responses,
  };
}

// ─── Post-Panic Aftershocks ───
// Additional micro-thoughts that appear for the rest of the round after a panic attack.
const PANIC_AFTERSHOCK_THOUGHTS = {
  tee: [
    { text: 'Not again.', quality: 0.5, category: 'anxiety', traitEffects: { zen: -2 }, when: s => s.panicAttacksThisRound > 0 },
    { text: 'Still here.', quality: -0.1, category: 'neutral', traitEffects: { zen: 1 }, when: s => s.panicAttacksThisRound > 0 && hasFlag(s, 'panic_grounded') },
    { text: 'Martin gets it.', quality: -0.2, category: 'focus', traitEffects: { zen: 2, focus: 1 }, when: s => hasFlag(s, 'panic_martin_helped') },
    { text: 'Keep the mask on.', quality: 0.4, category: 'anxiety', traitEffects: { swagger: 1, zen: -2 }, when: s => hasFlag(s, 'panic_faked') },
    { text: 'The Tokyo office.', quality: 0.9, category: 'distraction', traitEffects: { focus: -5, zen: -3 }, when: s => s.panicAttacksThisRound > 0 },
    { text: 'That was real.', quality: 0.3, category: 'anxiety', traitEffects: { focus: -1 }, when: s => s.panicAttacksThisRound > 0 },
    { text: 'Grass is real.', quality: -0.3, category: 'focus', traitEffects: { zen: 3 }, when: s => hasFlag(s, 'panic_grounded') },
    { text: 'Martin\'s silence.', quality: -0.2, category: 'neutral', traitEffects: { zen: 2 }, when: s => hasFlag(s, 'panic_martin_helped') },
  ],
  approach: [
    { text: 'Hands still shaking.', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3, zen: -2 }, when: s => s.panicAttacksThisRound > 0 },
    { text: 'One shot at a time.', quality: -0.2, category: 'focus', traitEffects: { focus: 2 }, when: s => hasFlag(s, 'panic_fought_through') },
    { text: 'The carpet was green.', quality: 0.7, category: 'distraction', traitEffects: { focus: -4, zen: -2 }, when: s => s.panicAttacksThisRound > 0 },
  ],
  putt: [
    { text: 'Hands. Steady.', quality: 0.3, category: 'anxiety', traitEffects: { focus: -1, zen: -1 }, when: s => s.panicAttacksThisRound > 0 },
    { text: 'It passes.', quality: -0.3, category: 'focus', traitEffects: { zen: 3 }, when: s => hasFlag(s, 'panic_martin_helped') },
    { text: 'Fluorescent hum.', quality: 0.8, category: 'distraction', traitEffects: { focus: -4, zen: -3 }, when: s => s.panicAttacksThisRound > 0 },
  ],
};

// ─── Claire Thought Colonization ───
// When cooperating with Claire, base micro-thoughts are replaced.
// Deeper cooperation = more replacement.
const CLAIRE_COLONIZED_THOUGHTS = {
  tee: [
    { original: 'Smooth tempo.', text: 'Strategic tempo. Career swing.', quality: 0.4, category: 'distraction', traitEffects: { focus: -2, zen: -2, swagger: 1 } },
    { original: 'Trust it.', text: 'Trust the process. Claire\'s process.', quality: 0.6, category: 'distraction', traitEffects: { focus: -3, zen: -3 } },
    { original: 'Breathe.', text: 'Breathe. Smile. Perform.', quality: 0.5, category: 'distraction', traitEffects: { focus: -2, zen: -3 } },
    { original: 'Commit.', text: 'Commit. To the swing. To the deal. To all of it.', quality: 0.5, category: 'distraction', traitEffects: { focus: -2, zen: -2, swagger: 2 } },
    { original: 'Don\'t shank.', text: 'Don\'t embarrass the firm.', quality: 1.0, category: 'anxiety', traitEffects: { focus: -6, zen: -5 } },
    { original: 'See the line.', text: 'See the org chart.', quality: 0.7, category: 'distraction', traitEffects: { focus: -4, zen: -2 } },
    { original: 'Target locked.', text: 'Target: Takeda-Mori.', quality: 0.6, category: 'distraction', traitEffects: { focus: -3, zen: -2, knowledge: 1 } },
    { original: 'Just swing.', text: 'Just deliver.', quality: 0.4, category: 'distraction', traitEffects: { focus: -1, zen: -2 } },
  ],
  approach: [
    { original: 'Pin high.', text: 'Benchmark achieved.', quality: 0.4, category: 'distraction', traitEffects: { focus: -2, zen: -1 } },
    { original: 'Soft landing.', text: 'Soft restructuring.', quality: 0.7, category: 'distraction', traitEffects: { focus: -4, zen: -3 } },
    { original: 'Center green.', text: 'Center of the org.', quality: 0.5, category: 'distraction', traitEffects: { focus: -2, zen: -2, knowledge: 1 } },
    { original: 'Smooth.', text: 'Synergy.', quality: 0.6, category: 'distraction', traitEffects: { focus: -3, zen: -2 } },
  ],
  putt: [
    { original: 'Die in.', text: 'Close the deal.', quality: 0.4, category: 'distraction', traitEffects: { focus: -2, zen: -1 } },
    { original: 'Spot the line.', text: 'Spot the opportunity.', quality: 0.5, category: 'distraction', traitEffects: { focus: -2, zen: -2 } },
    { original: 'Pure roll.', text: 'Pure deliverable.', quality: 0.6, category: 'distraction', traitEffects: { focus: -3, zen: -2 } },
    { original: 'Firm stroke.', text: 'Firm handshake.', quality: 0.5, category: 'distraction', traitEffects: { focus: -2, zen: -2, swagger: 1 } },
  ],
};

function getClaireColonizationDepth(state) {
  if (hasFlag(state, 'accepted_claire_deal')) return 0.6;
  if (hasFlag(state, 'cooperating_with_claire')) return 0.35;
  if (hasFlag(state, 'claire_contacted') && !hasFlag(state, 'deflected_claire') && !hasFlag(state, 'left_claire_on_read')) return 0.15;
  return 0;
}

function colonizeThoughts(thoughts, shotType, state) {
  const depth = getClaireColonizationDepth(state);
  if (depth <= 0) return thoughts;

  const colonized = CLAIRE_COLONIZED_THOUGHTS[shotType] || [];
  if (colonized.length === 0) return thoughts;

  return thoughts.map(t => {
    const replacement = colonized.find(c => c.original === t.text);
    if (replacement && Math.random() < depth) {
      return { ...t, text: replacement.text, quality: replacement.quality, category: replacement.category, traitEffects: replacement.traitEffects, colonized: true };
    }
    return t;
  });
}
