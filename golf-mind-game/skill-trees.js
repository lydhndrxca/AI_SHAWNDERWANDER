// ─── Skill Trees & Perks ───
// 5 trees (one per trait), 3 tiers each, 2 choices per tier = 30 total perks.
// Players pick ONE perk per tier when they cross the threshold.

const PERK_TIERS = [
  { tier: 1, threshold: 60, label: 'I' },
  { tier: 2, threshold: 75, label: 'II' },
  { tier: 3, threshold: 90, label: 'III' },
];

const SKILL_TREES = {
  focus: {
    trait: 'focus',
    name: 'FOCUS',
    icon: '◎',
    color: '#3aff6f',
    description: 'Mental discipline and concentration',
    perks: [
      // ─── Tier 1 (60) ───
      {
        id: 'focus_1a',
        name: 'Pre-Shot Routine',
        tier: 1,
        slot: 'A',
        description: 'Shot randomness reduced by 30%.',
        flavor: 'Waggle, breathe, commit. The same way every time.',
        effect: { type: 'shotRandomness', value: 0.7 },
      },
      {
        id: 'focus_1b',
        name: 'First Tee Jitters',
        tier: 1,
        slot: 'B',
        description: 'First shot of each hole gets a quality bonus.',
        flavor: 'You always start strong. The rest is negotiable.',
        effect: { type: 'firstShotBonus', value: -0.4 },
      },
      // ─── Tier 2 (75) ───
      {
        id: 'focus_2a',
        name: 'The Zone',
        tier: 2,
        slot: 'A',
        description: 'Each consecutive good shot adds +0.15 quality to the next.',
        flavor: 'Time slows. The target grows. You can\'t miss.',
        effect: { type: 'streakBonus', value: 0.15 },
      },
      {
        id: 'focus_2b',
        name: 'Green Reader',
        tier: 2,
        slot: 'B',
        description: 'All putts get a significant quality bonus.',
        flavor: 'You see the line before you even crouch down.',
        effect: { type: 'puttBonus', value: -0.5 },
      },
      // ─── Tier 3 (90) ───
      {
        id: 'focus_3a',
        name: 'Flow State',
        tier: 3,
        slot: 'A',
        description: 'When Focus is above 70, all shots get a flat bonus.',
        flavor: 'The swing happens without thought. You are the swing.',
        effect: { type: 'conditionalBonus', trait: 'focus', threshold: 70, value: -0.3 },
      },
      {
        id: 'focus_3b',
        name: 'Pressure Player',
        tier: 3,
        slot: 'B',
        description: 'Shots on holes 7-9 get a major quality bonus.',
        flavor: 'The bigger the stage, the better you play.',
        effect: { type: 'lateRoundBonus', startHole: 7, value: -0.5 },
      },
    ],
  },

  swagger: {
    trait: 'swagger',
    name: 'SWAGGER',
    icon: '♚',
    color: '#d4a843',
    description: 'Confidence, flair, and big-play energy',
    perks: [
      {
        id: 'swagger_1a',
        name: 'Walk the Walk',
        tier: 1,
        slot: 'A',
        description: 'Martin impression gains from all sources increased by 50%.',
        flavor: 'People notice you. You make sure of it.',
        effect: { type: 'impressionMultiplier', value: 1.5 },
      },
      {
        id: 'swagger_1b',
        name: 'Bold Play',
        tier: 1,
        slot: 'B',
        description: 'High-risk swing thoughts (baseQuality 4+) get a rescue bonus.',
        flavor: 'Fortune favors the audacious.',
        effect: { type: 'riskRescue', threshold: 4, value: -1.0 },
      },
      {
        id: 'swagger_2a',
        name: 'Clutch Gene',
        tier: 2,
        slot: 'A',
        description: 'When over par for the round, all shots get a bonus.',
        flavor: 'Your back is against the wall? Good. That\'s where you do your best work.',
        effect: { type: 'clutchBonus', value: -0.4 },
      },
      {
        id: 'swagger_2b',
        name: 'Showmanship',
        tier: 2,
        slot: 'B',
        description: 'Perfect or Great shots give +5 Swagger.',
        flavor: 'You don\'t just hit good shots. You perform them.',
        effect: { type: 'greatShotSwaggerBoost', value: 5 },
      },
      {
        id: 'swagger_3a',
        name: 'Legend Mode',
        tier: 3,
        slot: 'A',
        description: 'Once per round, upgrade a Bad/Terrible shot to Good.',
        flavor: '"Did that just happen?" Yes. Yes it did.',
        effect: { type: 'legendSave', uses: 1 },
      },
      {
        id: 'swagger_3b',
        name: 'Unbreakable Ego',
        tier: 3,
        slot: 'B',
        description: 'Swagger can never drop below 50.',
        flavor: 'Confidence is a choice. You chose it permanently.',
        effect: { type: 'traitFloor', trait: 'swagger', value: 50 },
      },
    ],
  },

  humor: {
    trait: 'humor',
    name: 'HUMOR',
    icon: '☺',
    color: '#ff8f3a',
    description: 'Charm, wit, and social resilience',
    perks: [
      {
        id: 'humor_1a',
        name: 'Ice Breaker',
        tier: 1,
        slot: 'A',
        description: 'Negative impression effects are halved.',
        flavor: 'Even when you screw up, people like you.',
        effect: { type: 'impressionLossReduction', value: 0.5 },
      },
      {
        id: 'humor_1b',
        name: 'Shake It Off',
        tier: 1,
        slot: 'B',
        description: 'Bad shots cause 50% less Focus loss.',
        flavor: 'You missed? Hilarious. Moving on.',
        effect: { type: 'focusLossReduction', value: 0.5 },
      },
      {
        id: 'humor_2a',
        name: 'Comedy Gold',
        tier: 2,
        slot: 'A',
        description: 'All positive trait gains from dialogue are increased by +2.',
        flavor: 'Your charm is infectious. Everything comes a little easier.',
        effect: { type: 'dialogueTraitBoost', value: 2 },
      },
      {
        id: 'humor_2b',
        name: 'Lighten the Mood',
        tier: 2,
        slot: 'B',
        description: 'After a double bogey or worse, gain +8 Zen recovery.',
        flavor: '"Well, that happened. Anyway—"',
        effect: { type: 'disasterZenRecovery', value: 8 },
      },
      {
        id: 'humor_3a',
        name: 'Life of the Party',
        tier: 3,
        slot: 'A',
        description: 'Martin gives you a shot tip each hole: random −0.3 bonus.',
        flavor: '"Hey, line up left of the pin." He\'s rooting for you now.',
        effect: { type: 'daveTipBonus', value: -0.3 },
      },
      {
        id: 'humor_3b',
        name: 'Laughing All the Way',
        tier: 3,
        slot: 'B',
        description: 'Humor acts as a secondary Zen: adds humor/200 to shot calculation.',
        flavor: 'Laughter is the best swing thought.',
        effect: { type: 'humorZenSynergy', divisor: 200 },
      },
    ],
  },

  knowledge: {
    trait: 'knowledge',
    name: 'GOLF IQ',
    icon: '✦',
    color: '#4ac8ff',
    description: 'Technical understanding and course mastery',
    perks: [
      {
        id: 'knowledge_1a',
        name: 'Club Selection',
        tier: 1,
        slot: 'A',
        description: 'Approach shots get a quality bonus.',
        flavor: 'The right club makes the wrong swing survivable.',
        effect: { type: 'approachBonus', value: -0.4 },
      },
      {
        id: 'knowledge_1b',
        name: 'Course Reader',
        tier: 1,
        slot: 'B',
        description: 'Tee shots get a quality bonus.',
        flavor: 'You see the landing zone before you step up.',
        effect: { type: 'teeBonus', value: -0.3 },
      },
      {
        id: 'knowledge_2a',
        name: 'Swing Mechanics',
        tier: 2,
        slot: 'A',
        description: 'Distraction/bad swing thoughts have their penalty reduced by 40%.',
        flavor: 'Your body knows the swing even when your mind wanders.',
        effect: { type: 'badThoughtReduction', value: 0.6 },
      },
      {
        id: 'knowledge_2b',
        name: 'Grain Reader',
        tier: 2,
        slot: 'B',
        description: 'Putts get a substantial quality bonus.',
        flavor: 'The Poa annua tells you everything if you listen.',
        effect: { type: 'puttBonus', value: -0.6 },
      },
      {
        id: 'knowledge_3a',
        name: 'Tour Pro IQ',
        tier: 3,
        slot: 'A',
        description: 'Knowledge/Golf-IQ-labeled choices get baseQuality reduced by 1.',
        flavor: 'You think like a Tour player. The course bends to your game plan.',
        effect: { type: 'knowledgeChoiceBonus', value: 1 },
      },
      {
        id: 'knowledge_3b',
        name: 'Course Management',
        tier: 3,
        slot: 'B',
        description: 'Par and bogey results give +3 Knowledge.',
        flavor: 'Pars win tournaments. You\'ve internalized that.',
        effect: { type: 'scoringKnowledgeBoost', value: 3 },
      },
    ],
  },

  zen: {
    trait: 'zen',
    name: 'ZEN',
    icon: '◯',
    color: '#b89aff',
    description: 'Inner calm and emotional resilience',
    perks: [
      {
        id: 'zen_1a',
        name: 'Deep Breath',
        tier: 1,
        slot: 'A',
        description: 'All negative trait effects from choices reduced by 30%.',
        flavor: 'Inhale. Exhale. The damage is always less than you think.',
        effect: { type: 'traitLossReduction', value: 0.7 },
      },
      {
        id: 'zen_1b',
        name: 'Let It Go',
        tier: 1,
        slot: 'B',
        description: 'After a bad shot, Zen doesn\'t decrease.',
        flavor: 'The last shot is gone. Only the next one exists.',
        effect: { type: 'zenProtection' },
      },
      {
        id: 'zen_2a',
        name: 'Unshakeable',
        tier: 2,
        slot: 'A',
        description: 'Putts can\'t result worse than "Okay" quality.',
        flavor: 'Your hands are steady. Always.',
        effect: { type: 'puttFloor', value: 3 },
      },
      {
        id: 'zen_2b',
        name: 'Mountain Mind',
        tier: 2,
        slot: 'B',
        description: 'Zen bonus to shots is doubled.',
        flavor: 'You hear the wind through the bamboo. It\'s saying: relax.',
        effect: { type: 'zenBonusMultiplier', value: 2 },
      },
      {
        id: 'zen_3a',
        name: 'Enlightenment',
        tier: 3,
        slot: 'A',
        description: 'All negative trait changes from any source are halved.',
        flavor: 'Nothing touches you. The scorecard is just a number.',
        effect: { type: 'globalLossReduction', value: 0.5 },
      },
      {
        id: 'zen_3b',
        name: 'Inner Peace',
        tier: 3,
        slot: 'B',
        description: 'When Zen is above 75, shot randomness is eliminated.',
        flavor: 'The ball goes where you intend. Every time.',
        effect: { type: 'conditionalZeroRandom', trait: 'zen', threshold: 75 },
      },
    ],
  },
};

function getPerkById(perkId) {
  for (const tree of Object.values(SKILL_TREES)) {
    const perk = tree.perks.find(p => p.id === perkId);
    if (perk) return perk;
  }
  return null;
}

function getTreePerksForTier(traitKey, tier) {
  const tree = SKILL_TREES[traitKey];
  if (!tree) return [];
  return tree.perks.filter(p => p.tier === tier);
}

function getTierThreshold(tier) {
  const t = PERK_TIERS.find(pt => pt.tier === tier);
  return t ? t.threshold : Infinity;
}

function getAvailablePerks(state) {
  const available = [];
  for (const [traitKey, tree] of Object.entries(SKILL_TREES)) {
    const traitVal = state.traits[traitKey];
    for (const tierDef of PERK_TIERS) {
      if (traitVal < tierDef.threshold) continue;
      const alreadyChosen = state.perks.some(
        pid => tree.perks.find(p => p.id === pid && p.tier === tierDef.tier)
      );
      if (alreadyChosen) continue;
      const tierPerks = getTreePerksForTier(traitKey, tierDef.tier);
      if (tierPerks.length > 0) {
        available.push({ traitKey, tier: tierDef.tier, perks: tierPerks });
      }
    }
  }
  return available;
}

function hasPerk(state, perkId) {
  return state.perks.includes(perkId);
}

function getPerkEffect(state, effectType) {
  for (const perkId of state.perks) {
    const perk = getPerkById(perkId);
    if (perk && perk.effect.type === effectType) return perk.effect;
  }
  return null;
}

function getAllPerkEffects(state, effectType) {
  const effects = [];
  for (const perkId of state.perks) {
    const perk = getPerkById(perkId);
    if (perk && perk.effect.type === effectType) effects.push(perk.effect);
  }
  return effects;
}
