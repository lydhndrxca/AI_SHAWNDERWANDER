// ─── Micro-Thoughts ───
// Fleeting 2-3 word thoughts that flash through your mind during the backswing.
// You have ~2 seconds to pick one. If you don't, it randomizes.
// Each thought has a quality modifier and trait effects.

const MICRO_THOUGHTS = {
  tee: [
    // Good golf focus
    { text: 'One with it.', quality: -0.5, category: 'focus', traitEffects: { focus: 3, zen: 2 } },
    { text: 'Smooth tempo.', quality: -0.4, category: 'focus', traitEffects: { focus: 4 } },
    { text: 'Trust it.', quality: -0.3, category: 'focus', traitEffects: { zen: 4 } },
    { text: 'See the line.', quality: -0.4, category: 'focus', traitEffects: { focus: 3, knowledge: 2 } },
    { text: 'Commit.', quality: -0.5, category: 'focus', traitEffects: { focus: 4, swagger: 1 } },
    { text: 'Breathe.', quality: -0.3, category: 'focus', traitEffects: { zen: 5 } },
    { text: 'Target locked.', quality: -0.4, category: 'focus', traitEffects: { focus: 4, knowledge: 1 } },

    // Neutral / mixed
    { text: 'Grip it.', quality: 0, category: 'neutral', traitEffects: { swagger: 2 } },
    { text: 'Just swing.', quality: 0.1, category: 'neutral', traitEffects: { zen: 2 } },
    { text: 'Here goes.', quality: 0.1, category: 'neutral', traitEffects: { swagger: 1 } },
    { text: 'Loose hands.', quality: -0.1, category: 'neutral', traitEffects: { zen: 2, focus: 1 } },
    { text: 'Keep head down.', quality: -0.2, category: 'focus', traitEffects: { knowledge: 3 } },

    // Distractions — fun but costly
    { text: 'She\'s so hot.', quality: 0.8, category: 'distraction', traitEffects: { focus: -6, humor: 4, swagger: 2 } },
    { text: 'Lunch though.', quality: 0.6, category: 'distraction', traitEffects: { focus: -4, humor: 3 } },
    { text: 'Did I lock...?', quality: 0.7, category: 'distraction', traitEffects: { focus: -5, zen: -2 } },
    { text: 'Monday meeting.', quality: 0.9, category: 'distraction', traitEffects: { focus: -6, zen: -3, knowledge: 1 } },
    { text: 'That email.', quality: 0.8, category: 'distraction', traitEffects: { focus: -5, zen: -3 } },
    { text: 'Sharon knows.', quality: 1.0, category: 'distraction', traitEffects: { focus: -7, zen: -4 } },
    { text: 'Am I fired?', quality: 1.2, category: 'distraction', traitEffects: { focus: -8, zen: -6 } },
    { text: 'Need a drink.', quality: 0.5, category: 'distraction', traitEffects: { focus: -3, humor: 3, swagger: 1 } },
    { text: 'Bartender girl.', quality: 0.7, category: 'distraction', traitEffects: { focus: -5, humor: 3, swagger: 2 } },
    { text: 'Is Dave watching?', quality: 0.4, category: 'distraction', traitEffects: { focus: -3, swagger: -2 } },

    // Aggressive / swagger
    { text: 'Destroy it.', quality: 0.3, category: 'swagger', traitEffects: { swagger: 5, focus: -2 } },
    { text: 'Bomb it.', quality: 0.4, category: 'swagger', traitEffects: { swagger: 4, focus: -2, zen: -1 } },
    { text: 'Show them.', quality: 0.3, category: 'swagger', traitEffects: { swagger: 4, zen: -1 } },
    { text: 'MY fairway.', quality: 0.2, category: 'swagger', traitEffects: { swagger: 5 } },
    { text: 'Tiger mode.', quality: 0.1, category: 'swagger', traitEffects: { swagger: 3, knowledge: 2 } },

    // Anxiety / negative
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
    { text: 'Dave\'s watching.', quality: 0.5, category: 'distraction', traitEffects: { focus: -3, swagger: -1 } },
    { text: 'Dinner plans.', quality: 0.6, category: 'distraction', traitEffects: { focus: -4, humor: 2 } },
  ],
};

// Select N random micro-thoughts for a given shot type, ensuring variety
function getMicroThoughts(shotType, count = 5) {
  const pool = MICRO_THOUGHTS[shotType] || MICRO_THOUGHTS.tee;
  const categories = ['focus', 'distraction', 'swagger', 'anxiety', 'neutral'];

  const selected = [];
  const usedCategories = new Set();

  // Guarantee at least one focus and one distraction
  const focusOptions = pool.filter(t => t.category === 'focus');
  const distractOptions = pool.filter(t => t.category !== 'focus');

  if (focusOptions.length) {
    const pick = focusOptions[Math.floor(Math.random() * focusOptions.length)];
    selected.push(pick);
    usedCategories.add('focus');
  }

  const distract = pool.filter(t => t.category === 'distraction');
  if (distract.length) {
    const pick = distract[Math.floor(Math.random() * distract.length)];
    selected.push(pick);
    usedCategories.add('distraction');
  }

  // Fill remaining from unused categories or random
  const remaining = pool.filter(t => !selected.includes(t));
  while (selected.length < count && remaining.length > 0) {
    const idx = Math.floor(Math.random() * remaining.length);
    selected.push(remaining.splice(idx, 1)[0]);
  }

  // Shuffle
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}

// Resolve a micro-thought into a shot (used instead of the old resolveShot for the micro path)
function resolveMicroShot(microThought, state, shotType) {
  let qualityIndex = 2 + microThought.quality; // base "good" (2) + thought modifier

  // Golf is hard baseline
  qualityIndex += 0.35;

  // Stat bonuses (same as engine.js resolveShot)
  const focusBonus = (state.traits.focus - 50) / 140;
  let zenBonus = (state.traits.zen - 50) / 200;
  if (getPerkEffect(state, 'zenBonusMultiplier')) zenBonus *= getPerkEffect(state, 'zenBonusMultiplier').value;
  qualityIndex -= (focusBonus + zenBonus);

  // Dialogue shot modifier
  qualityIndex += state.shotModifier;
  state.shotModifier = 0;

  // Randomness
  let randomFactor = (Math.random() - 0.5) * 1.0;
  const randomPerk = getPerkEffect(state, 'shotRandomness');
  if (randomPerk) randomFactor *= randomPerk.value;
  qualityIndex += randomFactor;

  // Resolve
  const qualities = Object.keys(SHOT_QUALITY);
  let idx = Math.max(0, Math.min(qualities.length - 1, Math.round(qualityIndex)));

  // Putt floor perk
  const puttFloor = getPerkEffect(state, 'puttFloor');
  if (shotType === 'putt' && puttFloor && idx > puttFloor.value) idx = puttFloor.value;

  let quality = qualities[idx];

  // Legend save
  const legendPerk = getPerkEffect(state, 'legendSave');
  if (legendPerk && !state.legendSaveUsed && ['bad', 'terrible', 'shank'].includes(quality)) {
    quality = 'good';
    state.legendSaveUsed = true;
  }

  // Streak
  const isGood = ['perfect', 'great', 'good'].includes(quality);
  state.goodShotStreak = isGood ? state.goodShotStreak + 1 : 0;
  state.shotsTakenThisHole++;

  return quality;
}
