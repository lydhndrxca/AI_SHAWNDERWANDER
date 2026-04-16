// ─── 3 John — KJV (Public Domain) ───

const JOHN3 = {
  title: "Third Epistle of John",
  shortTitle: "3 John",
  apiBook: "3 john",
  chapters: 1,
  pages: [
    {
      chapter: 1,
      verseStart: 1,
      verseEnd: 4,
      title: "Greeting & Truth",
      summary: "An elder writes to his dear friend Gaius, expressing deep love and joy that Gaius continues to live faithfully in the truth.",
      wikiTerms: [
        { phrase: "the elder", id: "john-elder" },
        { phrase: "Gaius", id: "gaius" },
        { phrase: "the truth", id: "truth" },
        { phrase: "the brethren", id: "brethren" },
      ],
    },
    {
      chapter: 1,
      verseStart: 5,
      verseEnd: 8,
      title: "Hospitality to Missionaries",
      summary: "Gaius is praised for his generous hospitality to traveling missionaries — even complete strangers — and the elder urges all believers to support them.",
      wikiTerms: [
        { phrase: "charity", id: "charity" },
        { phrase: "the church", id: "church" },
        { phrase: "the Gentiles", id: "gentiles" },
        { phrase: "fellowhelpers", id: "fellowhelpers" },
      ],
    },
    {
      chapter: 1,
      verseStart: 9,
      verseEnd: 11,
      title: "Warning about Diotrephes",
      summary: "A church leader named Diotrephes is called out for his arrogance — he rejects the elder's authority, spreads lies, and casts out anyone who disagrees.",
      wikiTerms: [
        { phrase: "Diotrephes", id: "diotrephes" },
        { phrase: "preeminence", id: "preeminence" },
        { phrase: "malicious words", id: "slander" },
      ],
    },
    {
      chapter: 1,
      verseStart: 12,
      verseEnd: 14,
      title: "Demetrius & Farewell",
      summary: "The elder recommends Demetrius as trustworthy, then closes with a warm hope to visit soon and speak face to face.",
      wikiTerms: [
        { phrase: "Demetrius", id: "demetrius" },
        { phrase: "face to face", id: "face-to-face" },
        { phrase: "Peace", id: "peace-greeting" },
      ],
    },
  ],
};


// ─── Wiki Entries ───

const WIKI = {

  // ── 3 John People & Concepts ──

  "john-elder": {
    title: "The Elder (John)",
    category: "Person",
    text: "The author identifies himself only as \"the elder\" — traditionally understood to be the Apostle John, the same author of the Gospel of John, 1 John, and 2 John. By this time he was likely very old, possibly the last surviving apostle, writing from Ephesus in the late first century (around AD 85-95).",
    references: ["2 John 1:1", "John 21:20-24"],
  },

  "gaius": {
    title: "Gaius",
    category: "Person",
    text: "A beloved member of the early church and the primary recipient of 3 John. He was known for his generous hospitality to traveling missionaries — a critical role in an era with no hotels or church buildings.",
    references: ["3 John 1:1", "Romans 16:23"],
  },

  "diotrephes": {
    title: "Diotrephes",
    category: "Person",
    text: "Mentioned only in 3 John — a cautionary example of church leadership gone wrong. He \"loves to be first,\" rejects apostolic authority, spreads malicious gossip, and excommunicates dissenters. One of the earliest recorded instances of authoritarian church leadership.",
    references: ["3 John 1:9-10"],
  },

  "demetrius": {
    title: "Demetrius",
    category: "Person",
    text: "A man of excellent reputation vouched for by everyone, by \"the truth itself,\" and by the elder personally. He may have been the carrier of this letter or a missionary whom Gaius is being asked to receive.",
    references: ["3 John 1:12"],
  },

  "truth": {
    title: "The Truth",
    category: "Concept",
    text: "In John's writings, \"the truth\" is far more than factual accuracy — it refers to the full reality of God revealed in Jesus Christ. To \"walk in the truth\" means to live in alignment with Christ's teachings. John uses the word more than any other New Testament author.",
    references: ["John 14:6", "John 8:32", "1 John 1:6"],
  },

  "brethren": {
    title: "The Brethren",
    category: "Concept",
    text: "Traveling Christian missionaries who moved between churches in the first century, relying entirely on the hospitality of believers. They refused support from non-Christians. This network was the primary way the gospel spread across the Roman Empire.",
    references: ["3 John 1:3", "3 John 1:5-7"],
  },

  "charity": {
    title: "Charity (Love in Action)",
    category: "Concept",
    text: "In the KJV, \"charity\" translates agape — self-giving love expressed through action. When the elder praises Gaius's charity, he means tangible, costly hospitality: food, shelter, and safe passage for strangers on the basis of shared faith alone.",
    references: ["3 John 1:6", "1 Corinthians 13:1-13"],
  },

  "church": {
    title: "The Church (Ekklesia)",
    category: "Concept",
    text: "Not a building but a gathered community of believers. In 3 John, we see a local house-church — a small congregation meeting in someone's home, linked to other churches through traveling missionaries and letters.",
    references: ["3 John 1:6", "Romans 16:5"],
  },

  "gentiles": {
    title: "The Gentiles",
    category: "Concept",
    text: "Here refers to non-Christians. The missionaries chose not to accept their support, ensuring the gospel would be freely offered and their ministry above reproach.",
    references: ["3 John 1:7", "Matthew 10:8"],
  },

  "fellowhelpers": {
    title: "Fellow Workers for the Truth",
    category: "Concept",
    text: "The word synergoi means co-workers or partners. By providing hospitality to missionaries, ordinary believers like Gaius become full partners in spreading the gospel. You don't have to preach to be a fellow worker — you can be one by opening your door.",
    references: ["3 John 1:8", "Philippians 4:3"],
  },

  "preeminence": {
    title: "Loving to Be First",
    category: "Concept",
    text: "The Greek philoproteuo appears only here in the entire New Testament. It describes Diotrephes' core problem: not doctrinal error but a character flaw — craving authority and status above service.",
    references: ["3 John 1:9", "Mark 10:42-45"],
  },

  "slander": {
    title: "Malicious Words",
    category: "Concept",
    text: "The Greek phlyareo means to talk nonsense or bring false charges. Diotrephes was actively campaigning against John with malicious, unfounded accusations to consolidate church power.",
    references: ["3 John 1:10", "James 4:11"],
  },

  "face-to-face": {
    title: "Face to Face",
    category: "Concept",
    text: "John's preference for personal conversation over letters echoes Moses speaking with God \"face to face.\" Some things simply cannot be conveyed in writing. He wants the full intimacy of presence.",
    references: ["3 John 1:14", "Exodus 33:11"],
  },

  "peace-greeting": {
    title: "Peace (Shalom)",
    category: "Concept",
    text: "Not merely a polite goodbye — it invokes the Hebrew concept of shalom: wholeness and well-being in every dimension of life. It was Jesus's own greeting to his disciples after the resurrection.",
    references: ["3 John 1:14", "John 20:19-21"],
  },

  // ── Genesis People ──

  "adam": {
    title: "Adam",
    category: "Person",
    text: "The first human being, created from the dust of the ground and given the breath of life. Placed in Eden as its keeper, Adam was given one command — do not eat from the tree of knowledge. After the Fall, he is exiled from paradise. He lives 930 years and is considered the father of all humanity.",
    references: ["Genesis 1:26-27", "Genesis 2:7", "Genesis 3:1-24", "Genesis 5:5"],
  },

  "eve": {
    title: "Eve",
    category: "Person",
    text: "The first woman, created from Adam's rib. Her name means \"life-giver\" — she is the mother of all living. Deceived by the serpent into eating the forbidden fruit, she shared it with Adam. She bore Cain, Abel, Seth, and other children.",
    references: ["Genesis 2:21-23", "Genesis 3:1-20", "Genesis 4:1-2"],
  },

  "cain": {
    title: "Cain",
    category: "Person",
    text: "Firstborn son of Adam and Eve, a farmer. When God accepted Abel's offering but not his, Cain murdered his brother — the first killing in the Bible. God cursed him to wander but placed a protective mark on him. He settled east of Eden and built the first city.",
    references: ["Genesis 4:1-17"],
  },

  "abel": {
    title: "Abel",
    category: "Person",
    text: "Second son of Adam and Eve, a shepherd. His offering of the firstborn of his flock was accepted by God, provoking Cain's jealousy and leading to Abel's murder. He is remembered as the first righteous sufferer and first martyr.",
    references: ["Genesis 4:2-8", "Hebrews 11:4", "Matthew 23:35"],
  },

  "enoch": {
    title: "Enoch",
    category: "Person",
    text: "Seventh generation from Adam. The Bible says he \"walked with God\" for 365 years — and then \"was not, for God took him.\" One of only two people in scripture (with Elijah) who never died. His extraordinary departure implies an intimacy with God unmatched by his contemporaries.",
    references: ["Genesis 5:21-24", "Hebrews 11:5"],
  },

  "methuselah": {
    title: "Methuselah",
    category: "Person",
    text: "Enoch's son and the longest-lived person in the Bible at 969 years. His name may mean \"when he dies, it shall be sent\" — and according to the chronology, he died the same year as the great flood.",
    references: ["Genesis 5:25-27"],
  },

  "noah": {
    title: "Noah",
    category: "Person",
    text: "The one righteous man in a corrupt generation. God instructed him to build a massive ark — roughly 450 feet long — and to bring his family and pairs of every animal aboard. After the flood, God made a covenant with Noah sealed by the rainbow. He lived 950 years.",
    references: ["Genesis 6:9-9:29"],
  },

  "abraham": {
    title: "Abraham (Abram)",
    category: "Person",
    text: "Called by God to leave Ur and journey to an unknown land. God promised him a great nation, countless descendants, and that through him all families of the earth would be blessed. Despite decades of waiting, Abraham believed — and it was counted as righteousness. Patriarch of Judaism, Christianity, and Islam. Lived 175 years.",
    references: ["Genesis 12:1-3", "Genesis 15:6", "Genesis 17:1-8", "Genesis 25:7-8"],
  },

  "sarah": {
    title: "Sarah (Sarai)",
    category: "Person",
    text: "Abraham's wife, barren for most of her life. When told she'd bear a son at ninety, she laughed. Yet she conceived Isaac, whose name means \"he laughs.\" She died at 127 and was buried at Machpelah — the first piece of the Promised Land Abraham owned.",
    references: ["Genesis 17:15-19", "Genesis 21:1-7", "Genesis 23:1-2"],
  },

  "hagar": {
    title: "Hagar",
    category: "Person",
    text: "Sarah's Egyptian servant, given to Abraham as a wife when Sarah couldn't conceive. After bearing Ishmael, she was treated harshly and fled. God found her in the wilderness and promised her son would father a great nation. She is the only person in Genesis who gives God a name: \"the God who sees me.\"",
    references: ["Genesis 16:1-16", "Genesis 21:9-21"],
  },

  "ishmael": {
    title: "Ishmael",
    category: "Person",
    text: "Abraham's first son, born to Hagar. God promised he would become a great nation — traditionally understood as the ancestor of the Arab peoples. He was circumcised alongside Abraham and is described as a wild, free man. He lived 137 years and fathered twelve princes.",
    references: ["Genesis 16:11-12", "Genesis 17:20", "Genesis 25:12-18"],
  },

  "isaac": {
    title: "Isaac",
    category: "Person",
    text: "The long-promised son born when Abraham was 100 and Sarah 90. His name means \"laughter.\" The defining event of his youth was the binding on Mount Moriah, where God tested Abraham. Isaac married Rebekah and fathered twins Esau and Jacob. He lived 180 years.",
    references: ["Genesis 21:1-7", "Genesis 22:1-19", "Genesis 35:28-29"],
  },

  "rebekah": {
    title: "Rebekah",
    category: "Person",
    text: "Isaac's wife, found at a well in Mesopotamia by Abraham's servant. She was bold, decisive, and generous — offering water to ten camels. She later orchestrated Jacob's theft of Esau's blessing, fracturing her family but fulfilling a prophecy given before the twins' birth: \"the older shall serve the younger.\"",
    references: ["Genesis 24:1-67", "Genesis 25:23", "Genesis 27:1-46"],
  },

  "esau": {
    title: "Esau",
    category: "Person",
    text: "Isaac's firstborn, a red-haired outdoorsman and hunter. He sold his birthright to Jacob for a bowl of stew and later lost his father's blessing through deception. Despite his anger, he eventually reconciled with Jacob in one of Genesis's most touching scenes. He became the father of the Edomites.",
    references: ["Genesis 25:25-34", "Genesis 27:1-41", "Genesis 33:1-16"],
  },

  "jacob": {
    title: "Jacob (Israel)",
    category: "Person",
    text: "Born grasping his twin Esau's heel, his name means \"supplanter.\" He tricked Esau out of his birthright, stole his blessing, worked fourteen years for Rachel, and wrestled God at the Jabbok — earning the name Israel, \"one who struggles with God.\" His twelve sons became the twelve tribes of Israel.",
    references: ["Genesis 25:26", "Genesis 27-33", "Genesis 32:22-32"],
  },

  "leah": {
    title: "Leah",
    category: "Person",
    text: "Jacob's first wife, married to him through Laban's deception. Described as having \"weak eyes\" (or \"tender eyes\"), she was unloved compared to her sister Rachel. Yet she bore six of the twelve tribal fathers, including Judah — through whose line King David and, later, Jesus would come.",
    references: ["Genesis 29:16-35", "Genesis 30:1-21"],
  },

  "rachel": {
    title: "Rachel",
    category: "Person",
    text: "Jacob's great love — he worked fourteen years for her. She was beautiful but barren for years while Leah bore child after child. When she finally conceived, she bore Joseph and later Benjamin. She died in childbirth on the road to Bethlehem and was buried there.",
    references: ["Genesis 29:1-30", "Genesis 30:22-24", "Genesis 35:16-20"],
  },

  "laban": {
    title: "Laban",
    category: "Person",
    text: "Rebekah's brother, living in Haran. He welcomed Jacob but proved to be a master manipulator — switching Leah for Rachel on the wedding night and constantly changing Jacob's wages. Their twenty-year relationship is a saga of mutual cunning, ending in a tense peace treaty.",
    references: ["Genesis 29-31"],
  },

  "joseph-genesis": {
    title: "Joseph",
    category: "Person",
    text: "Jacob's eleventh son and Rachel's firstborn, his father's favorite. His jealous brothers sold him into slavery in Egypt. Through years of suffering — slavery, false accusation, prison — he rose to become the second most powerful man in Egypt, saving the nation from famine. His story occupies more of Genesis (chapters 37-50) than any other figure's.",
    references: ["Genesis 37-50"],
  },

  "judah": {
    title: "Judah",
    category: "Person",
    text: "Jacob's fourth son by Leah. He proposed selling Joseph into slavery rather than killing him. His encounter with Tamar (ch. 38) is one of the Bible's most morally complex stories. He later gave a magnificent speech to save Benjamin (ch. 44). Jacob's blessing promises Judah the scepter — the line of kings, culminating in David.",
    references: ["Genesis 37:26-27", "Genesis 38", "Genesis 44:18-34", "Genesis 49:8-12"],
  },

  "lot": {
    title: "Lot",
    category: "Person",
    text: "Abraham's nephew who chose to settle near Sodom. He was captured in a war and rescued by Abraham. When God destroyed Sodom, angels led Lot and his family out — but his wife looked back and became a pillar of salt. Lot's story is a cautionary tale about choosing comfort over righteousness.",
    references: ["Genesis 13:1-13", "Genesis 14:12-16", "Genesis 19:1-38"],
  },

  "melchizedek": {
    title: "Melchizedek",
    category: "Person",
    text: "The mysterious priest-king of Salem (later Jerusalem) who appeared after Abraham's military victory. He brought bread and wine and blessed Abraham, who gave him a tenth of everything. He has no recorded genealogy or death — the book of Hebrews later calls him a type of Christ: a priest forever.",
    references: ["Genesis 14:18-20", "Hebrews 7:1-17"],
  },

  "tamar": {
    title: "Tamar",
    category: "Person",
    text: "Judah's daughter-in-law, twice widowed by his sons. When Judah refused to give her his remaining son as custom required, she disguised herself and conceived by Judah himself. When the truth emerged, Judah admitted: \"She has been more righteous than I.\" She appears in Jesus's genealogy in Matthew.",
    references: ["Genesis 38:1-30", "Matthew 1:3"],
  },

  "dinah": {
    title: "Dinah",
    category: "Person",
    text: "Jacob and Leah's only named daughter. She was assaulted by Shechem the prince, who then wanted to marry her. Her brothers Simeon and Levi avenged her by massacring the entire city — an act Jacob condemned on his deathbed.",
    references: ["Genesis 34:1-31", "Genesis 49:5-7"],
  },

  "potiphar": {
    title: "Potiphar",
    category: "Person",
    text: "An officer of Pharaoh and captain of the guard who purchased Joseph as a slave. Joseph thrived in his household until Potiphar's wife falsely accused Joseph of assault, leading to his imprisonment.",
    references: ["Genesis 39:1-20"],
  },

  "benjamin": {
    title: "Benjamin",
    category: "Person",
    text: "Jacob's youngest son, Rachel's second child — born as she died in childbirth. She named him Ben-oni (\"son of my sorrow\") but Jacob called him Benjamin (\"son of my right hand\"). He became the focal point of the drama between Joseph and his brothers in Egypt.",
    references: ["Genesis 35:16-18", "Genesis 42-45"],
  },

  "reuben": {
    title: "Reuben",
    category: "Person",
    text: "Jacob's firstborn by Leah. He tried to save Joseph from the brothers' plot but failed. He later offered his own sons as guarantee for Benjamin's safety. Despite being firstborn, Jacob's deathbed blessing stripped him of preeminence for sleeping with his father's concubine.",
    references: ["Genesis 37:21-22", "Genesis 42:37", "Genesis 49:3-4"],
  },

  "simeon": {
    title: "Simeon",
    category: "Person",
    text: "Jacob's second son by Leah. He and his brother Levi massacred the men of Shechem to avenge their sister Dinah. Joseph held Simeon hostage in Egypt as leverage to make the brothers return with Benjamin.",
    references: ["Genesis 34:25-31", "Genesis 42:24"],
  },

  "levi": {
    title: "Levi",
    category: "Person",
    text: "Jacob's third son by Leah. Joined Simeon in the slaughter at Shechem. Jacob cursed their violence on his deathbed, saying they would be scattered in Israel. Ironically, Levi's descendants became the priestly tribe — the Levites — who served in the tabernacle and temple.",
    references: ["Genesis 34:25-31", "Genesis 49:5-7"],
  },

  // ── Genesis People (continued) ──

  "shem": {
    title: "Shem",
    category: "Person",
    text: "Noah's eldest son and the ancestor of the Semitic peoples — including the Israelites. The genealogy from Shem to Abraham in Genesis 11 forms the bridge between the primeval history and the patriarchal narratives.",
    references: ["Genesis 9:26", "Genesis 11:10-26"],
  },

  "ham": {
    title: "Ham",
    category: "Person",
    text: "Noah's second son who \"saw the nakedness of his father\" while Noah was drunk. His son Canaan was cursed as a result. Ham's descendants include the Egyptians, Canaanites, and Philistines.",
    references: ["Genesis 9:20-27", "Genesis 10:6-20"],
  },

  "japheth": {
    title: "Japheth",
    category: "Person",
    text: "Noah's third son. Along with Shem, he covered his father's nakedness by walking backward with a garment. His descendants spread to the coastlands and are traditionally associated with European and Anatolian peoples.",
    references: ["Genesis 9:23", "Genesis 10:2-5"],
  },

  "nimrod": {
    title: "Nimrod",
    category: "Person",
    text: "A descendant of Ham described as \"a mighty hunter before the Lord.\" He founded several major cities including Babel (Babylon) and Nineveh. Traditionally associated with the Tower of Babel, though the text doesn't make the connection explicit.",
    references: ["Genesis 10:8-12"],
  },

  "pharaoh": {
    title: "Pharaoh",
    category: "Person",
    text: "The title (not personal name) of the king of Egypt. Several Pharaohs appear in Genesis: one who took Sarai into his household (ch. 12), and the one who elevated Joseph to power after hearing his dream interpretation (ch. 41). Pharaoh gave Joseph his signet ring, fine linen, and a gold chain.",
    references: ["Genesis 12:15-20", "Genesis 41:1-45"],
  },

  "abimelech": {
    title: "Abimelech",
    category: "Person",
    text: "King of Gerar who appears in two similar episodes: Abraham claims Sarah is his sister (ch. 20), and Isaac later does the same with Rebekah (ch. 26). In both cases, God intervenes. Abimelech is portrayed as a reasonable, God-fearing ruler.",
    references: ["Genesis 20:1-18", "Genesis 26:1-33"],
  },

  "ephraim": {
    title: "Ephraim",
    category: "Person",
    text: "Joseph's younger son, born in Egypt. Jacob deliberately blessed him over his older brother Manasseh, crossing his hands to place his right hand on Ephraim's head. The tribe of Ephraim became one of the most powerful in Israel and sometimes represented the entire northern kingdom.",
    references: ["Genesis 41:52", "Genesis 48:1-22"],
  },

  "manasseh": {
    title: "Manasseh",
    category: "Person",
    text: "Joseph's firstborn son in Egypt, whose name means \"God has made me forget all my hardship.\" Despite being the elder, Jacob placed him below Ephraim in the blessing — a recurring Genesis pattern where younger sons are elevated over firstborns.",
    references: ["Genesis 41:51", "Genesis 48:1-22"],
  },

  // ── Genesis Places ──

  "eden": {
    title: "The Garden of Eden",
    category: "Place",
    text: "The paradise God planted for Adam and Eve, watered by a river that split into four branches. It contained the tree of life and the tree of knowledge of good and evil. After the Fall, God stationed cherubim with a flaming sword at the entrance. Eden's exact location is unknown; its rivers suggest somewhere in Mesopotamia.",
    references: ["Genesis 2:8-17", "Genesis 3:23-24"],
  },

  "canaan": {
    title: "Canaan (The Promised Land)",
    category: "Place",
    text: "The land God promised to Abraham and his descendants — roughly modern Israel/Palestine. Abraham journeyed through it, Isaac and Jacob lived in it, and Jacob's family eventually left it for Egypt during famine. The entire arc of Genesis points toward this land as the place of God's covenant fulfillment.",
    references: ["Genesis 12:5-7", "Genesis 13:14-17"],
  },

  "egypt": {
    title: "Egypt",
    category: "Place",
    text: "The great civilization to the southwest, appearing throughout Genesis as a place of refuge in famine — but also danger. Abraham went there and lied about Sarah. Joseph was sold there as a slave and rose to power. Jacob's entire family settled there, setting up the story of Exodus.",
    references: ["Genesis 12:10", "Genesis 37:28", "Genesis 46-47"],
  },

  "sodom": {
    title: "Sodom and Gomorrah",
    category: "Place",
    text: "Twin cities of the Jordan plain, notorious for wickedness. Lot chose to live there. Abraham bargained with God over their fate. When not even ten righteous people could be found, God destroyed them with fire and brimstone. They became the Bible's ultimate symbol of divine judgment on sin.",
    references: ["Genesis 13:12-13", "Genesis 18:16-33", "Genesis 19:1-29"],
  },

  "bethel": {
    title: "Bethel",
    category: "Place",
    text: "Meaning \"house of God\" — the name Jacob gave to the place where he dreamed of a stairway to heaven. It became one of the most sacred sites in Israelite history. Jacob returned there later in life at God's command and buried his household's foreign gods nearby.",
    references: ["Genesis 28:10-22", "Genesis 35:1-15"],
  },

  "hebron": {
    title: "Hebron",
    category: "Place",
    text: "An ancient city in southern Canaan where Abraham settled near the oaks of Mamre. It was there he received the three visitors and learned of Isaac's coming birth. Sarah died and was buried there in the cave of Machpelah. Hebron remains a significant site in all three Abrahamic faiths.",
    references: ["Genesis 13:18", "Genesis 18:1", "Genesis 23:2"],
  },

  "machpelah": {
    title: "Cave of Machpelah",
    category: "Place",
    text: "The burial cave near Hebron that Abraham purchased from the Hittites for 400 shekels of silver. It became the family tomb for Sarah, Abraham, Isaac, Rebekah, Leah, and Jacob — the patriarchs and matriarchs of Israel. It was the first and only piece of the Promised Land Abraham actually owned.",
    references: ["Genesis 23:1-20", "Genesis 49:29-32", "Genesis 50:13"],
  },

  "moriah": {
    title: "Mount Moriah",
    category: "Place",
    text: "The mountain where God commanded Abraham to sacrifice Isaac. Tradition identifies it with the Temple Mount in Jerusalem — the same hill where Solomon later built the temple. The name may mean \"the Lord will provide,\" which is what Abraham called it after God provided the ram.",
    references: ["Genesis 22:2-14", "2 Chronicles 3:1"],
  },

  "beersheba": {
    title: "Beersheba",
    category: "Place",
    text: "A city in the Negev desert whose name means \"well of the oath\" or \"well of seven.\" Abraham made a treaty with Abimelech there. Isaac built an altar there. Jacob offered sacrifices there before going to Egypt. It marked the southern boundary of Israelite territory.",
    references: ["Genesis 21:31-33", "Genesis 26:23-33", "Genesis 46:1"],
  },

  "shechem": {
    title: "Shechem",
    category: "Place",
    text: "An important city in central Canaan. Abraham built his first altar there upon entering the Promised Land. Jacob bought land there. It was also the site of the rape of Dinah and the brutal massacre carried out by Simeon and Levi.",
    references: ["Genesis 12:6-7", "Genesis 33:18-20", "Genesis 34:1-31"],
  },

  "ararat": {
    title: "Mountains of Ararat",
    category: "Place",
    text: "The mountain range where Noah's ark came to rest after the flood waters receded. Located in the ancient kingdom of Urartu (modern-day eastern Turkey/Armenia). The specific peak is unknown; Mount Ararat (Agri Dagi) at 16,854 feet is the traditional identification.",
    references: ["Genesis 8:4"],
  },

  "goshen": {
    title: "Goshen",
    category: "Place",
    text: "The fertile region in the eastern Nile Delta where Joseph settled his family when they arrived in Egypt. Described as the best land in Egypt, ideal for their flocks. Jacob's family lived and multiplied there for over four centuries until the Exodus.",
    references: ["Genesis 45:10", "Genesis 46:28-34", "Genesis 47:6"],
  },

  // ── Genesis Events ──

  "creation": {
    title: "The Creation",
    category: "Event",
    text: "God creates the heavens and earth in six days: light, sky, land, celestial bodies, sea creatures and birds, land animals, and finally humanity in His own image. On the seventh day, He rests. Two accounts are given — Genesis 1 (cosmic) and Genesis 2 (intimate, focused on Eden).",
    references: ["Genesis 1:1-2:3"],
  },

  "the-fall": {
    title: "The Fall",
    category: "Event",
    text: "The serpent convinced Eve to eat from the forbidden tree. She shared the fruit with Adam. Their innocence shattered: shame, blame, exile. God cursed the serpent and the ground, promised pain in childbirth, and drove them from Eden. But He also made the first promise of redemption — the woman's offspring would crush the serpent.",
    references: ["Genesis 3:1-24"],
  },

  "the-flood": {
    title: "The Great Flood",
    category: "Event",
    text: "Human wickedness became so pervasive that God destroyed all life with water — sparing only Noah's family and the animals on the ark. Rain fell forty days; waters covered the earth for months. God established a covenant never to flood the earth again, sealed by the rainbow.",
    references: ["Genesis 6:1-9:17"],
  },

  "tower-of-babel": {
    title: "The Tower of Babel",
    category: "Event",
    text: "Humanity, united by one language, built a tower to the heavens — not as engineering but as a monument to self-sufficiency. God confused their language and scattered them. The story explains the origin of languages and nations, and serves as a parable about pride.",
    references: ["Genesis 11:1-9"],
  },

  "binding-of-isaac": {
    title: "The Binding of Isaac",
    category: "Event",
    text: "God tested Abraham: sacrifice your only son. Abraham obeyed, traveling three days to Moriah, binding Isaac on the altar, raising the knife — and was stopped by an angel. A ram was provided instead. The supreme test of faith in the Hebrew Bible; Christians see in it a foreshadowing of God sacrificing His own son.",
    references: ["Genesis 22:1-19"],
  },

  "jacob-wrestling": {
    title: "Wrestling at Jabbok",
    category: "Event",
    text: "The night before meeting Esau, Jacob wrestled a mysterious figure until dawn. His hip was dislocated, but he refused to let go without a blessing. He was renamed Israel — \"he who struggles with God\" — and limped away at sunrise, permanently changed.",
    references: ["Genesis 32:22-32"],
  },

  "jacobs-ladder": {
    title: "Jacob's Ladder",
    category: "Event",
    text: "Fleeing from Esau, Jacob slept with a stone for a pillow and dreamed of a stairway reaching heaven with angels going up and down. God stood above it and renewed the covenant promises. Jacob named the place Bethel and vowed to serve God if He would protect him.",
    references: ["Genesis 28:10-22"],
  },

  "the-famine": {
    title: "The Seven-Year Famine",
    category: "Event",
    text: "Pharaoh dreamed of seven fat cows eaten by seven thin cows. Joseph interpreted: seven years of abundance followed by seven devastating years of famine. His plan — store grain during the good years — saved Egypt and drew his own family there, fulfilling God's prophecy to Abraham of 400 years in a foreign land.",
    references: ["Genesis 41:1-57", "Genesis 42-47"],
  },

  // ── Genesis Concepts ──

  "image-of-god": {
    title: "Image of God (Imago Dei)",
    category: "Concept",
    text: "The statement that humans are made \"in God's image\" is one of the most important ideas in the Bible. It doesn't mean physical resemblance — it means humans uniquely reflect God's nature: consciousness, moral capacity, creativity, relational capacity, and the ability to rule and steward creation.",
    references: ["Genesis 1:26-27", "Genesis 9:6"],
  },

  "tree-of-knowledge": {
    title: "Tree of Knowledge of Good and Evil",
    category: "Concept",
    text: "The one forbidden tree in Eden. Eating from it didn't grant omniscience but opened humanity's eyes to moral experience — the awareness of good and evil, innocence and guilt. It represents the boundary between trust in God and autonomy from God.",
    references: ["Genesis 2:9", "Genesis 2:17", "Genesis 3:1-7"],
  },

  "the-serpent": {
    title: "The Serpent",
    category: "Concept",
    text: "Described as \"more crafty than any beast.\" The serpent questioned God's word, denied consequences, and promised god-like knowledge. Later biblical tradition identifies the serpent with Satan. God cursed it to crawl on its belly and declared war between its offspring and the woman's — a prophecy Christians call the protoevangelium.",
    references: ["Genesis 3:1-15", "Revelation 12:9"],
  },

  "the-ark": {
    title: "Noah's Ark",
    category: "Concept",
    text: "A vessel roughly 450 feet long, 75 feet wide, and 45 feet high — made of gopher wood and sealed with pitch. It had three decks and one door. God told Noah to bring his family and pairs of every animal aboard. The ark is a symbol of salvation through obedience and faith.",
    references: ["Genesis 6:14-22"],
  },

  "nephilim": {
    title: "The Nephilim",
    category: "Concept",
    text: "Mysterious beings mentioned just before the flood story: \"the sons of God came in unto the daughters of men.\" The Nephilim were \"mighty men of old, men of renown.\" Interpretations vary wildly — fallen angels, descendants of Seth, ancient kings. The text is deliberately enigmatic.",
    references: ["Genesis 6:1-4", "Numbers 13:33"],
  },

  "covenant": {
    title: "Covenant",
    category: "Concept",
    text: "A binding agreement between God and humans — the central theological concept of Genesis. God makes covenants with Noah (never flood again), with Abraham (land, descendants, blessing), and renews them with Isaac and Jacob. Unlike contracts, biblical covenants are initiated by the more powerful party and create permanent relationship.",
    references: ["Genesis 9:8-17", "Genesis 15:1-21", "Genesis 17:1-14"],
  },

  "righteousness": {
    title: "Righteousness",
    category: "Concept",
    text: "When Abraham believed God's promise, it was \"counted to him as righteousness\" — one of the most quoted verses in the Bible. Righteousness here means being in right standing with God not through performance but through trust. Paul later built his entire theology of salvation on this verse.",
    references: ["Genesis 15:6", "Romans 4:3", "Galatians 3:6"],
  },

  "birthright": {
    title: "Birthright",
    category: "Concept",
    text: "The firstborn son's right to a double share of inheritance and family leadership. Esau sold his to Jacob for a bowl of stew, despising it. Genesis repeatedly subverts firstborn privilege: Isaac over Ishmael, Jacob over Esau, Joseph over his brothers, Ephraim over Manasseh.",
    references: ["Genesis 25:29-34", "Genesis 48:13-20"],
  },

  "circumcision": {
    title: "Circumcision",
    category: "Concept",
    text: "The physical sign of God's covenant with Abraham, commanded for every male at eight days old. It marked belonging to the covenant community. Abraham circumcised himself at 99, along with Ishmael and his entire household. It remained the defining identity marker of the Jewish people.",
    references: ["Genesis 17:9-14", "Genesis 17:23-27"],
  },

  "canaan-person": {
    title: "Canaan (Son of Ham)",
    category: "Person",
    text: "Ham's son who was cursed by Noah after Ham saw his father's nakedness. The curse declared Canaan would be a servant to Shem and Japheth. This became theologically significant as an explanation for Israel's later conquest of the Canaanite peoples.",
    references: ["Genesis 9:20-27"],
  },

  "edom": {
    title: "Edom",
    category: "Place",
    text: "The territory southeast of the Dead Sea settled by Esau's descendants (the Edomites). Esau's other name was Edom (\"red\"), from the red stew he traded his birthright for. The Edomites and Israelites had a long, contentious relationship throughout Old Testament history.",
    references: ["Genesis 25:30", "Genesis 36:1-43"],
  },
};
