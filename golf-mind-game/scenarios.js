// ─── Swing Thought Scenarios ───
// Each scenario has choices with: golf outcome, trait effects, partner effects, and narrative text
// baseQualityIndex: 0=perfect, 1=great, 2=good, 3=okay, 4=bad, 5=terrible, 6=shank

const TEE_THOUGHTS = {
  // Generic pool — randomly selected, some are golf-knowledge, some are distractions
  generic: [
    {
      setup: `You begin your backswing. Your mind starts to wander...`,
      choices: [
        {
          text: `Focus on keeping your lead shoulder under your chin and completing the full turn. Trust the swing path you grooved on the range.`,
          label: 'SWING THOUGHT',
          baseQualityIndex: 1,
          traitEffects: { focus: 5, knowledge: 3 },
          resultNarrative: {
            good: `Clean contact. You feel it in your hands before you even look up — that compression, the ball jumping off the face. It flies straight, maybe a slight draw, landing in the center of the fairway.`,
            bad: `Solid thought, but you got a little quick at the top. The ball starts straight then leaks right. Fairway, but far right side. Playable.`,
          },
        },
        {
          text: `"Swing easy, hit hard." That's what your old man always said. Just smooth it.`,
          label: 'DAD WISDOM',
          baseQualityIndex: 2,
          traitEffects: { zen: 4, swagger: 2 },
          resultNarrative: {
            good: `Easy does it. The ball floats down the fairway with that effortless trajectory that makes people think you're better than you are. Good position.`,
            bad: `You swung so easy you forgot to actually swing. Caught it a little thin. It runs out there, but it's shorter than you'd like. Still in play.`,
          },
        },
        {
          text: `That waitress at the turn had incredible eyes. What was her name? Something with a K...`,
          label: 'DISTRACTION',
          baseQualityIndex: 5,
          traitEffects: { focus: -8, humor: 5, swagger: 3 },
          partnerEffect: { impression: 5 },
          resultNarrative: {
            good: `Somehow — and you're not sure how — the ball finds the fairway. Maybe there's something to not thinking about it at all. Your body just did its thing while your mind was elsewhere entirely.`,
            bad: `Your hips fire late, you come over the top, and the ball slices hard into the right rough. You mutter something under your breath. Dave grins. "Thinking about the waitress?"`,
          },
        },
        {
          text: `Hit it as hard as you possibly can. This is Pebble Beach. You might never be back. Grip it and rip it.`,
          label: 'SEND IT',
          baseQualityIndex: 3,
          traitEffects: { swagger: 6, focus: -3, zen: -2 },
          resultNarrative: {
            good: `You absolutely unload on it. The sound is like a gunshot. The ball launches into a different zip code, drawing slightly and landing 30 yards past everyone else's drive. Dave's jaw actually drops a little.`,
            bad: `You try to muscle it and everything breaks down. The ball hooks left, catching the rough and bounding into the trees. Power without control. You'll be punching out.`,
          },
        },
      ],
    },
    {
      setup: `At the top of your backswing, a thought arrives uninvited...`,
      choices: [
        {
          text: `Your boss is playing behind you. He mentioned this morning he's "restructuring the department." Don't think about it. Definitely don't think about it.`,
          label: 'INTRUSIVE THOUGHT',
          baseQualityIndex: 4,
          traitEffects: { focus: -5, zen: -4, humor: 2 },
          resultNarrative: {
            good: `The anger actually helps. You channel it into the ball and stripe one down the middle. Take that, corporate restructuring.`,
            bad: `Your grip tightens, your shoulders tense, and the ball shoots left with a nasty hook. Somewhere behind you, your boss is probably watching through binoculars. Wonderful.`,
          },
        },
        {
          text: `Maintain your spine angle. Keep the clubface square through impact. Accelerate through the ball, don't decelerate.`,
          label: 'TECHNICAL',
          baseQualityIndex: 1,
          traitEffects: { knowledge: 5, focus: 4 },
          resultNarrative: {
            good: `Textbook. The swing is mechanically sound and the ball does exactly what the physics demand — a high, straight flight that lands softly and checks. Tiger would approve.`,
            bad: `Too many thoughts. Your brain is a traffic jam of swing tips and the body locks up. You hit it fat, taking a divot the size of a toupee. The ball advances forward without much enthusiasm.`,
          },
        },
        {
          text: `You make eye contact with a sea otter floating in the cove below. It's on its back, eating a clam. Living its best life. You want to be that otter.`,
          label: 'NATURE',
          baseQualityIndex: 3,
          traitEffects: { zen: 6, focus: -2, humor: 3 },
          partnerEffect: { impression: 3 },
          resultNarrative: {
            good: `Something about that otter energy works. Relaxed hands, smooth tempo, the ball does what it wants — which turns out to be exactly what you wanted. Middle of the fairway. The otter approves.`,
            bad: `You're thinking about the otter so much that your lower body checks out. Hands flip through impact and you blade it low. A screaming line drive that runs through the fairway and into the rough beyond. The otter is unbothered.`,
          },
        },
        {
          text: `"Don't go left. Don't go left. Don't go left. DON'T go left."`,
          label: 'THE JINX',
          baseQualityIndex: 4,
          traitEffects: { focus: -6, zen: -5 },
          resultNarrative: {
            good: `Somehow, by sheer force of reverse psychology, the ball goes right. Right down the middle. You exhale for what feels like the first time in forty seconds.`,
            bad: `It goes left. Of course it goes left. You told yourself not to, and your subconscious said "hold my beer." It's in the rough, left. Dave winces sympathetically.`,
          },
        },
      ],
    },
  ],

  // Hole-specific tee thoughts (override generic for specific holes)
  holeSpecific: {
    5: [
      {
        setup: `188 yards of ocean. You're holding a 5-iron. The wind is pushing from the left. Your hands are sweating. You start the club back and your mind races...`,
        choices: [
          {
            text: `Aim right edge of the green and let the wind bring it back. Commit to a smooth, three-quarter swing. Don't try to kill it.`,
            label: 'COURSE MANAGEMENT',
            baseQualityIndex: 1,
            traitEffects: { knowledge: 6, focus: 4, zen: 3 },
            resultNarrative: {
              good: `Beautiful. The ball starts right, the wind catches it, and it rides the breeze back toward the flag. It lands past the pin and spins back to eight feet. That's how you play this hole.`,
              bad: `The wind dies mid-flight. Without it, the ball stays right and lands in the bunker. It's a deep one. But you're on the right piece of real estate — the bunker shot is actually not bad from there.`,
            },
          },
          {
            text: `Aim straight at the pin. The wind is a factor but you've been hitting it pure today. Trust your swing and go flag-hunting.`,
            label: 'AGGRESSIVE',
            baseQualityIndex: 2,
            traitEffects: { swagger: 5, focus: 2 },
            resultNarrative: {
              good: `Straight at it. The ball fights the wind, holding its line like it's on a string. It lands pin-high and stops. Dave makes a sound that's somewhere between a laugh and a gasp. "That's bold."`,
              bad: `The wind grabs it. The ball drifts left, left, left — it clears the green and you hear it hitting rock. Somewhere below, the Pacific swallows your Titleist. That's a penalty stroke and a re-tee. Your stomach drops further than the ball.`,
            },
          },
          {
            text: `I wonder how deep that water is. Like, if I jumped. Not in a dark way — just, it's really far down, right? Don't look down. Why am I looking down?`,
            label: 'VERTIGO',
            baseQualityIndex: 5,
            traitEffects: { focus: -8, zen: -6, humor: 4 },
            partnerEffect: { impression: 4 },
            resultNarrative: {
              good: `Your body swings on autopilot while your brain processes its fear of heights. The ball barely clears the cliff. It lands on the front edge and rolls to the middle. You have no idea how. Dave is laughing. "You looked like you were going to pass out."`,
              bad: `You decelerate through impact — self-preservation instinct, maybe — and the ball comes up twenty yards short. It bounces once on the rock face, hangs in the air for a terrible second, and drops into the ocean. The seagulls scatter. That's a penalty.`,
            },
          },
          {
            text: `Nicklaus hit a 1-iron in '72 and it hit the flagstick. The wind was worse than this. If he can do it, you can do it. Channel Jack.`,
            label: 'CHANNEL JACK',
            baseQualityIndex: 2,
            traitEffects: { knowledge: 4, swagger: 4, confidence: 3 },
            resultNarrative: {
              good: `The Golden Bear energy flows through you. A crisp, punchy strike, keeping it under the wind. The ball bores through the air, lands on the green, takes two hops and stops. It didn't hit the flagstick, but it's close. Nicklaus would nod.`,
              bad: `You are not Jack Nicklaus. You try to punch it low and catch it thin. The ball never gets above fifteen feet off the ground. It clears the water by sheer luck, hits the slope below the green, and kicks sideways into the bunker. Still, you're dry. Moral victory.`,
            },
          },
        ],
      },
    ],
    8: [
      {
        setup: `You're standing on the tee at the famous eighth. The chasm yawns in front of you. 200 yards across nothing but Pacific Ocean and jagged rocks. Dave just pured one across. Your turn. You take the club back...`,
        choices: [
          {
            text: `Pick a spot on the far cliff — the lone cypress on the right side. Aim there, trust your alignment, and just make a smooth, committed pass at the ball.`,
            label: 'PICK A TARGET',
            baseQualityIndex: 1,
            traitEffects: { focus: 5, knowledge: 4 },
            resultNarrative: {
              good: `You stare at that cypress and nothing else exists. The swing is pure — committed, accelerating, trusting. The ball launches high over the void and lands safely on the far side. You hear it bounce on firm turf. You exhale. Dave nods. "That'll work."`,
              bad: `You pick the target but your body doesn't commit. A little flinch at impact — just enough to lose the face angle. The ball drifts right, clearing the chasm but landing in the rough on the far side. Playable. You'll take it.`,
            },
          },
          {
            text: `"I've seen this on TV a hundred times. This is the shot. This is my moment. Pebble Beach. The eighth hole. Television cameras or not, I am about to make a memory."`,
            label: 'MAIN CHARACTER ENERGY',
            baseQualityIndex: 2,
            traitEffects: { swagger: 7, humor: 3, zen: -2 },
            partnerEffect: { impression: 5 },
            resultNarrative: {
              good: `And a memory is made. You crush it — a towering drive that hangs against the blue sky, clears the void by fifty yards, and lands on the fairway with authority. You try not to pose at the finish. You fail. Dave is clapping slowly. "Alright, Tiger."`,
              bad: `The movie in your head is better than the reality. You try too hard to make it pretty, jump out of your posture, and push it right. It clears the water — barely — but you're in thick rough on the hillside. The camera crew in your imagination cuts to commercial.`,
            },
          },
          {
            text: `What happens if I don't clear it? Like, actually? Is that ball gone? Am I dropping from here? How many penalty strokes? I should've paid more attention to the rules—`,
            label: 'CATASTROPHIZING',
            baseQualityIndex: 5,
            traitEffects: { focus: -7, zen: -8 },
            resultNarrative: {
              good: `Fear is a hell of a motivator. You swing so hard that the ball rockets off the face and clears the chasm with room to spare. Your heart is pounding. Your hands are shaking. But you're across. Take the win.`,
              bad: `Your worst fears materialize. The swing is tentative, defensive — you try to steer it instead of hitting it. The ball launches low, starts to fade, and doesn't have the distance. It falls. You watch it fall. It falls for what feels like thirty seconds. A small splash. A smaller piece of your soul. That's OB. Drop and re-tee.`,
            },
          },
          {
            text: `Inhale. Exhale. Feel your feet on the ground. This is just another shot. The ocean is just scenery. The drop is just geography. You are here, and the ball is here, and the target is there. Nothing else.`,
            label: 'MINDFULNESS',
            baseQualityIndex: 1,
            traitEffects: { zen: 8, focus: 4 },
            resultNarrative: {
              good: `Peace. The swing happens without effort, like breathing. The ball arcs beautifully across the chasm, splitting the fairway. You don't even feel the need to watch it land. You already know. Dave says nothing. He doesn't need to.`,
              bad: `The calm is genuine, but the swing still needs mechanics, and you get a little lazy with the lower body. It's enough to catch it slightly off-center. The ball makes it across — comfortably — but you're in the left rough. The mindfulness helped, but the scorecard doesn't grade on serenity.`,
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
      setup: `You stand over your approach shot. The green is ahead. You pick your club and settle into your stance. As you begin the backswing...`,
      choices: [
        {
          text: `Visualize the exact trajectory — a high, soft landing that takes one hop and checks. See the ball in the air before you hit it.`,
          label: 'VISUALIZATION',
          baseQualityIndex: 1,
          traitEffects: { focus: 4, knowledge: 3 },
          resultNarrative: {
            good: `The ball does exactly what you saw in your mind's eye. High flight, soft landing, one check — it sits down within putting range. When the mental game and the physical game align, golf is easy. (It's never easy.)`,
            bad: `You saw it perfectly in your mind. Your body had other plans. The ball comes out lower than expected and lands hot, skidding through the green into the fringe behind. Close, but not what you pictured.`,
          },
        },
        {
          text: `Take one extra club and swing at 80%. Better to be past the pin than short in the bunker.`,
          label: 'SMART PLAY',
          baseQualityIndex: 1,
          traitEffects: { knowledge: 5, zen: 3 },
          resultNarrative: {
            good: `The easy swing produces clean contact. The ball flights perfectly and lands past the flag, spinning back toward it. Pin high. That's experience talking.`,
            bad: `You take the extra club but still swing full speed — muscle memory overrides strategy. The ball sails long, over the green. You stand there holding your follow-through and your regret.`,
          },
        },
        {
          text: `Is that a drone overhead? Someone's flying a drone over Pebble Beach? That can't be legal. It's buzzing. Is it getting closer?`,
          label: 'DISTRACTION',
          baseQualityIndex: 4,
          traitEffects: { focus: -6, humor: 4 },
          partnerEffect: { impression: 3 },
          resultNarrative: {
            good: `Despite the buzzing, you hit a decent shot. The ball finds the green, if not the flag. A long putt awaits, but at least you're on the dance floor. The drone buzzes off toward the ocean.`,
            bad: `You look up mid-backswing — just a flick of the eyes — and it's enough. Fat contact, a chunk of turf sails further than the ball. You advance maybe 40 yards. Dave pretends he didn't see. He saw.`,
          },
        },
        {
          text: `"I bet I can get this inside ten feet. I've been hitting my irons well. Shoot at the flag."`,
          label: 'FLAG HUNTER',
          baseQualityIndex: 2,
          traitEffects: { swagger: 5, focus: 2 },
          resultNarrative: {
            good: `Confidence rewarded. The ball draws toward the flag, lands softly, and rolls out to about eight feet. A birdie look. Dave raises an eyebrow. "Going low today, huh?"`,
            bad: `Going at the flag also means going at the trouble around it. The ball catches the edge of the greenside bunker. A good bunker player doesn't mind. You are not a good bunker player.`,
          },
        },
      ],
    },
  ],
};

const PUTT_THOUGHTS = {
  generic: [
    {
      setup: `You've read the putt. You've walked around it. You're standing over it now, putter in hand. The cup looks small. It always looks small. As you take the putter back...`,
      choices: [
        {
          text: `Pick a spot on your line about two feet in front of the ball. Roll it over that spot. Forget the hole — just the spot.`,
          label: 'SPOT PUTTING',
          baseQualityIndex: 1,
          traitEffects: { focus: 4, knowledge: 4 },
          resultNarrative: {
            good: `Over the spot, down the line, into the center of the cup. The most satisfying sound in golf — the ball hitting the bottom of the hole. You fish it out with quiet pride.`,
            bad: `Over the spot and... past the hole. The pace was off. You read the green right but hit it too firmly. Three-footer coming back. Annoying, but manageable.`,
          },
        },
        {
          text: `Just die it into the hole. Speed is everything on these greens. Easy hands, let gravity do the work.`,
          label: 'FEEL PLAYER',
          baseQualityIndex: 2,
          traitEffects: { zen: 4, swagger: 2 },
          resultNarrative: {
            good: `The ball barely has enough pace to reach the hole, catches the right edge, does a slow half-turn around the lip... and drops. The crowd (Dave) goes wild (nods).`,
            bad: `Die it in? More like dead on arrival. The ball pulls up six inches short. You stare at it. It stares back. A tap-in for the next putt, but the one that got away stings.`,
          },
        },
        {
          text: `You notice your hands are shaking. Are they shaking? Look at them. They're shaking. Why are they shaking? It's just a putt. Just a putt at Pebble Beach. No big deal. Stop shaking.`,
          label: 'THE YIPS',
          baseQualityIndex: 5,
          traitEffects: { zen: -6, focus: -5 },
          resultNarrative: {
            good: `Your hands are trembling but somehow the stroke is smooth. The ball catches the left edge and drops. You don't know how. You don't question it.`,
            bad: `The putter flinches through impact. The ball shoots three feet past the hole on a putt that should've been eighteen inches. The yips are real. Dave looks at the sky, generously pretending to check the weather.`,
          },
        },
        {
          text: `What's the etiquette here — do I mark this? It's only four feet. Is Dave expecting me to mark? He's standing on my line. Should I say something? Is it rude to ask him to move?`,
          label: 'OVERTHINKING ETIQUETTE',
          baseQualityIndex: 4,
          traitEffects: { focus: -5, humor: 5 },
          partnerEffect: { impression: -2 },
          resultNarrative: {
            good: `You eventually just putt it, social anxiety and all. The ball goes in. Dave hadn't noticed anything. All that internal drama for nothing.`,
            bad: `You're so worried about the etiquette that you forget to actually read the putt. You pull it left, miss the hole entirely, and it rolls four feet past. Dave: "You okay?" No, Dave. You are not okay.`,
          },
        },
      ],
    },
  ],
};

const BETWEEN_HOLES_DIALOGUE = {
  moods: {
    great: [
      `Dave slaps you on the back as you walk to the next tee. "Man, you are ON today. I should play with you more often — you're good luck."`,
      `"You know what, I'm buying lunch after this," Dave says, grinning. "You're making this fun."`,
      `Dave pulls out his phone. "I need to get a photo with you at the next hole. This round is one for the books."`,
    ],
    good: [
      `Dave walks alongside you. "Nice playing back there. Keep it up." He seems genuinely impressed, or at least not bored.`,
      `"Not bad at all," Dave says, pulling a granola bar from his bag. "Want one? Peanut butter chocolate." He holds it out without breaking stride.`,
    ],
    neutral: [
      `Dave makes small talk about the weather as you walk. The Pacific breeze is pleasant. Neither of you mentions the score.`,
      `"Beautiful day for it," Dave says, gesturing at the ocean. There's a comfortable silence as you both take in the view.`,
    ],
    annoyed: [
      `Dave is quiet on the walk. He checks his phone. You're not sure if you're playing too slow or if it's something else. The silence feels heavy.`,
      `"Maybe pick up the pace a little?" Dave suggests, not unkindly but not warmly either. You nod and walk faster.`,
    ],
    cold: [
      `Dave walks ahead of you, phone to his ear. You catch fragments — something about "wrapping up early." He doesn't look back.`,
      `The walk to the next tee is silent. Dave examines his club like it's the most fascinating object in the world. You are being frozen out.`,
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
