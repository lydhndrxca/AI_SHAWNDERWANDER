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
  await UI.typeText('PEBBLE BEACH — FRONT NINE', 'hole-stats');
  await sleep(400);
  await UI.typeText('A round of golf is not played on the course.', 'scene');
  await UI.typeText('It is played in your mind.', 'scene');
  await sleep(400);
  await UI.typeText('And in your inbox. And on your performance review.', 'scene');
  await sleep(600);
  await UI.typeText('You are standing in the parking lot at Pebble Beach. The company golf outing. The Pacific stretches to the horizon. The air smells like salt and freshly cut grass. Dave Kowalski — senior associate, business development, eight years at Meridian — is pulling his clubs from his trunk. He gives you a nod. Sharon paired you two together. Not random.', 'action');
  await sleep(300);
  await UI.typeText('"Ready?" he asks. His smile is genuine. Everything else today might not be.', 'dialogue');
  await sleep(500);

  UI.showAction('TEE IT UP', '', () => {
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
  UI.addHoleTitle(hole);
  await sleep(300);
  await UI.typeText(hole.teeDescription, 'scene', 18);
  await sleep(400);

  UI.showAction('STEP UP TO THE BALL', '', () => {
    advancePhase(state);
    runPhase();
  });
}

async function showTeeSetup(hole) {
  UI.clearChoices();
  await UI.typeText(`You pull your driver from the bag. ${hole.yards} yards ahead, the fairway waits. You tee the ball, take your stance, and waggle the club once. Twice.`, 'action', 20);
  await sleep(300);

  UI.showAction('SWING', '', () => {
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
    await UI.typeText(`You walk to your ball. The green is ahead, and you have a decision to make about your approach.`, 'scene', 20);
  }
  await sleep(300);

  UI.showAction('HIT YOUR APPROACH', '', () => {
    advancePhase(state);
    runPhase();
  });
}

async function showPuttSetup(hole) {
  UI.clearChoices();
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
    await UI.typeText(`You're on the green, ${dist} from the cup. The putt reads ${brk}. You crouch behind the ball, tracing the line with your eyes.`, 'scene', 20);
  }
  await sleep(300);

  UI.showAction('PUTT', '', () => {
    advancePhase(state);
    runPhase();
  });
}

async function showSwingThought(shotType, hole) {
  UI.clearChoices();
  const scenario = getScenario(shotType, hole.number);
  await UI.typeText(scenario.setup, 'thought', 22);
  await sleep(400);

  UI.showChoices(scenario.choices, async (choice) => {
    state.lastChoice = choice;
    const quality = resolveShot(choice, state, shotType);
    state.lastShotQuality = quality;
    state.strokesThisHole++;
    state.shotsThisHole.push({ type: shotType, quality, choice });

    applyTraitEffects(state, choice.traitEffects);
    if (choice.partnerEffect) {
      applyTraitEffects(state, choice.partnerEffect);
    }

    // Showmanship: great shots boost swagger
    if (['perfect', 'great'].includes(quality) && getPerkEffect(state, 'greatShotSwaggerBoost')) {
      const boost = getPerkEffect(state, 'greatShotSwaggerBoost').value;
      state.traits.swagger = Math.min(100, state.traits.swagger + boost);
    }

    UI.updateTraits(state);

    // Check for perk unlocks and handle before advancing
    if (state.pendingPerkUnlocks.length > 0) {
      await handlePerkUnlocks();
    }

    advancePhase(state);
    runPhase();
  });
}

async function showShotResult(shotType, hole) {
  UI.clearChoices();
  const lastShot = state.shotsThisHole[state.shotsThisHole.length - 1];
  const quality = lastShot.quality;
  const choice = lastShot.choice;
  const qualityData = SHOT_QUALITY[quality];

  const isGoodResult = ['perfect', 'great', 'good'].includes(quality);
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
    await UI.typeText(`Dave nods approvingly. "That's how you play that hole."`, 'dialogue', 20);
    state.partner.impression = Math.min(100, state.partner.impression + 5);
  } else if (diff === 0) {
    await UI.typeText(`Dave taps his club against his shoe. "Solid par. On to the next one."`, 'dialogue', 20);
  } else if (diff === 1) {
    await UI.typeText(`Dave shrugs. "Bogey's not the end of the world. Plenty of golf left."`, 'dialogue', 20);
  } else {
    await UI.typeText(`Dave looks at the ocean, giving you space. Some holes are best forgotten.`, 'dialogue', 20);
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

async function showBetweenHoles() {
  UI.clearChoices();
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
  await UI.typeText('THE FRONT NINE', 'hole-title');
  await sleep(300);
  await UI.typeText('CORPORATE GOLF — PEBBLE BEACH', 'hole-stats');
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
    partnerSummary = `Dave shakes your hand warmly at the turn. "That was a hell of a front nine. Same time next week?" You've made a friend out here today.`;
  } else if (imp >= 60) {
    partnerSummary = `Dave nods as you reach the halfway house. "Good playing. Let's grab a drink." He seems like he enjoyed the round. You're growing on him.`;
  } else if (imp >= 40) {
    partnerSummary = `Dave gives a polite wave at the turn. "Nice round." Pleasant enough. You're a name he'll vaguely remember at the next company outing.`;
  } else if (imp >= 20) {
    partnerSummary = `Dave is already on the phone as you reach the turn. He gives you a distracted nod. You get the sense you won't be getting a follow-up text.`;
  } else {
    partnerSummary = `Dave has somehow disappeared by the time you reach the halfway house. His cart is gone. His bag is gone. You are alone with the Pacific and your scorecard.`;
  }
  await sleep(300);
  await UI.typeText(partnerSummary, 'scene', 18);

  // Memory-driven ending callbacks
  if (hasFlag(state, 'bet_with_dave')) {
    await sleep(300);
    const won = overall <= 0;
    if (won) {
      await UI.typeText(`Dave reaches for his wallet. "A bet's a bet. Lunch is on me." He's grinning — losing never looked this fun.`, 'dialogue-dave', 18);
    } else {
      await UI.typeText(`"So... about that bet." Dave holds up a menu. "You're buying, hotshot."`, 'dialogue-dave', 18);
    }
  }
  if (hasFlag(state, 'dave_dad_story') && hasFlag(state, 'empathized_with_dave')) {
    await sleep(300);
    await UI.typeText(`Dave pauses at the halfway house door. "Hey — I'm going to tell my dad about today. He'd have liked playing with you." He means it.`, 'dialogue-dave', 18);
  }
  if (hasFlag(state, 'thanked_dave') && imp >= 60) {
    await sleep(300);
    await UI.typeText(`As you settle into the clubhouse, Dave saves your number in his phone. "Next month? I'll set it up." This wasn't just a round. It was the start of something.`, 'scene', 18);
  }
  if (hasFlag(state, 'sentimental_9')) {
    await sleep(300);
    await UI.typeText(`You look back at the ninth fairway one more time. The ocean is doing what it always does. You'll carry this round with you longer than the scorecard suggests.`, 'scene', 18);
  }

  await sleep(500);

  // Final reflection
  await UI.typeText(`The front nine at Pebble Beach is behind you. The ocean doesn't care what you shot. The cypress trees have seen worse. Your phone has 11 unread emails. The quarterly report won't write itself. But for nine holes, you were just a person with a club in your hand, a thousand thoughts in your head, and one very complicated relationship with a guy named Dave.`, 'scene', 18);

  await sleep(600);
  UI.showAction('PLAY AGAIN', '', () => {
    state = createGameState();
    showTitle();
  });
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
