// ─── Stat-Filtered Dialogue ───
// The sender picks a dialogue option. The receiver sees a version determined
// by the sender's stats. The sender NEVER sees what the receiver gets.
//
// Each dialogue choice has 5 tiers:
//   Tier 1 (0-20):   Terrible — socially awkward, creepy, off-putting
//   Tier 2 (21-40):  Bad — clumsy, try-hard, slightly weird
//   Tier 3 (41-60):  Neutral — normal, unremarkable, plain
//   Tier 4 (61-80):  Good — smooth, likeable, well-delivered
//   Tier 5 (81-100): Perfect — charming, magnetic, memorable
//
// Which stat applies depends on the dialogue context:
//   - Social/greeting lines → swagger (charisma)
//   - Jokes/banter → humor
//   - Golf talk/advice → knowledge
//   - Encouragement/support → zen
//   - Competitive/challenging → focus + swagger blend

const MP_DIALOGUE_VARIANTS = require('./mp-dialogue-variants');

function getStatTier(value) {
  if (value <= 20) return 1;
  if (value <= 40) return 2;
  if (value <= 60) return 3;
  if (value <= 80) return 4;
  return 5;
}

function getRelevantStat(choiceId, traits) {
  const choice = findChoice(choiceId);
  if (!choice) return 50;

  const statKey = choice.statKey || 'swagger';

  if (statKey === 'blend') {
    // Weighted blend of multiple stats
    const keys = choice.blendStats || ['swagger', 'humor'];
    const weights = choice.blendWeights || keys.map(() => 1 / keys.length);
    let total = 0;
    for (let i = 0; i < keys.length; i++) {
      total += (traits[keys[i]] || 50) * (weights[i] || 0);
    }
    return total;
  }

  return traits[statKey] || 50;
}

function findChoice(choiceId) {
  for (const category of Object.values(MP_DIALOGUE_VARIANTS)) {
    for (const choice of category) {
      if (choice.id === choiceId) return choice;
    }
  }
  return null;
}

function filterDialogue(choiceId, senderTraits, senderPerks) {
  const choice = findChoice(choiceId);
  if (!choice) {
    return { text: '...', tier: 3 };
  }

  let statValue = getRelevantStat(choiceId, senderTraits);

  // Perk bonuses that affect multiplayer presence
  if (senderPerks) {
    // Walk the Walk (swagger_1a) — boosts social presence
    if (senderPerks.includes('swagger_1a')) statValue = Math.min(100, statValue + 10);
    // Comedy Gold (humor_2a) — boosts humor delivery
    if (senderPerks.includes('humor_2a') && choice.statKey === 'humor') {
      statValue = Math.min(100, statValue + 12);
    }
    // Life of the Party (humor_3a) — universal social boost
    if (senderPerks.includes('humor_3a')) statValue = Math.min(100, statValue + 8);
  }

  const tier = getStatTier(statValue);
  const variants = choice.variants || {};
  const text = variants[tier] || variants[3] || choice.defaultText || '...';

  return { text, tier, statKey: choice.statKey };
}

module.exports = { filterDialogue, getStatTier, MP_DIALOGUE_VARIANTS };
