// ─── Main Game Loop ───

let state;
let mpEnabled = false;

function initGame() {
  UI.init();
  AudioPlayer.init();
  state = createGameState();
  showTitle();
}

// ─── Multiplayer State Sync ───
function syncMultiplayerState() {
  if (mpEnabled && MP.connected) {
    MP.sendStateUpdate(state);
  }
}

async function showTitle() {
  UI.clear();
  await UI.typeText('CORPORATE GOLF', 'hole-title');
  await sleep(200);
  await UI.typeText('FUJO INTERNATIONAL — FRONT NINE', 'hole-stats');
  await sleep(500);
  await UI.typeText('Gravel courtyard. Cedar and wet stone. Cherry blossoms on the practice green.', 'scene');
  await sleep(400);
  await UI.typeText('Martin Voss adjusts his glove. Sato stands beside him, posture perfect.', 'action');
  await sleep(300);
  await UI.typeText('"Ready?"', 'dialogue-martin');
  await sleep(400);

  UI.showAction('TEE IT UP', '', () => {
    SFX.init();
    SFX.startAmbient('course');
    state.phase = PHASES.HOLE_INTRO;
    runPhase();
  });
}

async function runPhase() {
  const hole = COURSE_DATA.holes[state.currentHole];
  UI.updateHeader(state);
  UI.updateTraits(state);
  UI.updateScorecard(state);
  syncMultiplayerState();

  switch (state.phase) {
    case PHASES.HOLE_INTRO:
      await showHoleIntro(hole);
      break;
    case PHASES.TEE_SETUP:
      await showTeeSetup(hole);
      break;
    case PHASES.TEE_THOUGHT:
      await showSwingThought('tee', hole);
      break;
    case PHASES.TEE_RESULT:
      await showShotResult('tee', hole);
      break;
    case PHASES.APPROACH_SETUP:
      await showApproachSetup(hole);
      break;
    case PHASES.APPROACH_THOUGHT:
      await showSwingThought('approach', hole);
      break;
    case PHASES.APPROACH_RESULT:
      await showShotResult('approach', hole);
      break;
    case PHASES.PUTT_SETUP:
      await showPuttSetup(hole);
      break;
    case PHASES.PUTT_THOUGHT:
      await showSwingThought('putt', hole);
      break;
    case PHASES.PUTT_RESULT:
      await showPuttResult(hole);
      break;
    case PHASES.HOLE_SUMMARY:
      await showHoleSummary(hole);
      break;
    case PHASES.BETWEEN_HOLES:
      await showBetweenHoles();
      break;
    case PHASES.ROUND_SUMMARY:
      await showRoundSummary();
      break;
  }
}

async function showHoleIntro(hole) {
  UI.clear();
  SFX.holeTransition();

  // Escalating stakes flavor text based on hole progression
  const stakesBeat = getStakesBeat(state.currentHole);
  if (stakesBeat) {
    await UI.typeText(stakesBeat, 'thought', 20);
    await sleep(400);
  }

  UI.addHoleTitle(hole);
  await sleep(300);
  await UI.typeText(hole.teeDescription, 'scene', 18);
  await sleep(400);

  UI.showAction('STEP UP TO THE BALL', '', () => {
    state.shotStrategy = null;
    advancePhase(state);
    runPhase();
  });
}

function getStakesBeat(holeIdx) {
  const hole = holeIdx + 1;
  if (hole === 1) return null;
  if (hole === 3 && !hasFlag(state, 'claire_contacted')) {
    return `Phone vibrates. You don't check it.`;
  }
  if (hole === 5) {
    if (hasFlag(state, 'cooperating_with_claire')) {
      SFX.startAmbient('tense');
      return `Claire's thread is live. Sato is watching. This is no longer just golf.`;
    }
    return `The casual holes are behind you. It starts here.`;
  }
  if (hole === 7) {
    return `Two holes left. Every shot matters now.`;
  }
  if (hole === 9) {
    return `The ninth. Last hole.`;
  }
  return null;
}

async function showTeeSetup(hole) {
  UI.clearChoices();
  await UI.typeText(`${hole.yards} yards. Driver. You take your stance.`, 'action', 20);
  await sleep(300);

  showShotStrategy('tee', hole, () => {
    advancePhase(state);
    runPhase();
  });
}

async function showApproachSetup(hole) {
  UI.clearChoices();
  if (hole.approachDescription) {
    const desc = hole.approachDescription
      .replace('{approach_distance}', String(80 + Math.floor(Math.random() * 100)))
      .replace('{carry_distance}', String(150 + Math.floor(Math.random() * 50)));
    await UI.typeText(desc, 'scene', 18);
  } else {
    await UI.typeText(`You walk to your ball. The green is ahead.`, 'scene', 20);
  }
  await sleep(300);

  showShotStrategy('approach', hole, () => {
    advancePhase(state);
    runPhase();
  });
}

async function showPuttSetup(hole) {
  UI.clearChoices();
  state.shotStrategy = null; // putts don't use strategy

  const distances = ['6 feet', '10 feet', '15 feet', '20 feet', '25 feet', '30 feet'];
  const breaks = ['left to right', 'right to left', 'slightly uphill', 'downhill and breaking'];
  const dist = distances[Math.floor(Math.random() * distances.length)];
  const brk = breaks[Math.floor(Math.random() * breaks.length)];

  if (hole.puttDescription) {
    const desc = hole.puttDescription
      .replace('{distance}', dist)
      .replace('{break_direction}', brk);
    await UI.typeText(desc, 'scene', 18);
  } else {
    await UI.typeText(`On the green. ${dist}, ${brk}.`, 'scene', 20);
  }
  await sleep(300);

  UI.showAction('PUTT', '', () => {
    advancePhase(state);
    runPhase();
  });
}

async function showSwingThought(shotType, hole) {
  UI.clearChoices();

  // ─── Panic Attack Check ───
  if (PANIC_TRIGGERS.check(state)) {
    await runPanicAttack(shotType, hole);
    return;
  }

  // Corporate swing thought injection
  const corpKey = `hole_${hole.number}_${shotType}`;
  const corpThought = CORPORATE_SWING_THOUGHTS[corpKey];
  if (corpThought && corpThought.conditions(state)) {
    await UI.typeText(corpThought.setup, 'thought', 22);
    await sleep(300);
  } else {
    const scenario = getScenario(shotType, hole.number);
    await UI.typeText(scenario.setup, 'thought', 22);
    await sleep(300);
  }

  // Timer adjusts based on shot strategy
  let timerMs = 2200;
  if (state.shotStrategy === 'aggressive') timerMs = 1600;
  else if (state.shotStrategy === 'safe') timerMs = 2800;

  // Get thoughts, apply Claire colonization, add aftershock thoughts
  let thoughts = getMicroThoughts(shotType, 5, state);
  thoughts = colonizeThoughts(thoughts, shotType, state);

  UI.showMicroThoughts(thoughts, timerMs, async (thought, wasTimeout) => {
    if (wasTimeout) {
      await UI.typeText(`Your mind wandered: "${thought.text}"`, 'action', 15);
    } else {
      const prefix = thought.colonized ? 'Claire\'s voice: ' : '';
      await UI.typeText(`${prefix}"${thought.text}"`, 'action', 15);
    }
    await sleep(200);

    const quality = resolveMicroShot(thought, state, shotType);
    state.lastShotQuality = quality;
    state.strokesThisHole++;

    const choiceProxy = {
      label: thought.text,
      text: thought.text,
      baseQualityIndex: 2 + thought.quality,
      traitEffects: thought.traitEffects || {},
      resultNarrative: buildMicroResultNarrative(thought, quality, shotType),
    };
    state.lastChoice = choiceProxy;
    state.shotsThisHole.push({ type: shotType, quality, choice: choiceProxy });

    applyTraitEffects(state, thought.traitEffects || {});

    if (['perfect', 'great'].includes(quality) && getPerkEffect(state, 'greatShotSwaggerBoost')) {
      const boost = getPerkEffect(state, 'greatShotSwaggerBoost').value;
      state.traits.swagger = Math.min(100, state.traits.swagger + boost);
    }

    UI.updateTraits(state);

    if (state.pendingPerkUnlocks.length > 0) {
      await handlePerkUnlocks();
    }

    advancePhase(state);
    runPhase();
  });
}

// ─── Panic Attack Flow ───
// Multi-phase: ONSET → SPIRAL (3 rounds) → THE VOID → RECOVERY → resume game
async function runPanicAttack(shotType, hole) {
  state.panicAttackActive = true;
  state.panicAttacksThisRound++;
  state.panicCooldown = 2;

  // Phase 1: ONSET
  SFX.panicOnset();
  SFX.startAmbient('panic');
  const onset = getPanicOnset(state);
  state.lastPanicType = onset.type;
  await UI.showPanicOnset(onset);
  await sleep(800);

  // Phase 2: SPIRAL (3 rounds of rapid micro-thought selection)
  const rounds = getPanicSpiralRounds(state, onset.type);
  let totalRecovery = 0;

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];

    if (i > 0) {
      UI.clearChoices();
      await sleep(400);
    }
    SFX.panicTick();

    const spiralResult = await new Promise(resolve => {
      UI.showPanicSpiral(round, (thought, wasTimeout) => {
        resolve({ thought, wasTimeout });
      });
    });

    const t = spiralResult.thought;
    totalRecovery += t.recovery;
    applyTraitEffects(state, t.traitEffects || {});
    UI.updateTraits(state);

    const display = spiralResult.wasTimeout ? `Your mind screams: "${t.text}"` : `"${t.text}"`;
    UI.clearChoices();
    await UI.typeText(display, t.recovery >= 2 ? 'action' : 'panic-line', 12);
    await sleep(300);
  }

  state.panicRecoveryScore = totalRecovery;

  // Phase 3: THE VOID (Lynchian interlude)
  SFX.startAmbient('void');
  await sleep(600);
  const voidData = getPanicVoid(state, onset.type, totalRecovery);

  const voidChoice = await new Promise(resolve => {
    UI.showPanicVoid(voidData, (choice) => {
      resolve(choice);
    });
  });

  applyTraitEffects(state, voidChoice.traitEffects || {});
  if (voidChoice.partnerEffect) {
    state.partner.impression = Math.max(0, Math.min(100, state.partner.impression + voidChoice.partnerEffect));
  }
  UI.updateTraits(state);

  await sleep(500);
  UI.clearChoices();

  // Transition out of the void
  if (voidChoice.effect === 'ground') {
    UI.narrativeEl.innerHTML = '';
    await UI.typeText('You blink. The ball is there.', 'panic-line', 30);
    await sleep(400);
  } else {
    UI.narrativeEl.innerHTML = '';
    await UI.typeText('The world comes back. Not all of it.', 'panic-line', 25);
    await sleep(400);
  }

  // Phase 4: RECOVERY (Martin dialogue)
  const recovery = getPanicRecovery(state, onset.type, voidChoice.effect);
  await sleep(300);
  await UI.typeText(recovery.martinOpener, 'dialogue-martin', 18);
  await sleep(500);

  await new Promise(resolve => {
    UI.showDialogueResponses(recovery.responses.map(r => ({
      ...r,
      locked: false,
    })), state, async (chosen) => {
      if (chosen.traitEffects) applyTraitEffects(state, chosen.traitEffects);
      if (chosen.partnerEffect) applyTraitEffects(state, chosen.partnerEffect, true);
      if (chosen.setFlags) {
        for (const [f, v] of Object.entries(chosen.setFlags)) setFlag(state, f, v);
      }
      UI.updateTraits(state);

      if (chosen.narrative) {
        await sleep(400);
        await UI.typeText(chosen.narrative, 'scene', 18);
      }
      resolve();
    });
  });

  // End panic mode
  state.panicAttackActive = false;
  UI.endPanicMode();
  SFX.startAmbient(hasFlag(state, 'cooperating_with_claire') && state.currentHole >= 4 ? 'tense' : 'course');

  await sleep(600);

  // Resume game — the shot still needs to happen
  UI.clearChoices();
  const resumeText = state.panicRecoveryScore >= 5
    ? `You pick up your club. Steadier now.`
    : `You pick up your club. The ball is there. Start with the ball.`;
  await UI.typeText(resumeText, 'action', 20);
  await sleep(400);

  UI.showAction('SWING', '', () => {
    // Now run the normal swing thought phase (panic won't re-trigger due to cooldown)
    state.panicCooldown = 2;
    showSwingThoughtPostPanic(shotType, hole);
  });
}

async function showSwingThoughtPostPanic(shotType, hole) {
  UI.clearChoices();

  const postPanicSetup = state.panicRecoveryScore >= 5
    ? `The backswing. Slower this time.`
    : `The backswing. Your mind is still elsewhere.`;

  await UI.typeText(postPanicSetup, 'thought', 22);
  await sleep(300);

  // Post-panic: compressed timer, thoughts include aftershock content
  const timerMs = 2000;
  let thoughts = getMicroThoughts(shotType, 5, state);
  thoughts = colonizeThoughts(thoughts, shotType, state);

  UI.showMicroThoughts(thoughts, timerMs, async (thought, wasTimeout) => {
    if (wasTimeout) {
      await UI.typeText(`Your mind wandered: "${thought.text}"`, 'action', 15);
    } else {
      const prefix = thought.colonized ? 'Claire\'s voice: ' : '';
      await UI.typeText(`${prefix}"${thought.text}"`, 'action', 15);
    }
    await sleep(200);

    const quality = resolveMicroShot(thought, state, shotType);
    state.lastShotQuality = quality;
    state.strokesThisHole++;

    const choiceProxy = {
      label: thought.text,
      text: thought.text,
      baseQualityIndex: 2 + thought.quality,
      traitEffects: thought.traitEffects || {},
      resultNarrative: buildMicroResultNarrative(thought, quality, shotType),
    };
    state.lastChoice = choiceProxy;
    state.shotsThisHole.push({ type: shotType, quality, choice: choiceProxy });
    applyTraitEffects(state, thought.traitEffects || {});

    if (['perfect', 'great'].includes(quality) && getPerkEffect(state, 'greatShotSwaggerBoost')) {
      state.traits.swagger = Math.min(100, state.traits.swagger + getPerkEffect(state, 'greatShotSwaggerBoost').value);
    }

    UI.updateTraits(state);
    if (state.pendingPerkUnlocks.length > 0) await handlePerkUnlocks();

    advancePhase(state);
    runPhase();
  });
}

function buildMicroResultNarrative(thought, quality, shotType) {
  const narratives = {
    focus: {
      good: 'Locked in. Clean strike.',
      bad: 'Focused, but the body didn\'t follow.',
    },
    distraction: {
      good: 'Hands remembered what to do. Lucky.',
      bad: 'Autopilot. Not great.',
    },
    swagger: {
      good: 'Crushed it.',
      bad: 'Ambition exceeded ability.',
    },
    anxiety: {
      good: 'Fear sharpened you. Solid.',
      bad: 'Flinched mid-swing.',
    },
    neutral: {
      good: 'Clean strike. No drama.',
      bad: 'Mushy contact.',
    },
  };
  const cat = narratives[thought.category] || narratives.neutral;
  return { good: cat.good, bad: cat.bad };
}

async function showShotResult(shotType, hole) {
  UI.clearChoices();
  const lastShot = state.shotsThisHole[state.shotsThisHole.length - 1];
  const quality = lastShot.quality;
  const choice = lastShot.choice;
  const qualityData = SHOT_QUALITY[quality];

  const isGoodResult = ['perfect', 'great', 'good'].includes(quality);
  if (['perfect', 'great', 'good'].includes(quality)) SFX.shotGood();
  else if (quality === 'shank') SFX.shotShank();
  else SFX.shotBad();
  const narrativeKey = isGoodResult ? 'good' : 'bad';
  const narrativeText = choice.resultNarrative[narrativeKey];

  await UI.typeText(narrativeText, qualityData.color, 20);
  await sleep(300);

  const shotLabel = qualityData.label.toUpperCase();
  UI.addText(`[ ${shotLabel} ]`, `thought`);
  await sleep(400);

  UI.showAction('CONTINUE', '', () => {
    advancePhase(state);
    runPhase();
  });
}

async function showPuttResult(hole) {
  UI.clearChoices();
  const lastShot = state.shotsThisHole[state.shotsThisHole.length - 1];
  const quality = lastShot.quality;
  const choice = lastShot.choice;
  const qualityData = SHOT_QUALITY[quality];

  const isGoodResult = ['perfect', 'great', 'good'].includes(quality);
  if (isGoodResult) SFX.shotGood();
  else SFX.shotBad();
  const narrativeKey = isGoodResult ? 'good' : 'bad';
  const narrativeText = choice.resultNarrative[narrativeKey];

  await UI.typeText(narrativeText, qualityData.color, 20);
  await sleep(300);

  // Determine if putt went in or needs another
  if (['perfect', 'great'].includes(quality)) {
    UI.addText('[ PUTT SINKS ]', 'thought');
  } else if (quality === 'good') {
    state.strokesThisHole++;
    UI.addText('[ TAP IN ]', 'thought');
  } else {
    // Missed putt, add extra strokes
    const extraPutts = quality === 'okay' ? 1 : quality === 'bad' ? 2 : 3;
    state.strokesThisHole += extraPutts;
    UI.addText(`[ ${extraPutts > 1 ? extraPutts + ' MORE PUTTS' : 'ONE MORE PUTT'} ]`, 'thought');
  }

  await sleep(400);

  // Record hole score
  const holeScore = state.strokesThisHole;
  state.scorecard[state.currentHole] = holeScore;
  const relativeToPar = holeScore - hole.par;
  state.totalScore += relativeToPar;
  state.totalPar += hole.par;

  UI.updateHeader(state);
  UI.updateScorecard(state);

  UI.showAction('WALK OFF THE GREEN', 'gold', () => {
    state.phase = PHASES.HOLE_SUMMARY;
    runPhase();
  });
}

async function showHoleSummary(hole) {
  UI.clearChoices();
  const strokes = state.scorecard[state.currentHole];
  const diff = strokes - hole.par;

  let label;
  if (diff <= -2) label = 'EAGLE';
  else if (diff === -1) label = 'BIRDIE';
  else if (diff === 0) label = 'PAR';
  else if (diff === 1) label = 'BOGEY';
  else if (diff === 2) label = 'DOUBLE BOGEY';
  else label = `+${diff}`;

  const colorClass = diff < 0 ? 'result-good' : diff === 0 ? 'action' : diff <= 1 ? 'result-bad' : 'result-terrible';

  await UI.typeText(`Hole ${hole.number}: ${strokes} strokes.`, 'action', 25);
  await sleep(200);
  UI.addText(label, colorClass);
  await sleep(300);

  if (diff <= -1) {
    await UI.typeText(`Martin inclines his head. "That's how it's done."`, 'dialogue-martin', 20);
    state.partner.impression = Math.min(100, state.partner.impression + 5);
  } else if (diff === 0) {
    await UI.typeText(`Martin adjusts his glove. "Solid par. Next hole."`, 'dialogue-martin', 20);
  } else if (diff === 1) {
    await UI.typeText(`Martin checks the yardage card. "Bogey's not terminal. Move on."`, 'dialogue-martin', 20);
  } else {
    await UI.typeText(`Martin gazes at the mountain, giving you space. Some holes are best forgotten.`, 'dialogue-martin', 20);
    state.partner.impression = Math.max(0, state.partner.impression - 3);
  }

  // Course Management: par/bogey gives knowledge
  const scoringPerk = getPerkEffect(state, 'scoringKnowledgeBoost');
  if (scoringPerk && (diff === 0 || diff === 1)) {
    state.traits.knowledge = Math.min(100, state.traits.knowledge + scoringPerk.value);
    UI.flashTraitChange('knowledge', scoringPerk.value);
  }

  // Lighten the Mood: disaster zen recovery
  const disasterPerk = getPerkEffect(state, 'disasterZenRecovery');
  if (disasterPerk && diff >= 2) {
    state.traits.zen = Math.min(100, state.traits.zen + disasterPerk.value);
    UI.flashTraitChange('zen', disasterPerk.value);
  }

  // Reset per-hole counters
  state.shotsTakenThisHole = 0;

  await sleep(400);
  state.partner.mood = getPartnerMood(state.partner.impression);
  checkPerkThresholds(state);

  // Handle any pending perk unlocks before moving on
  if (state.pendingPerkUnlocks.length > 0) {
    await handlePerkUnlocks();
  }

  if (state.currentHole >= COURSE_DATA.holes.length - 1) {
    UI.showAction('FINISH THE ROUND', 'gold', () => {
      state.currentHole++;
      state.phase = PHASES.ROUND_SUMMARY;
      runPhase();
    });
  } else {
    UI.showAction('NEXT HOLE', '', () => {
      state.phase = PHASES.BETWEEN_HOLES;
      runPhase();
    });
  }
}

// ─── Shot Strategy ───
function showShotStrategy(shotType, hole, onComplete) {
  UI.clearChoices();

  const safeLabel = shotType === 'tee' ? 'LAY UP — IRON' : 'SAFE — CENTER GREEN';
  const aggrLabel = shotType === 'tee' ? 'RIP IT — DRIVER' : 'ATTACK — GO AT THE PIN';
  const safeDesc = shotType === 'tee'
    ? 'Lower risk. More time to think. Won\'t reach the best positions.'
    : 'Play to the middle. Easier shot, but you won\'t impress anyone.';
  const aggrDesc = shotType === 'tee'
    ? 'Maximum distance. Less time to think. Glory or disaster.'
    : 'Go flag hunting. Harder micro-thoughts, faster timer, higher ceiling.';

  UI.showShotStrategy(safeLabel, safeDesc, aggrLabel, aggrDesc, (choice) => {
    state.shotStrategy = choice;
    onComplete();
  });
}

// ─── Phone Events ───
async function checkPhoneEvent(holeIndex) {
  const event = PHONE_EVENTS.find(e =>
    e.hole === holeIndex + 1 && !state.phoneEventsShown.includes(e.id)
  );
  if (!event) return false;

  state.phoneEventsShown.push(event.id);
  await showPhoneEvent(event);
  return true;
}

async function showPhoneEvent(event) {
  await sleep(300);
  SFX.phoneVibrate();
  if (event.type === 'text') {
    await UI.typeText(`📱 ${event.from}`, 'phone-sender', 15);
    const fullText = typeof event.fullText === 'function' ? event.fullText(state) : event.fullText;
    await UI.typeText(fullText, 'phone-text', 18);
    if (event.implicitFlags) {
      for (const [f, v] of Object.entries(event.implicitFlags)) setFlag(state, f, v);
    }
    await sleep(500);

    if (event.responses && event.responses.length > 0) {
      await new Promise(resolve => {
        UI.showDialogueResponses(event.responses.map(r => ({
          ...r,
          locked: false,
        })), state, (chosen) => {
          if (chosen.traitEffects) applyTraitEffects(state, chosen.traitEffects);
          if (chosen.setFlags) {
            for (const [f, v] of Object.entries(chosen.setFlags)) setFlag(state, f, v);
          }
          setFlag(state, 'claire_contacted', true);
          UI.updateTraits(state);
          resolve();
        });
      });
      await sleep(400);
    }
  } else if (event.type === 'call') {
    await UI.typeText(`📞 ${event.preview}`, 'phone-call', 15);
    await sleep(400);

    if (event.dialogue) {
      for (const line of event.dialogue) {
        await UI.showSpeakerText(line.speaker, line.text, 18);
        await sleep(400);
      }
    }

    if (event.responses && event.responses.length > 0) {
      await new Promise(resolve => {
        UI.showDialogueResponses(event.responses.map(r => ({
          ...r,
          locked: false,
        })), state, async (chosen) => {
          if (chosen.traitEffects) applyTraitEffects(state, chosen.traitEffects);
          if (chosen.setFlags) {
            for (const [f, v] of Object.entries(chosen.setFlags)) setFlag(state, f, v);
          }
          UI.updateTraits(state);
          if (chosen.claireReply) {
            await sleep(300);
            await UI.showSpeakerText('claire', chosen.claireReply, 18);
          }
          if (chosen.narrative) {
            await sleep(300);
            await UI.typeText(chosen.narrative, 'scene', 18);
          }
          resolve();
        });
      });
      await sleep(400);
    }
  }
}

// ─── Walking Moments ───
async function checkWalkingMoment(holeIndex) {
  const moment = STORY_WALKING_MOMENTS.find(m =>
    m.hole === holeIndex + 1 && !state.walkingMomentsShown.includes(m.id)
    && (!m.conditions || m.conditions(state))
  );
  if (!moment) return false;

  state.walkingMomentsShown.push(moment.id);
  await showWalkingMoment(moment);
  return true;
}

async function showWalkingMoment(moment) {
  await sleep(300);
  const text = typeof moment.text === 'function' ? moment.text(state) : moment.text;
  await UI.typeText(text, 'scene', 18);
  await sleep(500);

  if (moment.choices && moment.choices.length > 0) {
    await new Promise(resolve => {
      UI.showDialogueResponses(moment.choices.map(c => ({
        ...c,
        locked: false,
      })), state, async (chosen) => {
        if (chosen.traitEffects) applyTraitEffects(state, chosen.traitEffects);
        if (chosen.partnerEffect) applyTraitEffects(state, chosen.partnerEffect);
        if (chosen.setFlags) {
          for (const [f, v] of Object.entries(chosen.setFlags)) setFlag(state, f, v);
        }
        UI.updateTraits(state);
        if (chosen.narrative) {
          await sleep(300);
          await UI.typeText(chosen.narrative, 'scene', 18);
        }
        resolve();
      });
    });
    await sleep(400);
  }
}

async function showBetweenHoles() {
  UI.clearChoices();

  // Phone events fire first
  await checkPhoneEvent(state.currentHole);

  // Walking moments
  await checkWalkingMoment(state.currentHole);

  // Dialogue trees
  const tree = getDialogueTree(state.currentHole);
  if (tree) {
    await runDialogueTree(tree);
  } else {
    const mood = state.partner.mood;
    const dialogue = getBetweenHolesDialogue(mood);
    await UI.typeText(dialogue, 'dialogue', 20);
    await sleep(500);
  }

  UI.clearChoices();
  await sleep(300);

  UI.showAction('CONTINUE', '', () => {
    advancePhase(state);
    runPhase();
  });
}

async function runDialogueTree(tree) {
  let currentNode = getDialogueNode(tree, 'start');
  if (!currentNode) return;

  while (currentNode) {
    if (currentNode.onEnter) currentNode.onEnter(state);

    const text = typeof currentNode.text === 'function'
      ? currentNode.text(state)
      : currentNode.text;

    if (text) {
      await UI.showSpeakerText(currentNode.speaker, text, 20);
      await sleep(400);
    }

    if (currentNode.end) break;

    if (currentNode.responses && currentNode.responses.length > 0) {
      const unlocked = currentNode.responses.filter(r => meetsRequirements(r, state) || r.locked === undefined);
      if (unlocked.length === 0 && currentNode.next) {
        currentNode = getDialogueNode(tree, currentNode.next);
        continue;
      }

      const chosen = await presentDialogueChoices(currentNode.responses);
      if (!chosen) break;

      applyResponseEffects(chosen, state);

      // Flash trait changes in the UI
      if (chosen.traitEffects) {
        for (const [trait, delta] of Object.entries(chosen.traitEffects)) {
          if (TRAITS[trait]) UI.flashTraitChange(trait, delta);
        }
      }
      if (chosen.partnerEffect?.impression) {
        state.partner.mood = getPartnerMood(state.partner.impression);
      }

      UI.updateTraits(state);

      // Handle perk unlocks triggered by dialogue
      if (state.pendingPerkUnlocks.length > 0) {
        await handlePerkUnlocks();
      }

      await sleep(300);

      // Show what the player said as dialogue
      await UI.showSpeakerText('you', chosen.text, 18);
      await sleep(400);

      if (chosen.end) break;
      if (chosen.next) {
        currentNode = getDialogueNode(tree, chosen.next);
      } else {
        break;
      }
    } else if (currentNode.next) {
      currentNode = getDialogueNode(tree, currentNode.next);
    } else {
      break;
    }
  }
}

function presentDialogueChoices(responses) {
  return new Promise(resolve => {
    UI.showDialogueResponses(responses, state, (chosen) => {
      resolve(chosen);
    });
  });
}

async function showRoundSummary() {
  UI.clear();
  SFX.stopAmbient();
  await UI.typeText('THE FRONT NINE', 'hole-title');
  await sleep(300);
  await UI.typeText('CORPORATE GOLF — FUJO INTERNATIONAL', 'hole-stats');
  await sleep(500);

  // Score summary
  let totalStrokes = 0;
  let totalPar = 0;
  for (let i = 0; i < COURSE_DATA.holes.length; i++) {
    if (state.scorecard[i] !== null) {
      totalStrokes += state.scorecard[i];
      totalPar += COURSE_DATA.holes[i].par;
    }
  }
  const overall = totalStrokes - totalPar;

  await UI.typeText(`Total: ${totalStrokes} strokes (${formatScore(overall)})`, 'action', 20);
  await sleep(400);

  // Personality summary
  const traits = state.traits;
  const dominant = Object.entries(traits).sort((a, b) => b[1] - a[1])[0];
  const weakest = Object.entries(traits).sort((a, b) => a[1] - b[1])[0];

  await UI.typeText(`Your strongest trait: ${TRAITS[dominant[0]].label} (${dominant[1]})`, 'result-good', 20);
  await UI.typeText(`Your weakest trait: ${TRAITS[weakest[0]].label} (${weakest[1]})`, 'result-bad', 20);
  await sleep(300);

  // Perks unlocked
  if (state.perks.length > 0) {
    await UI.typeText(`Perks unlocked: ${state.perks.length}`, 'action', 20);
    for (const pid of state.perks) {
      const perk = getPerkById(pid);
      if (perk) {
        const treeKey = Object.keys(SKILL_TREES).find(k => SKILL_TREES[k].perks.some(p => p.id === pid));
        const tree = SKILL_TREES[treeKey];
        UI.addText(`${tree ? tree.icon : '•'} ${perk.name} — ${perk.description}`, 'thought');
      }
    }
    await sleep(300);
  }

  // Partner summary — enriched by dialogue choices
  const imp = state.partner.impression;
  let partnerSummary;
  if (imp >= 80) {
    partnerSummary = `Martin shakes your hand. "Interesting round." From him, that's effusive.`;
  } else if (imp >= 60) {
    partnerSummary = `Martin nods. "Acceptable." He says it like a grade.`;
  } else if (imp >= 40) {
    partnerSummary = `"Thank you for the game." Courteous. Forgettable.`;
  } else if (imp >= 20) {
    partnerSummary = `Martin is speaking with Sato. When he looks your way, it's blank.`;
  } else {
    partnerSummary = `Martin has moved ahead. You're alone with the mountain.`;
  }
  await sleep(300);
  await UI.typeText(partnerSummary, 'scene', 18);

  // Memory-driven ending callbacks
  if (hasFlag(state, 'bet_with_martin')) {
    await sleep(300);
    const won = overall <= 0;
    if (won) {
      await UI.typeText(`"A wager is a wager." Martin almost smiles. "Dinner's on me."`, 'dialogue-martin', 18);
    } else {
      await UI.typeText(`"You're buying." Martin taps the menu.`, 'dialogue-martin', 18);
    }
  }
  if (hasFlag(state, 'martin_family_story') && hasFlag(state, 'empathized_with_martin')) {
    await sleep(300);
    await UI.typeText(`"My father would have liked how you played seven."`, 'dialogue-martin', 18);
  }
  if (hasFlag(state, 'thanked_martin') && imp >= 60) {
    await sleep(300);
    await UI.typeText(`Martin saves your contact. "We'll be in touch."`, 'scene', 18);
  }
  if (hasFlag(state, 'sentimental_9')) {
    await sleep(300);
    await UI.typeText(`You look back at the ninth one more time.`, 'scene', 18);
  }

  await sleep(500);

  // Story arc ending
  const ending = resolveStoryEnding(state);
  if (ending) {
    await sleep(400);
    await UI.typeText(`— ${ending.name} —`, 'hole-title');
    await sleep(300);
    await UI.typeText(ending.description, 'scene', 18);
  } else {
    await UI.typeText(`The front nine is behind you. Your phone has 11 unread emails. For nine holes, none of them mattered.`, 'scene', 18);
  }

  await sleep(600);
  UI.showAction('PLAY AGAIN', '', () => {
    state = createGameState();
    showTitle();
  });
}

function resolveStoryEnding(s) {
  const imp = s.partner.impression;

  if (s.traits.zen >= 80 && hasFlag(s, 'chose_self') && imp >= 50) {
    return ENDINGS.transcendent;
  }
  if (imp < 30 && (s.traits.focus < 30 || s.traits.zen < 30)) {
    return ENDINGS.collapse;
  }
  if (hasFlag(s, 'cooperating_with_claire') && hasFlag(s, 'used_martin_info') && !hasFlag(s, 'warned_martin_about_claire')) {
    return ENDINGS.betrayal;
  }
  if (imp >= 70 && (hasFlag(s, 'warned_martin_about_claire') || hasFlag(s, 'advocated_for_martin') || hasFlag(s, 'chose_martin') || hasFlag(s, 'committed_to_vk_on_call')) && !hasFlag(s, 'used_martin_info')) {
    return ENDINGS.ally;
  }
  if (imp >= 40 && imp < 70 && (hasFlag(s, 'accepted_claire_deal') || hasFlag(s, 'chose_career')) && !hasFlag(s, 'empathized_with_martin')) {
    return ENDINGS.rival;
  }

  return null;
}

// ─── Perk Unlock Flow ───
async function handlePerkUnlocks() {
  while (state.pendingPerkUnlocks.length > 0) {
    const unlock = state.pendingPerkUnlocks.shift();
    await showPerkSelection(unlock);
    UI.updateTraits(state);
  }
}

function showPerkSelection(unlock) {
  return new Promise(resolve => {
    const tree = SKILL_TREES[unlock.traitKey];
    const tierDef = PERK_TIERS.find(t => t.tier === unlock.tier);

    UI.showPerkUnlockOverlay({
      treeName: tree.name,
      treeIcon: tree.icon,
      treeColor: tree.color,
      tierLabel: tierDef.label,
      threshold: tierDef.threshold,
      traitValue: state.traits[unlock.traitKey],
      perks: unlock.perks,
      onSelect: (perk) => {
        state.perks.push(perk.id);
        UI.hidePerkUnlockOverlay();
        resolve();
      },
    });
  });
}

// ─── Character Sheet ───
function toggleCharacterSheet() {
  const overlay = document.getElementById('character-sheet-overlay');
  if (overlay.classList.contains('open')) {
    overlay.classList.remove('open');
  } else {
    UI.renderCharacterSheet(state);
    overlay.classList.add('open');
  }
}

// ─── Multiplayer Flow ───
function openMultiplayerLobby() {
  MP_UI.showLobby(async (playerName, roomCode) => {
    try {
      const serverUrl = window.location.origin;
      const data = await MP.connect(serverUrl, playerName, roomCode);

      mpEnabled = true;
      MP_UI.showConnected(data.code, data.players);
      MP_UI.updatePlayerCount(data.players.length);

      // Wire encounter events
      MP.onEncounterStart((encData) => {
        MP_UI.showEncounter(
          encData,
          (choiceId, rawText) => {
            MP.sendDialogue(choiceId, rawText);
          },
          () => {
            MP.endEncounter();
            MP_UI.hideEncounter();
          }
        );
      });

      MP.onEncounterEnd(() => {
        MP_UI.hideEncounter();
      });

      MP.onDialogueReceived((data) => {
        MP_UI.appendEncounterMessage(data.fromName, data.text, data.isSelf);
      });

      MP.onPlayersChanged((players) => {
        MP_UI.updatePlayerCount(players.length);
      });

      // Start button in lobby
      const startBtn = document.getElementById('mp-start-btn');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          MP_UI.hideLobby();
        });
      }
    } catch (err) {
      console.error('MP connection failed:', err);
      alert('Could not connect to server. Make sure the server is running.');
    }
  });
}

// ─── Boot ───
document.addEventListener('DOMContentLoaded', () => {
  initGame();

  const statBtn = document.getElementById('stat-btn');
  if (statBtn) {
    statBtn.addEventListener('click', toggleCharacterSheet);
  }

  const closeBtn = document.getElementById('cs-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleCharacterSheet);
  }

  const mpBtn = document.getElementById('mp-btn');
  if (mpBtn) {
    mpBtn.addEventListener('click', openMultiplayerLobby);
  }
});
