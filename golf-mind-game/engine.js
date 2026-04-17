// ─── Game Engine ───
// State machine, scoring, personality traits, choice resolution

const PHASES = {
  TITLE: 'title',
  HOLE_INTRO: 'hole_intro',
  TEE_SETUP: 'tee_setup',
  TEE_THOUGHT: 'tee_thought',
  TEE_RESULT: 'tee_result',
  APPROACH_SETUP: 'approach_setup',
  APPROACH_THOUGHT: 'approach_thought',
  APPROACH_RESULT: 'approach_result',
  PUTT_SETUP: 'putt_setup',
  PUTT_THOUGHT: 'putt_thought',
  PUTT_RESULT: 'putt_result',
  HOLE_SUMMARY: 'hole_summary',
  BETWEEN_HOLES: 'between_holes',
  ROUND_SUMMARY: 'round_summary',
};

const TRAITS = {
  focus: { label: 'FOCUS', description: 'Mental discipline on the course' },
  swagger: { label: 'SWAGGER', description: 'Confidence and style' },
  humor: { label: 'HUMOR', description: 'How fun you are to be around' },
  knowledge: { label: 'GOLF IQ', description: 'Technical understanding of the game' },
  zen: { label: 'ZEN', description: 'Ability to stay calm under pressure' },
};

const SHOT_QUALITY = {
  perfect:  { label: 'Perfect',  strokeMod: -1, color: 'result-good' },
  great:    { label: 'Great',    strokeMod: 0,  color: 'result-good' },
  good:     { label: 'Good',     strokeMod: 0,  color: 'action' },
  okay:     { label: 'Okay',     strokeMod: 1,  color: 'result-bad' },
  bad:      { label: 'Bad',      strokeMod: 1,  color: 'result-bad' },
  terrible: { label: 'Terrible', strokeMod: 2,  color: 'result-terrible' },
  shank:    { label: 'Shank',    strokeMod: 3,  color: 'result-terrible' },
};

function createGameState() {
  return {
    phase: PHASES.TITLE,
    currentHole: 0,
    strokesThisHole: 0,
    shotsThisHole: [],
    scorecard: new Array(9).fill(null),
    totalScore: 0,
    totalPar: 0,
    traits: {
      focus: 50,
      swagger: 50,
      humor: 50,
      knowledge: 50,
      zen: 50,
    },
    partner: {
      name: 'Martin',
      impression: 50,
      mood: 'neutral',
      remarks: [],
    },
    flags: {},
    shotModifier: 0,
    dialogueHistory: [],
    roundNarrative: [],
    lastChoice: null,
    lastShotQuality: null,
    // ─── Skill tree state ───
    perks: [],
    pendingPerkUnlocks: [],
    goodShotStreak: 0,
    legendSaveUsed: false,
    shotsTakenThisHole: 0,
    // ─── Shot strategy ───
    shotStrategy: null,
    // ─── Story arc tracking ───
    phoneEventsShown: [],
    walkingMomentsShown: [],
    storyEventsThisHole: [],
    // ─── Panic system ───
    panicAttackActive: false,
    panicAttacksThisRound: 0,
    panicCooldown: 0, // holes remaining before another can trigger
    lastPanicType: null,
    panicRecoveryScore: 0,
  };
}

function applyTraitEffects(state, effects, isDialogue) {
  if (!effects) return;

  for (const [trait, rawDelta] of Object.entries(effects)) {
    let delta = rawDelta;

    if (delta < 0) {
      // Deep Breath: reduce all negative trait effects by 30%
      if (getPerkEffect(state, 'traitLossReduction')) {
        delta = Math.round(delta * getPerkEffect(state, 'traitLossReduction').value);
      }
      // Enlightenment: all negative trait changes halved
      if (getPerkEffect(state, 'globalLossReduction')) {
        delta = Math.round(delta * getPerkEffect(state, 'globalLossReduction').value);
      }
      // Shake It Off: bad shots cause 50% less Focus loss
      if (trait === 'focus' && getPerkEffect(state, 'focusLossReduction')) {
        delta = Math.round(delta * getPerkEffect(state, 'focusLossReduction').value);
      }
      // Let It Go: zen never decreases from shot effects
      if (trait === 'zen' && !isDialogue && getPerkEffect(state, 'zenProtection')) {
        delta = 0;
      }
    }

    // Comedy Gold: positive dialogue gains get +2
    if (isDialogue && delta > 0 && getPerkEffect(state, 'dialogueTraitBoost')) {
      delta += getPerkEffect(state, 'dialogueTraitBoost').value;
    }

    if (state.traits[trait] !== undefined) {
      state.traits[trait] = Math.max(0, Math.min(100, state.traits[trait] + delta));
    }

    if (trait === 'impression' && state.partner) {
      let impDelta = delta;
      // Walk the Walk: impression gains +50%
      if (impDelta > 0 && getPerkEffect(state, 'impressionMultiplier')) {
        impDelta = Math.round(impDelta * getPerkEffect(state, 'impressionMultiplier').value);
      }
      // Ice Breaker: negative impression halved
      if (impDelta < 0 && getPerkEffect(state, 'impressionLossReduction')) {
        impDelta = Math.round(impDelta * getPerkEffect(state, 'impressionLossReduction').value);
      }
      state.partner.impression = Math.max(0, Math.min(100, state.partner.impression + impDelta));
    }
  }

  // Enforce trait floors from perks (e.g. Unbreakable Ego)
  for (const effect of getAllPerkEffects(state, 'traitFloor')) {
    if (state.traits[effect.trait] !== undefined) {
      state.traits[effect.trait] = Math.max(effect.value, state.traits[effect.trait]);
    }
  }

  checkPerkThresholds(state);
}

function checkPerkThresholds(state) {
  const newUnlocks = getAvailablePerks(state);
  for (const unlock of newUnlocks) {
    const alreadyPending = state.pendingPerkUnlocks.some(
      p => p.traitKey === unlock.traitKey && p.tier === unlock.tier
    );
    if (!alreadyPending) {
      state.pendingPerkUnlocks.push(unlock);
    }
  }
}

function setFlag(state, flag, value) {
  state.flags[flag] = value === undefined ? true : value;
}

function hasFlag(state, flag) {
  return !!state.flags[flag];
}

function getFlagValue(state, flag) {
  return state.flags[flag];
}

// ─── Dialogue Tree Engine ───
// A dialogue tree is an array of nodes. Each node has:
//   id:         unique string
//   speaker:    'martin' | 'sato' | 'claire' | 'narrator' | 'thought' | 'you'
//   text:       string or function(state) => string
//   responses:  array of response options (if absent, auto-advance to `next`)
//   next:       id of the next node (for non-interactive nodes)
//   onEnter:    optional function(state) called when node is reached
//
// Each response has:
//   text:           what the player says/thinks
//   label:          category tag shown above the text
//   requires:       { trait: minValue } or function(state) => bool — gates visibility
//   requiresFlag:   string — only show if flag is set
//   requiresNoFlag: string — only show if flag is NOT set
//   traitEffects:   { trait: delta }
//   partnerEffect:  { impression: delta }
//   setFlags:       { flagName: value }
//   shotModifier:   number — added to state.shotModifier (negative = better)
//   next:           id of the next dialogue node
//   end:            true — ends the dialogue

function meetsRequirements(response, state) {
  if (response.requires) {
    if (typeof response.requires === 'function') {
      if (!response.requires(state)) return false;
    } else {
      for (const [trait, minVal] of Object.entries(response.requires)) {
        const current = state.traits[trait] ?? state.partner?.[trait] ?? 0;
        if (current < minVal) return false;
      }
    }
  }
  if (response.requiresFlag && !hasFlag(state, response.requiresFlag)) return false;
  if (response.requiresNoFlag && hasFlag(state, response.requiresNoFlag)) return false;
  return true;
}

function getVisibleResponses(responses, state) {
  return responses
    .filter(r => {
      // Flag-gated options are hidden entirely when unmet (narrative secret)
      if (r.requiresFlag && !hasFlag(state, r.requiresFlag)) return false;
      if (r.requiresNoFlag && hasFlag(state, r.requiresNoFlag)) return false;
      return true;
    })
    .map(r => ({
      ...r,
      locked: !meetsTraitRequirements(r, state),
      lockReason: getLockReason(r, state),
    }));
}

function meetsTraitRequirements(response, state) {
  if (!response.requires) return true;
  if (typeof response.requires === 'function') return response.requires(state);
  for (const [trait, minVal] of Object.entries(response.requires)) {
    const current = state.traits[trait] ?? state.partner?.[trait] ?? 0;
    if (current < minVal) return false;
  }
  return true;
}

function getLockReason(response, state) {
  if (!response.requires || typeof response.requires === 'function') return null;
  for (const [trait, minVal] of Object.entries(response.requires)) {
    const current = state.traits[trait] ?? 0;
    if (current < minVal) {
      const label = TRAITS[trait]?.label || trait.toUpperCase();
      return `${label} ${minVal}+ REQUIRED`;
    }
  }
  return null;
}

function applyResponseEffects(response, state) {
  if (response.traitEffects) applyTraitEffects(state, response.traitEffects, true);
  if (response.partnerEffect) applyTraitEffects(state, response.partnerEffect, true);
  if (response.setFlags) {
    for (const [flag, val] of Object.entries(response.setFlags)) {
      setFlag(state, flag, val);
    }
  }
  if (response.shotModifier) {
    state.shotModifier += response.shotModifier;
  }
  state.dialogueHistory.push({
    hole: state.currentHole,
    responseText: response.text,
    label: response.label,
  });
}

// ─── NPC Stat-Filtered Dialogue ───
// When the player picks a response with receivedVariants, the NPC "hears"
// the stat-filtered version. The player sees what they MEANT to say.
// The narration describes how it LANDED.

function getNpcStatTier(statValue) {
  if (statValue <= 20) return 1;
  if (statValue <= 40) return 2;
  if (statValue <= 60) return 3;
  if (statValue <= 80) return 4;
  return 5;
}

function getReceivedText(response, state) {
  if (!response.receivedVariants) return null;

  const statKey = response.statKey || 'swagger';
  let statValue;

  if (statKey === 'blend' && response.blendStats) {
    const keys = response.blendStats;
    const weights = response.blendWeights || keys.map(() => 1 / keys.length);
    statValue = 0;
    for (let i = 0; i < keys.length; i++) {
      statValue += (state.traits[keys[i]] || 50) * (weights[i] || 0);
    }
  } else {
    statValue = state.traits[statKey] || 50;
  }

  // Perk bonuses to social delivery
  if (hasPerk(state, 'swagger_1a')) statValue = Math.min(100, statValue + 8);
  if (hasPerk(state, 'humor_2a') && statKey === 'humor') statValue = Math.min(100, statValue + 10);
  if (hasPerk(state, 'humor_3a')) statValue = Math.min(100, statValue + 6);

  const tier = getNpcStatTier(statValue);
  return {
    text: response.receivedVariants[tier] || response.receivedVariants[3] || null,
    tier,
    statKey,
  };
}

// ─── Phone System ───
const PHONE_STATE = {
  notifications: [],
  unread: 0,
  history: [],
};

function addPhoneNotification(state, notification) {
  PHONE_STATE.notifications.push({
    ...notification,
    timestamp: Date.now(),
    read: false,
    hole: state.currentHole,
  });
  PHONE_STATE.unread++;
}

function markPhoneRead(notificationId) {
  const n = PHONE_STATE.notifications.find(n => n.id === notificationId);
  if (n && !n.read) {
    n.read = true;
    PHONE_STATE.unread = Math.max(0, PHONE_STATE.unread - 1);
  }
}

function getUnreadCount() {
  return PHONE_STATE.unread;
}

// ─── Objectives System ───
const OBJECTIVES_STATE = {
  active: [],
  completed: [],
  failed: [],
  declined: [],
};

function addObjective(objective) {
  OBJECTIVES_STATE.active.push({
    ...objective,
    acceptedAt: Date.now(),
    status: 'active',
  });
}

function declineObjective(objectiveId) {
  OBJECTIVES_STATE.declined.push(objectiveId);
}

function checkObjectives(state) {
  const results = [];
  for (let i = OBJECTIVES_STATE.active.length - 1; i >= 0; i--) {
    const obj = OBJECTIVES_STATE.active[i];
    if (obj.conditions && obj.conditions(state)) {
      OBJECTIVES_STATE.active.splice(i, 1);
      OBJECTIVES_STATE.completed.push(obj);
      results.push({ objective: obj, result: 'complete' });
    } else if (obj.failConditions && obj.failConditions(state)) {
      OBJECTIVES_STATE.active.splice(i, 1);
      OBJECTIVES_STATE.failed.push(obj);
      results.push({ objective: obj, result: 'failed' });
    }
  }
  return results;
}

function resolveShot(choice, state, shotType) {
  let qualityIndex = choice.baseQualityIndex;

  // ─── Golf is hard. Shift everything slightly toward bogey. ───
  // A "decent golfer" baseline: even the best choice isn't automatic.
  qualityIndex += 0.35;

  // ─── Base trait bonuses (smaller than before — golf is mental but physical too) ───
  const focusBonus = (state.traits.focus - 50) / 140;
  let zenBonus = (state.traits.zen - 50) / 200;

  // Mountain Mind: double zen bonus
  if (getPerkEffect(state, 'zenBonusMultiplier')) {
    zenBonus *= getPerkEffect(state, 'zenBonusMultiplier').value;
  }

  qualityIndex -= (focusBonus + zenBonus);

  // Laughing All the Way: humor as secondary zen
  const humorSynergy = getPerkEffect(state, 'humorZenSynergy');
  if (humorSynergy) {
    qualityIndex -= state.traits.humor / humorSynergy.divisor;
  }

  // ─── Perk: shot type bonuses ───
  if (shotType === 'tee' && getPerkEffect(state, 'teeBonus')) {
    qualityIndex += getPerkEffect(state, 'teeBonus').value;
  }
  if (shotType === 'approach' && getPerkEffect(state, 'approachBonus')) {
    qualityIndex += getPerkEffect(state, 'approachBonus').value;
  }
  if (shotType === 'putt') {
    for (const eff of getAllPerkEffects(state, 'puttBonus')) {
      qualityIndex += eff.value;
    }
  }

  // First Tee Jitters: first shot of hole bonus
  if (state.shotsTakenThisHole === 0 && getPerkEffect(state, 'firstShotBonus')) {
    qualityIndex += getPerkEffect(state, 'firstShotBonus').value;
  }

  // The Zone: streak bonus
  const streakPerk = getPerkEffect(state, 'streakBonus');
  if (streakPerk && state.goodShotStreak > 0) {
    qualityIndex -= state.goodShotStreak * streakPerk.value;
  }

  // Bold Play: rescue bonus for risky choices
  const riskRescue = getPerkEffect(state, 'riskRescue');
  if (riskRescue && choice.baseQualityIndex >= riskRescue.threshold) {
    qualityIndex += riskRescue.value;
  }

  // Swing Mechanics: bad thoughts (high baseQuality) have penalty reduced
  const badThought = getPerkEffect(state, 'badThoughtReduction');
  if (badThought && choice.baseQualityIndex >= 4) {
    const excess = choice.baseQualityIndex - 3;
    qualityIndex -= excess * (1 - badThought.value);
  }

  // Clutch Gene: bonus when over par
  if (state.totalScore > 0 && getPerkEffect(state, 'clutchBonus')) {
    qualityIndex += getPerkEffect(state, 'clutchBonus').value;
  }

  // Flow State: conditional bonus
  const flowState = getPerkEffect(state, 'conditionalBonus');
  if (flowState && state.traits[flowState.trait] > flowState.threshold) {
    qualityIndex += flowState.value;
  }

  // Pressure Player: late round bonus
  const lateRound = getPerkEffect(state, 'lateRoundBonus');
  if (lateRound) {
    const holeNum = COURSE_DATA.holes[state.currentHole]?.number || 0;
    if (holeNum >= lateRound.startHole) {
      qualityIndex += lateRound.value;
    }
  }

  // Life of the Party: random Martin tip bonus
  if (getPerkEffect(state, 'daveTipBonus') && Math.random() < 0.5) {
    qualityIndex += getPerkEffect(state, 'daveTipBonus').value;
  }

  // Tour Pro IQ: knowledge-labeled choices get baseQuality reduced
  const tourPro = getPerkEffect(state, 'knowledgeChoiceBonus');
  if (tourPro) {
    const lbl = (choice.label || '').toUpperCase();
    if (lbl.includes('TECHNICAL') || lbl.includes('COURSE') || lbl.includes('SMART')
        || lbl.includes('VISUALIZATION') || lbl.includes('SPOT')) {
      qualityIndex -= tourPro.value;
    }
  }

  // ─── Dialogue shot modifier ───
  qualityIndex += state.shotModifier;
  state.shotModifier = 0;

  // ─── Randomness (golf has variance — even pros miss) ───
  let randomFactor = (Math.random() - 0.5) * 1.1;

  // Pre-Shot Routine: reduce randomness
  const randomPerk = getPerkEffect(state, 'shotRandomness');
  if (randomPerk) {
    randomFactor *= randomPerk.value;
  }

  // Inner Peace: zero randomness when zen is high
  const zeroPerk = getPerkEffect(state, 'conditionalZeroRandom');
  if (zeroPerk && state.traits[zeroPerk.trait] > zeroPerk.threshold) {
    randomFactor = 0;
  }

  qualityIndex += randomFactor;

  // ─── Resolve quality ───
  const qualities = Object.keys(SHOT_QUALITY);
  let idx = Math.max(0, Math.min(qualities.length - 1, Math.round(qualityIndex)));

  // Unshakeable: putt floor
  const puttFloor = getPerkEffect(state, 'puttFloor');
  if (shotType === 'putt' && puttFloor && idx > puttFloor.value) {
    idx = puttFloor.value;
  }

  let quality = qualities[idx];

  // Legend Mode: one-time save
  const legendPerk = getPerkEffect(state, 'legendSave');
  if (legendPerk && !state.legendSaveUsed && (quality === 'bad' || quality === 'terrible' || quality === 'shank')) {
    quality = 'good';
    state.legendSaveUsed = true;
  }

  // Track streak
  const isGood = ['perfect', 'great', 'good'].includes(quality);
  state.goodShotStreak = isGood ? state.goodShotStreak + 1 : 0;

  state.shotsTakenThisHole++;

  return quality;
}

function calculateHoleScore(state) {
  const hole = COURSE_DATA.holes[state.currentHole];
  if (!hole) return 0;
  const par = hole.par;
  const strokes = state.strokesThisHole;
  return strokes - par;
}

function formatScore(relativeToPar) {
  if (relativeToPar === 0) return 'E';
  if (relativeToPar > 0) return '+' + relativeToPar;
  return '' + relativeToPar;
}

function formatHoleScore(strokes, par) {
  const diff = strokes - par;
  if (diff <= -2) return { text: strokes, class: 'eagle' };
  if (diff === -1) return { text: strokes, class: 'birdie' };
  if (diff === 0) return { text: strokes, class: 'par-score' };
  if (diff === 1) return { text: strokes, class: 'bogey' };
  return { text: strokes, class: 'double-plus' };
}

function getPartnerMood(impression) {
  if (impression >= 80) return 'great';
  if (impression >= 60) return 'good';
  if (impression >= 40) return 'neutral';
  if (impression >= 20) return 'annoyed';
  return 'cold';
}

function advancePhase(state) {
  const phaseOrder = [
    PHASES.HOLE_INTRO,
    PHASES.TEE_SETUP,
    PHASES.TEE_THOUGHT,
    PHASES.TEE_RESULT,
    PHASES.APPROACH_SETUP,
    PHASES.APPROACH_THOUGHT,
    PHASES.APPROACH_RESULT,
    PHASES.PUTT_SETUP,
    PHASES.PUTT_THOUGHT,
    PHASES.PUTT_RESULT,
    PHASES.HOLE_SUMMARY,
    PHASES.BETWEEN_HOLES,
  ];

  const currentIdx = phaseOrder.indexOf(state.phase);

  if (state.phase === PHASES.TITLE) {
    state.phase = PHASES.HOLE_INTRO;
    return;
  }

  if (state.phase === PHASES.BETWEEN_HOLES || state.phase === PHASES.HOLE_SUMMARY) {
    // Move to next hole
    state.currentHole++;
    if (state.currentHole >= COURSE_DATA.holes.length) {
      state.phase = PHASES.ROUND_SUMMARY;
      return;
    }
    state.strokesThisHole = 0;
    state.shotsThisHole = [];
    state.shotsTakenThisHole = 0;
    state.shotStrategy = null;
    state.storyEventsThisHole = [];
    if (state.panicCooldown > 0) state.panicCooldown--;
    state.phase = PHASES.HOLE_INTRO;
    return;
  }

  // On par 3s, skip approach — tee shot goes directly to the green
  if (state.phase === PHASES.TEE_RESULT) {
    const hole = COURSE_DATA.holes[state.currentHole];
    if (hole && hole.par === 3) {
      state.phase = PHASES.PUTT_SETUP;
      return;
    }
  }

  if (currentIdx >= 0 && currentIdx < phaseOrder.length - 1) {
    state.phase = phaseOrder[currentIdx + 1];
  }
}
