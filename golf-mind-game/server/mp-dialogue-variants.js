// ─── Multiplayer Dialogue Variants ───
// Each choice has 5 stat-tiered versions. The sender picks the intent.
// The receiver sees the delivery filtered through the sender's stats.
//
// Tier 1: Awful    Tier 2: Awkward    Tier 3: Normal    Tier 4: Smooth    Tier 5: Magnetic

const MP_DIALOGUE_VARIANTS = {

  // ─── Greetings (swagger) ───
  greetings: [
    {
      id: 'greet_hey',
      label: 'SAY HI',
      senderText: 'Hey, good to meet you out here.',
      statKey: 'swagger',
      variants: {
        1: '"H-hey. Hi. Sorry. I\'m... I\'m just gonna... yeah." You trail off and stare at your shoes.',
        2: '"Hey! Uh, cool to... meet you? Out here. On the golf course. Where we both are. Obviously." Nailed it.',
        3: '"Hey, good to meet you out here." A normal, pleasant greeting. Nothing more, nothing less.',
        4: '"Hey — good to see another face out here. Great day for it, right?" Easy smile, easy confidence.',
        5: '"Well, this just got more interesting." A grin, a nod, instant presence. You feel like you just met someone from a movie.',
      },
    },
    {
      id: 'greet_playing_well',
      label: 'COMPLIMENT THEIR GAME',
      senderText: 'Looks like you\'re playing well today.',
      statKey: 'swagger',
      variants: {
        1: '"You\'re, uh, hitting it good. Really good. Like, really really..." Stop talking. Please stop talking.',
        2: '"Hey, nice shots out there! I was, uh, watching. Not in a weird way." It was in a weird way.',
        3: '"Looks like you\'re playing well today." Friendly, straightforward, forgettable.',
        4: '"I\'ve been watching you play — you\'ve got a nice swing. Having a good day out there?"',
        5: '"I gotta say, you make this course look easy. What\'s your secret?" Genuine admiration that makes you feel ten feet tall.',
      },
    },
    {
      id: 'greet_wave',
      label: 'WAVE FROM A DISTANCE',
      senderText: '[Waves]',
      statKey: 'swagger',
      variants: {
        1: 'A frantic, too-energetic wave that looks like a distress signal. Several other golfers look over, concerned.',
        2: 'An overly enthusiastic wave followed by an awkward thumbs up. They\'re trying.',
        3: 'A simple wave. Acknowledged and returned.',
        4: 'A cool, relaxed wave with a slight nod. The kind of wave that says "I see you, we\'re good."',
        5: 'The wave. Effortless, perfectly timed, with a smile that carries across the fairway. You feel noticed.',
      },
    },
  ],

  // ─── Golf Talk (knowledge) ───
  golf_talk: [
    {
      id: 'golf_club_advice',
      label: 'OFFER CLUB ADVICE',
      senderText: 'I\'d go with one more club here — the wind is deceptive.',
      statKey: 'knowledge',
      variants: {
        1: '"You should hit the... the bigger one. The one that goes far." They gesture vaguely at your bag.',
        2: '"I think you need more club? Or less? Actually, I\'m not sure. The wind is doing... something."',
        3: '"I\'d go with one more club here. The wind is deceptive." Standard advice, take it or leave it.',
        4: '"Heads up — the wind is stronger than it looks. I\'d go one more club and swing easy. The green\'s firm, too."',
        5: '"The wind is quartering into you off the left, maybe 12-15. This green rejects anything that lands short. Go one up, three-quarter swing, and trust the bounce. You\'ll thank me."',
      },
    },
    {
      id: 'golf_read_green',
      label: 'HELP READ A PUTT',
      senderText: 'I think it breaks more than it looks from there.',
      statKey: 'knowledge',
      variants: {
        1: '"It goes... that way? I think? Everything is a mystery on these greens." Unhelpful in every dimension.',
        2: '"I think it breaks? Maybe left? Or right. Definitely one of those two." Thanks for narrowing it down.',
        3: '"I think it breaks more than it looks from there." Could be right, could be wrong.',
        4: '"From where I\'m standing, that\'s got at least two cups of break. And it\'s faster than it looks — the grain runs toward the valley."',
        5: '"Listen — I\'ve been watching these greens all day. That putt is three cups left, slightly uphill for the first six feet, then gravity takes over. Play it outside the right edge and let it feed. Trust me."',
      },
    },
    {
      id: 'golf_course_fact',
      label: 'SHARE A COURSE FACT',
      senderText: 'Did you know Nicklaus called this the best hole on the course?',
      statKey: 'knowledge',
      variants: {
        1: '"A famous golfer... did a thing here once. A good thing. With a club." The specifics have evaporated.',
        2: '"I read somewhere that this hole is, like, historically important? Jack somebody played here."',
        3: '"Did you know Nicklaus called this the best hole on the course?"',
        4: '"Nicklaus called this the greatest par 4 in golf. He won the \'72 Open here with a 1-iron that hit the flagstick on 17. Different era."',
        5: '"Nicklaus, \'72 Open. 1-iron into the teeth of a 30-mile-per-hour wind, hits the stick, drops to six inches. He kissed the ball. Said later this hole changed the way he thought about course design — which is why he put a similar concept into Muirfield Village, his own course."',
      },
    },
  ],

  // ─── Banter / Jokes (humor) ───
  banter: [
    {
      id: 'joke_after_bad_shot',
      label: 'JOKE ABOUT THEIR BAD SHOT',
      senderText: 'Hey, at least the koi pond didn\'t get it.',
      statKey: 'humor',
      variants: {
        1: '"Hah, that was... that was bad. That was really bad. Wow." They just stare at you. You\'ve made it worse.',
        2: '"Don\'t worry, I\'ve done... worse? Actually, no, that was pretty bad." A joke that landed in the rough.',
        3: '"Hey, at least the koi pond didn\'t get it." A serviceable joke. Brief smile.',
        4: '"You know the good news? That ball is definitely still on dry land. The bad news? It might be in a different zip code." Gets a genuine laugh.',
        5: '"Listen, I once hit a ball so far right on this hole that it ended up in a koi pond. A groundskeeper fished it out with a net. Handed it back with a bow. I still made bogey." They\'re doubled over laughing. The tension is gone.',
      },
    },
    {
      id: 'joke_bet',
      label: 'PROPOSE A FRIENDLY BET',
      senderText: 'Five bucks says I stick it closer than you on the next hole.',
      statKey: 'humor',
      variants: {
        1: '"Wanna bet? Like, money? On golf? Between us? That we\'re playing?" This is the verbal equivalent of a shanked 7-iron.',
        2: '"Hey so, um, what if we made a bet? Like, a small one? Is that weird? That\'s probably weird."',
        3: '"Five bucks says I stick it closer than you on the next hole."',
        4: '"Alright, I\'ve got a proposition. Closest to the pin on the next par 3 — loser buys a round at the turn. You in?"',
        5: '"Tell you what. Next par 3, closest to the pin. Loser buys drinks, tells the bartender exactly how they lost, and has to call the winner \'Pro\' for the rest of the round." They\'re already grinning. "Deal?"',
      },
    },
    {
      id: 'joke_self_deprecating',
      label: 'MAKE FUN OF YOURSELF',
      senderText: 'My swing coach would cry if he saw that.',
      statKey: 'humor',
      variants: {
        1: '"I\'m so bad at this. I\'m really just terrible. I don\'t know why I play. Sorry." The mood just died.',
        2: '"My swing is... not ideal. Like, at all. I should probably take up bowling." Trying too hard.',
        3: '"My swing coach would cry if he saw that." Gets a polite chuckle.',
        4: '"I just paid $300 for a swing lesson last week. My coach is going to see this on camera and issue a refund." Delivered perfectly.',
        5: '"You know what the difference is between me and a Tour pro? About $12 million a year and the ability to actually hit a golf ball." Timing, delivery, self-awareness — they\'re genuinely cracking up.',
      },
    },
  ],

  // ─── Encouragement (zen) ───
  encouragement: [
    {
      id: 'enc_nice_shot',
      label: 'COMPLIMENT A GOOD SHOT',
      senderText: 'Great shot.',
      statKey: 'zen',
      variants: {
        1: '"That was... yeah." A long pause. Too long. They can\'t tell if you liked it or hated it.',
        2: '"Nice! Good shot! That was... that was good!" Overselling it with too much energy.',
        3: '"Great shot." Simple, appropriate, acknowledged.',
        4: '"That was pure. Beautiful flight, perfect landing. You should feel good about that one."',
        5: '"Stop. Don\'t move. Feel that? That\'s what this game is about. That right there. Remember this shot — it\'s going to carry you through the next three holes." Goosebumps.',
      },
    },
    {
      id: 'enc_tough_hole',
      label: 'ENCOURAGE AFTER A BAD HOLE',
      senderText: 'Shake it off. Plenty of holes left.',
      statKey: 'zen',
      variants: {
        1: '"That was... rough. Really rough. But like, it\'s fine? I guess?" They don\'t sound convinced.',
        2: '"Hey, don\'t worry about it. Everyone has bad holes. It\'s only... how many more holes? A lot."',
        3: '"Shake it off. Plenty of holes left."',
        4: '"Listen — that hole is a beast. Everyone struggles there. Fresh start on the next tee. The mountain doesn\'t keep score."',
        5: '"Hey." They look you in the eye. "That hole is in the rearview. You know what I\'ve learned? The best golfers aren\'t the ones who never have bad holes. They\'re the ones who follow them with great ones. This next one is yours." You believe them.',
      },
    },
    {
      id: 'enc_good_round',
      label: 'ACKNOWLEDGE THEIR GOOD ROUND',
      senderText: 'You\'re having a hell of a round.',
      statKey: 'zen',
      variants: {
        1: '"You\'re doing... fine. Good. At golf." The warmth of a refrigerator.',
        2: '"Wow, your score is really good! Like, way better than mine. Way, way better." Insecurity masquerading as a compliment.',
        3: '"You\'re having a hell of a round."',
        4: '"I\'ve been watching your card. You\'re putting together something special out here. Don\'t let up."',
        5: '"You know what you remind me of? The way Nicklaus used to walk between shots. Like the course owed him something. Keep doing whatever you\'re doing. This round is going to be one you remember." They feel invincible.',
      },
    },
  ],

  // ─── Competitive (focus + swagger blend) ───
  competitive: [
    {
      id: 'comp_trash_talk',
      label: 'LIGHT TRASH TALK',
      senderText: 'Nice shot. Mine was better though.',
      statKey: 'blend',
      blendStats: ['swagger', 'focus'],
      blendWeights: [0.6, 0.4],
      variants: {
        1: '"I\'m... I\'m better than you? At golf? Probably?" It comes out as a question. A very uncertain question.',
        2: '"My shot was... I mean, your shot was good too, but... mine was... more good?" Yikes.',
        3: '"Nice shot. Mine was better though." A smirk. Standard competitive banter.',
        4: '"Great shot. Really. But you\'re standing in my shadow right now, and I plan to keep it that way." Delivered with a wink that takes the edge off.',
        5: '"You know what? You\'re playing great golf. And I respect that. But I want you to know — I\'m going to beat you. Not because I don\'t like you. Because I do. And beating people I like is my favorite thing in the world." They\'re fired up in the best way.',
      },
    },
    {
      id: 'comp_acknowledge_loss',
      label: 'TIP YOUR CAP',
      senderText: 'You got me. Fair and square.',
      statKey: 'blend',
      blendStats: ['zen', 'swagger'],
      blendWeights: [0.5, 0.5],
      variants: {
        1: '"I... lost. You won. That\'s... yeah." They look like they might cry. Please don\'t cry.',
        2: '"Good game! You really... beat me. Thoroughly. Completely." It\'s unclear if they\'re congratulating you or processing grief.',
        3: '"You got me. Fair and square."',
        4: '"Hat\'s off to you. You earned that one. I\'ll get you next time — but today was yours." Genuine, graceful.',
        5: '"You outplayed me. And honestly? It was a privilege to watch. That round you just put together? That was art. I\'m buying the first drink, and you\'re telling me everything." They make losing look like winning.',
      },
    },
  ],

  // ─── Clubhouse (swagger) ───
  clubhouse: [
    {
      id: 'club_cheers',
      label: 'RAISE A GLASS',
      senderText: 'Cheers — to a great day at Fujo.',
      statKey: 'swagger',
      variants: {
        1: 'They raise their glass too fast, spill a little, and say "To... golf?" while wiping their hand on their pants.',
        2: '"Cheers! To, um, Fujo! And golf! And us being here!" Too many things. Pick one.',
        3: '"Cheers — to a great day at Fujo." Glasses clink. Simple and nice.',
        4: '"To Fujo. To the mountain. And to playing golf with people who actually appreciate what this place is." Clink. That felt like a moment.',
        5: '"Hold on." They pause, look out the window at the ridgeline, then back at you. "Cheers — to the fact that we\'re alive, we\'re here, and we just played one of the most beautiful courses on Earth. Everything after this is a bonus." You want to frame this moment.',
      },
    },
    {
      id: 'club_rematch',
      label: 'SUGGEST A REMATCH',
      senderText: 'Same time next week?',
      statKey: 'swagger',
      variants: {
        1: '"So like... do you want to maybe play again? Sometime? If you\'re not busy? No pressure. It\'s fine if not." It\'s not fine.',
        2: '"We should do this again! If you want. I mean, I had fun. Did you have fun?"',
        3: '"Same time next week?"',
        4: '"This was too good for a one-time thing. What\'s your schedule looking like? I\'ll book the tee time."',
        5: '"I\'m going to be honest with you — I haven\'t enjoyed a round this much in years. And I play a lot of golf. Same time next week. I\'m not asking, I\'m telling." You\'re already looking forward to it.',
      },
    },
  ],
};

module.exports = MP_DIALOGUE_VARIANTS;
