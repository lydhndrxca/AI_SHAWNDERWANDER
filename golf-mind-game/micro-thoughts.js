// ─── Micro-Thoughts ───
// Fleeting 2-3 word thoughts that flash through your mind during the backswing.
// Context-aware: the thought pool changes based on your score, Martin's impression,
// corporate events, trait levels, and shot streak.

const MICRO_THOUGHTS = {
  tee: [
    { text: 'One with it.', quality: -0.5, category: 'focus', traitEffects: { focus: 3, zen: 2 } },
    { text: 'Smooth tempo.', quality: -0.4, category: 'focus', traitEffects: { focus: 4 } },
    { text: 'Trust it.', quality: -0.3, category: 'focus', traitEffects: { zen: 4 } },
    { text: 'See the line.', quality: -0.4, category: 'focus', traitEffects: { focus: 3, knowledge: 2 } },
    { text: 'Commit.', quality: -0.5, category: 'focus', traitEffects: { focus: 4, swagger: 1 } },
    { text: 'Breathe.', quality: -0.3, category: 'focus', traitEffects: { zen: 5 } },
    { text: 'Target locked.', quality: -0.4, category: 'focus', traitEffects: { focus: 4, knowledge: 1 } },
    { text: 'Grip it.', quality: 0, category: 'neutral', traitEffects: { swagger: 2 } },
    { text: 'Just swing.', quality: 0.1, category: 'neutral', traitEffects: { zen: 2 } },
    { text: 'Here goes.', quality: 0.1, category: 'neutral', traitEffects: { swagger: 1 } },
    { text: 'Loose hands.', quality: -0.1, category: 'neutral', traitEffects: { zen: 2, focus: 1 } },
    { text: 'Keep head down.', quality: -0.2, category: 'focus', traitEffects: { knowledge: 3 } },
    { text: 'She\'s so hot.', quality: 0.8, category: 'distraction', traitEffects: { focus: -6, humor: 4, swagger: 2 } },
    { text: 'Lunch though.', quality: 0.6, category: 'distraction', traitEffects: { focus: -4, humor: 3 } },
    { text: 'Did I lock...?', quality: 0.7, category: 'distraction', traitEffects: { focus: -5, zen: -2 } },
    { text: 'Monday meeting.', quality: 0.9, category: 'distraction', traitEffects: { focus: -6, zen: -3, knowledge: 1 } },
    { text: 'That email.', quality: 0.8, category: 'distraction', traitEffects: { focus: -5, zen: -3 } },
    { text: 'Claire knows.', quality: 1.0, category: 'distraction', traitEffects: { focus: -7, zen: -4 } },
    { text: 'Am I fired?', quality: 1.2, category: 'distraction', traitEffects: { focus: -8, zen: -6 } },
    { text: 'Need a drink.', quality: 0.5, category: 'distraction', traitEffects: { focus: -3, humor: 3, swagger: 1 } },
    { text: 'Bartender girl.', quality: 0.7, category: 'distraction', traitEffects: { focus: -5, humor: 3, swagger: 2 } },
    { text: 'Is Martin watching?', quality: 0.4, category: 'distraction', traitEffects: { focus: -3, swagger: -2 } },
    { text: 'Destroy it.', quality: 0.3, category: 'swagger', traitEffects: { swagger: 5, focus: -2 } },
    { text: 'Bomb it.', quality: 0.4, category: 'swagger', traitEffects: { swagger: 4, focus: -2, zen: -1 } },
    { text: 'Show them.', quality: 0.3, category: 'swagger', traitEffects: { swagger: 4, zen: -1 } },
    { text: 'MY fairway.', quality: 0.2, category: 'swagger', traitEffects: { swagger: 5 } },
    { text: 'Tiger mode.', quality: 0.1, category: 'swagger', traitEffects: { swagger: 3, knowledge: 2 } },
    { text: 'Don\'t shank.', quality: 0.9, category: 'anxiety', traitEffects: { focus: -4, zen: -5 } },
    { text: 'Not the water.', quality: 0.8, category: 'anxiety', traitEffects: { focus: -4, zen: -4 } },
    { text: 'Don\'t slice.', quality: 0.7, category: 'anxiety', traitEffects: { focus: -3, zen: -4 } },
    { text: 'Everybody\'s looking.', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3, zen: -3, swagger: -2 } },
    { text: 'Please work.', quality: 0.5, category: 'anxiety', traitEffects: { zen: -3 } },
  ],

  approach: [
    { text: 'Pin high.', quality: -0.4, category: 'focus', traitEffects: { focus: 3, knowledge: 3 } },
    { text: 'Soft landing.', quality: -0.3, category: 'focus', traitEffects: { focus: 3, zen: 2 } },
    { text: 'Club up.', quality: -0.3, category: 'focus', traitEffects: { knowledge: 4 } },
    { text: 'Center green.', quality: -0.4, category: 'focus', traitEffects: { knowledge: 3, zen: 2 } },
    { text: 'Smooth.', quality: -0.2, category: 'focus', traitEffects: { zen: 3 } },
    { text: 'Not the bunker.', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3, zen: -3 } },
    { text: 'Flag hunting.', quality: 0.2, category: 'swagger', traitEffects: { swagger: 4, focus: -1 } },
    { text: 'Stiff it.', quality: 0.1, category: 'swagger', traitEffects: { swagger: 3, focus: 1 } },
    { text: 'What\'s for lunch?', quality: 0.7, category: 'distraction', traitEffects: { focus: -5, humor: 3 } },
    { text: 'Her eyes though.', quality: 0.8, category: 'distraction', traitEffects: { focus: -5, humor: 2, swagger: 2 } },
    { text: 'The quarterly.', quality: 0.9, category: 'distraction', traitEffects: { focus: -6, zen: -3 } },
    { text: 'Thin it.', quality: 0.8, category: 'anxiety', traitEffects: { focus: -4, zen: -4 } },
  ],

  putt: [
    { text: 'Die in.', quality: -0.4, category: 'focus', traitEffects: { focus: 3, zen: 3 } },
    { text: 'Spot the line.', quality: -0.5, category: 'focus', traitEffects: { focus: 4, knowledge: 2 } },
    { text: 'Pure roll.', quality: -0.3, category: 'focus', traitEffects: { zen: 4 } },
    { text: 'Firm stroke.', quality: -0.2, category: 'focus', traitEffects: { focus: 3 } },
    { text: 'In the cup.', quality: -0.3, category: 'focus', traitEffects: { swagger: 2, focus: 2 } },
    { text: 'Miss short?', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3, zen: -3 } },
    { text: 'The yips.', quality: 1.0, category: 'anxiety', traitEffects: { focus: -5, zen: -6 } },
    { text: 'Lip out.', quality: 0.7, category: 'anxiety', traitEffects: { focus: -3, zen: -4 } },
    { text: 'Three-putt.', quality: 0.9, category: 'anxiety', traitEffects: { focus: -5, zen: -5 } },
    { text: 'Slam it.', quality: 0.4, category: 'swagger', traitEffects: { swagger: 4, focus: -2 } },
    { text: 'Martin\'s watching.', quality: 0.5, category: 'distraction', traitEffects: { focus: -3, swagger: -1 } },
    { text: 'Dinner plans.', quality: 0.6, category: 'distraction', traitEffects: { focus: -4, humor: 2 } },
  ],
};

// ─── Contextual Thoughts ───
// These get injected based on game state. Each has a `when` function
// that returns true if this thought should enter the pool.
const CONTEXTUAL_THOUGHTS = {
  tee: [
    // Score pressure (3+ over par)
    { text: 'Comeback starts now.', quality: 0.3, category: 'anxiety', traitEffects: { focus: -2, swagger: 2 }, when: s => s.totalScore >= 3 },
    { text: 'Hemorrhaging strokes.', quality: 1.0, category: 'anxiety', traitEffects: { focus: -6, zen: -5 }, when: s => s.totalScore >= 5 },
    { text: 'Just stop the bleeding.', quality: 0.7, category: 'anxiety', traitEffects: { focus: -3, zen: -3 }, when: s => s.totalScore >= 3 },
    { text: 'It\'s only golf.', quality: 0.2, category: 'neutral', traitEffects: { zen: 3 }, when: s => s.totalScore >= 4 },
    // Playing well
    { text: 'Keep this going.', quality: -0.3, category: 'focus', traitEffects: { focus: 3 }, when: s => s.totalScore <= -1 },
    { text: 'In the zone.', quality: -0.5, category: 'focus', traitEffects: { focus: 4, zen: 3 }, when: s => s.goodShotStreak >= 3 },
    { text: 'I own this course.', quality: -0.2, category: 'swagger', traitEffects: { swagger: 5 }, when: s => s.totalScore <= -2 },
    { text: 'Don\'t get cocky.', quality: 0.3, category: 'anxiety', traitEffects: { focus: -2, zen: -1 }, when: s => s.goodShotStreak >= 2 },
    // Martin impression low
    { text: 'Martin hates me.', quality: 0.8, category: 'distraction', traitEffects: { focus: -5, zen: -3, swagger: -2 }, when: s => s.partner.impression < 30 },
    { text: 'He\'s judging me.', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3, swagger: -3 }, when: s => s.partner.impression < 40 },
    { text: 'Prove him wrong.', quality: 0.2, category: 'swagger', traitEffects: { swagger: 4 }, when: s => s.partner.impression < 35 },
    // Martin impression high
    { text: 'Martin believes in me.', quality: -0.2, category: 'focus', traitEffects: { focus: 2, zen: 2 }, when: s => s.partner.impression >= 70 },
    { text: 'Don\'t let Martin down.', quality: 0.4, category: 'anxiety', traitEffects: { focus: -2, zen: -2 }, when: s => s.partner.impression >= 65 },
    // Claire contacted
    { text: 'Claire\'s watching.', quality: 0.9, category: 'distraction', traitEffects: { focus: -5, zen: -4 }, when: s => hasFlag(s, 'cooperating_with_claire') },
    { text: 'What did she mean?', quality: 0.7, category: 'distraction', traitEffects: { focus: -4, zen: -3 }, when: s => hasFlag(s, 'claire_contacted') },
    { text: 'Lowercase dread.', quality: 0.6, category: 'distraction', traitEffects: { focus: -3, humor: 2 }, when: s => hasFlag(s, 'cooperating_with_claire') },
    // Sato awareness
    { text: 'Sato is here.', quality: 0.8, category: 'anxiety', traitEffects: { focus: -4, zen: -4, swagger: -2 }, when: s => hasFlag(s, 'aware_sato_watching') },
    { text: 'Job interview swing.', quality: 0.9, category: 'anxiety', traitEffects: { focus: -5, zen: -5 }, when: s => hasFlag(s, 'aware_sato_watching') },
    { text: 'Impress Takeda-Mori.', quality: 0.5, category: 'swagger', traitEffects: { swagger: 3, focus: -3 }, when: s => hasFlag(s, 'aware_sato_watching') },
    // Accepted Claire stall / deal tension
    { text: 'I said maybe.', quality: 0.7, category: 'distraction', traitEffects: { focus: -4, zen: -3 }, when: s => hasFlag(s, 'accepted_claire_deal') },
    { text: 'Martin doesn\'t know.', quality: 1.0, category: 'distraction', traitEffects: { focus: -6, zen: -5 }, when: s => hasFlag(s, 'accepted_claire_deal') },
    { text: 'Worth it?', quality: 0.6, category: 'distraction', traitEffects: { focus: -3, zen: -2 }, when: s => hasFlag(s, 'accepted_claire_deal') },
    // Advocated for Martin
    { text: 'Did the right thing.', quality: -0.2, category: 'focus', traitEffects: { zen: 4 }, when: s => hasFlag(s, 'advocated_for_martin') },
    // Rejected Claire
    { text: 'No regrets.', quality: -0.3, category: 'focus', traitEffects: { zen: 5 }, when: s => hasFlag(s, 'rejected_claire_deal') },
    { text: 'Just golf now.', quality: -0.4, category: 'focus', traitEffects: { focus: 4, zen: 3 }, when: s => hasFlag(s, 'rejected_claire_deal') },
    // Low zen = more anxiety
    { text: 'Can\'t breathe.', quality: 0.9, category: 'anxiety', traitEffects: { focus: -4, zen: -4 }, when: s => s.traits.zen < 25 },
    { text: 'Heart pounding.', quality: 0.7, category: 'anxiety', traitEffects: { focus: -3, zen: -3 }, when: s => s.traits.zen < 30 },
    // High zen = flow
    { text: 'Mountain. Grass. Ball.', quality: -0.5, category: 'focus', traitEffects: { zen: 4, focus: 3 }, when: s => s.traits.zen >= 75 },
    { text: 'Empty mind.', quality: -0.6, category: 'focus', traitEffects: { zen: 5, focus: 4 }, when: s => s.traits.zen >= 80 },
    { text: 'I am the swing.', quality: -0.5, category: 'focus', traitEffects: { zen: 3, focus: 3, swagger: 2 }, when: s => s.traits.zen >= 80 && s.traits.focus >= 70 },
    // Late round pressure
    { text: 'Three holes left.', quality: 0.5, category: 'anxiety', traitEffects: { focus: -2, zen: -3 }, when: s => s.currentHole >= 6 },
    { text: 'Finish strong.', quality: -0.1, category: 'swagger', traitEffects: { swagger: 3 }, when: s => s.currentHole >= 7 },
    { text: 'Last chance.', quality: 0.6, category: 'anxiety', traitEffects: { focus: -3, zen: -3 }, when: s => s.currentHole === 8 },
    // Low focus = more distractions
    { text: 'Why am I here?', quality: 0.8, category: 'distraction', traitEffects: { focus: -4, zen: -2 }, when: s => s.traits.focus < 30 },
    { text: 'Hotel minibar...', quality: 0.7, category: 'distraction', traitEffects: { focus: -4, humor: 1 }, when: s => s.traits.focus < 35 },
    // Martin shared his struggle
    { text: 'VK without VK...', quality: 0.5, category: 'distraction', traitEffects: { focus: -3, zen: -1 }, when: s => hasFlag(s, 'martin_shared_struggle') },
    // Aggressive strategy
    { text: 'ALL OF IT.', quality: 0.4, category: 'swagger', traitEffects: { swagger: 5, focus: -3 }, when: s => s.shotStrategy === 'aggressive' },
    { text: 'Send it deep.', quality: 0.3, category: 'swagger', traitEffects: { swagger: 4, focus: -2 }, when: s => s.shotStrategy === 'aggressive' },
    { text: 'Hero or zero.', quality: 0.5, category: 'swagger', traitEffects: { swagger: 4, zen: -2 }, when: s => s.shotStrategy === 'aggressive' },
    // Safe strategy
    { text: 'Smart play.', quality: -0.4, category: 'focus', traitEffects: { knowledge: 4 }, when: s => s.shotStrategy === 'safe' },
    { text: 'Middle of the green.', quality: -0.3, category: 'focus', traitEffects: { knowledge: 3, zen: 2 }, when: s => s.shotStrategy === 'safe' },
  ],

  approach: [
    { text: 'Just get it close.', quality: 0.2, category: 'anxiety', traitEffects: { focus: -1, zen: -1 }, when: s => s.totalScore >= 3 },
    { text: 'Need this one.', quality: 0.5, category: 'anxiety', traitEffects: { focus: -2, zen: -3 }, when: s => s.totalScore >= 4 },
    { text: 'Pin is mine.', quality: -0.2, category: 'swagger', traitEffects: { swagger: 4 }, when: s => s.totalScore <= -1 },
    { text: 'Diligence deck.', quality: 0.9, category: 'distraction', traitEffects: { focus: -5, zen: -3 }, when: s => hasFlag(s, 'aware_sato_watching') },
    { text: 'Voicemail from Claire.', quality: 0.8, category: 'distraction', traitEffects: { focus: -5, zen: -4 }, when: s => hasFlag(s, 'stalled_claire') },
    { text: 'Martin nailed his.', quality: 0.4, category: 'anxiety', traitEffects: { focus: -2, swagger: -2 }, when: s => s.partner.impression >= 60 },
    { text: 'Autopilot.', quality: -0.3, category: 'focus', traitEffects: { zen: 3, focus: 2 }, when: s => s.traits.zen >= 70 },
    { text: 'Lay it up safe.', quality: -0.3, category: 'focus', traitEffects: { knowledge: 3, zen: 2 }, when: s => s.shotStrategy === 'safe' },
    { text: 'Attack mode.', quality: 0.2, category: 'swagger', traitEffects: { swagger: 4, focus: -2 }, when: s => s.shotStrategy === 'aggressive' },
  ],

  putt: [
    { text: 'Clutch it.', quality: -0.3, category: 'swagger', traitEffects: { swagger: 4 }, when: s => s.totalScore >= 2 },
    { text: 'Save par.', quality: 0.3, category: 'anxiety', traitEffects: { focus: -1, zen: -2 }, when: s => s.strokesThisHole > (COURSE_DATA.holes[s.currentHole]?.par || 4) },
    { text: 'Birdie putt.', quality: -0.2, category: 'focus', traitEffects: { focus: 3, swagger: 2 }, when: s => s.strokesThisHole < (COURSE_DATA.holes[s.currentHole]?.par || 4) },
    { text: 'Don\'t embarrass me.', quality: 0.7, category: 'anxiety', traitEffects: { focus: -3, zen: -4 }, when: s => hasFlag(s, 'aware_sato_watching') },
    { text: 'Read it. Roll it.', quality: -0.4, category: 'focus', traitEffects: { focus: 4, knowledge: 2 }, when: s => s.traits.focus >= 65 },
    { text: 'Hands shaking.', quality: 0.9, category: 'anxiety', traitEffects: { focus: -5, zen: -5 }, when: s => s.traits.zen < 25 },
    { text: 'The ball knows.', quality: -0.4, category: 'focus', traitEffects: { zen: 4, focus: 2 }, when: s => s.traits.zen >= 75 },
    { text: 'Career putt.', quality: 0.8, category: 'anxiety', traitEffects: { focus: -4, zen: -4 }, when: s => hasFlag(s, 'accepted_claire_deal') && s.currentHole >= 7 },
  ],
};

function getMicroThoughts(shotType, count, gameState) {
  const base = MICRO_THOUGHTS[shotType] || MICRO_THOUGHTS.tee;
  const contextual = CONTEXTUAL_THOUGHTS[shotType] || [];

  // Include panic aftershock thoughts if applicable
  const aftershock = (typeof PANIC_AFTERSHOCK_THOUGHTS !== 'undefined')
    ? (PANIC_AFTERSHOCK_THOUGHTS[shotType] || [])
    : [];

  const activeContext = gameState
    ? [...contextual, ...aftershock].filter(t => t.when(gameState))
    : [];

  const contextWeight = Math.min(activeContext.length, 3);
  const pool = [...base];

  // Inject active contextual thoughts with higher selection priority
  for (const t of activeContext) {
    pool.push(t);
    if (contextWeight >= 2) pool.push(t);
  }

  const selected = [];
  const available = [...pool];

  // Guarantee at least one focus thought
  const focusOpts = available.filter(t => t.category === 'focus');
  if (focusOpts.length) {
    const pick = focusOpts[Math.floor(Math.random() * focusOpts.length)];
    selected.push(pick);
    removeFrom(available, pick);
  }

  // Guarantee at least one contextual thought if any are active
  if (activeContext.length > 0 && selected.length < count) {
    const pick = activeContext[Math.floor(Math.random() * activeContext.length)];
    if (!selected.includes(pick)) {
      selected.push(pick);
      removeFrom(available, pick);
    }
  }

  // Guarantee one distraction/anxiety if conditions warrant
  if (gameState && (gameState.totalScore >= 3 || (gameState.traits && gameState.traits.zen < 35))) {
    const stressOpts = available.filter(t => t.category === 'anxiety' || t.category === 'distraction');
    if (stressOpts.length && selected.length < count) {
      const pick = stressOpts[Math.floor(Math.random() * stressOpts.length)];
      if (!selected.includes(pick)) {
        selected.push(pick);
        removeFrom(available, pick);
      }
    }
  }

  // Fill remaining
  while (selected.length < count && available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    const pick = available.splice(idx, 1)[0];
    if (!selected.find(s => s.text === pick.text)) {
      selected.push(pick);
    }
  }

  // Shuffle
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected.slice(0, count);
}

function removeFrom(arr, item) {
  const idx = arr.indexOf(item);
  if (idx >= 0) arr.splice(idx, 1);
}

function resolveMicroShot(microThought, state, shotType) {
  let qualityIndex = 2 + microThought.quality;

  qualityIndex += 0.35;

  const focusBonus = (state.traits.focus - 50) / 140;
  let zenBonus = (state.traits.zen - 50) / 200;
  if (getPerkEffect(state, 'zenBonusMultiplier')) zenBonus *= getPerkEffect(state, 'zenBonusMultiplier').value;
  qualityIndex -= (focusBonus + zenBonus);

  // Shot strategy modifiers
  if (state.shotStrategy === 'aggressive') {
    qualityIndex += 0.3;
  } else if (state.shotStrategy === 'safe') {
    qualityIndex -= 0.2;
  }

  qualityIndex += state.shotModifier;
  state.shotModifier = 0;

  let randomFactor = (Math.random() - 0.5) * 1.0;
  const randomPerk = getPerkEffect(state, 'shotRandomness');
  if (randomPerk) randomFactor *= randomPerk.value;

  // Aggressive = more variance, safe = less variance
  if (state.shotStrategy === 'aggressive') randomFactor *= 1.4;
  else if (state.shotStrategy === 'safe') randomFactor *= 0.6;

  qualityIndex += randomFactor;

  const qualities = Object.keys(SHOT_QUALITY);
  let idx = Math.max(0, Math.min(qualities.length - 1, Math.round(qualityIndex)));

  // Safe: floor at 'bad' (4), cap at 'good' (2) — no perfects but no shanks
  if (state.shotStrategy === 'safe') {
    idx = Math.max(2, Math.min(4, idx));
  }

  const puttFloor = getPerkEffect(state, 'puttFloor');
  if (shotType === 'putt' && puttFloor && idx > puttFloor.value) idx = puttFloor.value;

  let quality = qualities[idx];

  const legendPerk = getPerkEffect(state, 'legendSave');
  if (legendPerk && !state.legendSaveUsed && ['bad', 'terrible', 'shank'].includes(quality)) {
    quality = 'good';
    state.legendSaveUsed = true;
  }

  const isGood = ['perfect', 'great', 'good'].includes(quality);
  state.goodShotStreak = isGood ? state.goodShotStreak + 1 : 0;
  state.shotsTakenThisHole++;

  return quality;
}
