/* ═══════ ARGUMENT MAPS ═══════
   Logical-flow breakdowns of argumentative passages.
   Each node: { id, verses (string), type, keyword, text, parent (id|null) }
   parent creates the indent / connector hierarchy.

   Node types:
     claim       – main assertion
     ground      – "For…" / "Because…" supporting reason
     inference   – "Therefore…" conclusion
     condition   – "If…" premise
     result      – "…then" consequence of condition
     contrast    – "But…" counterpoint
     exhortation – practical command / application
     question    – rhetorical question
     answer      – answer to rhetorical question
*/

const ARGUMENT_SECTIONS = [
  { name: 'Romans', maps: [

    /* ── Romans 3:21-28 ── */
    { label: 'Romans 3:21-28', book: 'romans', chapter: 3,
      title: 'Justified by Faith, Not Law',
      context: 'After proving all humanity guilty before God, Paul reveals the solution.',
      nodes: [
        { id: 'r3-1', verses: '21', type: 'contrast',
          keyword: 'But now', text: 'the righteousness of God without the law is manifested, being witnessed by the law and the prophets',
          parent: null },
        { id: 'r3-2', verses: '22', type: 'claim',
          keyword: '', text: 'Even the righteousness of God which is by faith of Jesus Christ unto all and upon all them that believe: for there is no difference',
          parent: 'r3-1' },
        { id: 'r3-3', verses: '23', type: 'ground',
          keyword: 'For', text: 'all have sinned, and come short of the glory of God',
          parent: 'r3-2' },
        { id: 'r3-4', verses: '24', type: 'claim',
          keyword: '', text: 'Being justified freely by his grace through the redemption that is in Christ Jesus',
          parent: 'r3-3' },
        { id: 'r3-5', verses: '25-26', type: 'ground',
          keyword: '', text: 'Whom God hath set forth to be a propitiation through faith in his blood, to declare his righteousness… that he might be just, and the justifier of him which believeth in Jesus',
          parent: 'r3-4' },
        { id: 'r3-6', verses: '27', type: 'question',
          keyword: 'Where is', text: 'boasting then? It is excluded.',
          parent: null },
        { id: 'r3-7', verses: '27b', type: 'answer',
          keyword: 'By what law?', text: 'of works? Nay: but by the law of faith.',
          parent: 'r3-6' },
        { id: 'r3-8', verses: '28', type: 'inference',
          keyword: 'Therefore', text: 'we conclude that a man is justified by faith without the deeds of the law',
          parent: 'r3-7' },
      ]
    },

    /* ── Romans 5:1-11 ── */
    { label: 'Romans 5:1-11', book: 'romans', chapter: 5,
      title: 'Peace and Hope Through Suffering',
      context: 'Having established justification by faith, Paul unfolds what that means for the believer.',
      nodes: [
        { id: 'r5-1', verses: '1', type: 'inference',
          keyword: 'Therefore', text: 'being justified by faith, we have peace with God through our Lord Jesus Christ',
          parent: null },
        { id: 'r5-2', verses: '2', type: 'claim',
          keyword: 'By whom', text: 'also we have access by faith into this grace wherein we stand, and rejoice in hope of the glory of God',
          parent: 'r5-1' },
        { id: 'r5-3', verses: '3', type: 'claim',
          keyword: 'And not only so', text: 'but we glory in tribulations also',
          parent: 'r5-2' },
        { id: 'r5-4', verses: '3b-4', type: 'ground',
          keyword: 'Knowing that', text: 'tribulation worketh patience; and patience, experience; and experience, hope',
          parent: 'r5-3' },
        { id: 'r5-5', verses: '5', type: 'ground',
          keyword: 'And', text: 'hope maketh not ashamed; because the love of God is shed abroad in our hearts by the Holy Ghost which is given unto us',
          parent: 'r5-4' },
        { id: 'r5-6', verses: '6-8', type: 'ground',
          keyword: 'For', text: 'when we were yet without strength, in due time Christ died for the ungodly… God commendeth his love toward us, in that, while we were yet sinners, Christ died for us',
          parent: 'r5-5' },
        { id: 'r5-7', verses: '9-10', type: 'inference',
          keyword: 'Much more then', text: 'being now justified by his blood, we shall be saved from wrath through him. For if, when we were enemies, we were reconciled to God by the death of his Son, much more, being reconciled, we shall be saved by his life',
          parent: 'r5-6' },
        { id: 'r5-8', verses: '11', type: 'claim',
          keyword: 'And not only so', text: 'but we also joy in God through our Lord Jesus Christ, by whom we have now received the atonement',
          parent: 'r5-7' },
      ]
    },

    /* ── Romans 8:1-17 ── */
    { label: 'Romans 8:1-17', book: 'romans', chapter: 8,
      title: 'Life in the Spirit',
      context: 'Paul reaches his crescendo: no condemnation, and new life through the Spirit.',
      nodes: [
        { id: 'r8-1', verses: '1', type: 'inference',
          keyword: 'Therefore', text: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit',
          parent: null },
        { id: 'r8-2', verses: '2', type: 'ground',
          keyword: 'For', text: 'the law of the Spirit of life in Christ Jesus hath made me free from the law of sin and death',
          parent: 'r8-1' },
        { id: 'r8-3', verses: '3', type: 'ground',
          keyword: 'For', text: 'what the law could not do, in that it was weak through the flesh, God sending his own Son in the likeness of sinful flesh, and for sin, condemned sin in the flesh',
          parent: 'r8-2' },
        { id: 'r8-4', verses: '5-6', type: 'contrast',
          keyword: 'For', text: 'they that are after the flesh do mind the things of the flesh; but they that are after the Spirit the things of the Spirit. For to be carnally minded is death; but to be spiritually minded is life and peace',
          parent: 'r8-3' },
        { id: 'r8-5', verses: '7-8', type: 'ground',
          keyword: 'Because', text: 'the carnal mind is enmity against God: for it is not subject to the law of God, neither indeed can be. So then they that are in the flesh cannot please God',
          parent: 'r8-4' },
        { id: 'r8-6', verses: '9', type: 'contrast',
          keyword: 'But', text: 'ye are not in the flesh, but in the Spirit, if so be that the Spirit of God dwell in you',
          parent: 'r8-5' },
        { id: 'r8-7', verses: '10-11', type: 'condition',
          keyword: 'And if', text: 'Christ be in you, the body is dead because of sin; but the Spirit is life because of righteousness',
          parent: 'r8-6' },
        { id: 'r8-8', verses: '11b', type: 'result',
          keyword: 'Then', text: 'he that raised up Christ from the dead shall also quicken your mortal bodies by his Spirit that dwelleth in you',
          parent: 'r8-7' },
        { id: 'r8-9', verses: '12-13', type: 'inference',
          keyword: 'Therefore', text: 'brethren, we are debtors, not to the flesh, to live after the flesh. For if ye live after the flesh, ye shall die: but if ye through the Spirit do mortify the deeds of the body, ye shall live',
          parent: 'r8-8' },
        { id: 'r8-10', verses: '14', type: 'ground',
          keyword: 'For', text: 'as many as are led by the Spirit of God, they are the sons of God',
          parent: 'r8-9' },
        { id: 'r8-11', verses: '15-16', type: 'ground',
          keyword: 'For', text: 'ye have not received the spirit of bondage again to fear; but ye have received the Spirit of adoption, whereby we cry, Abba, Father. The Spirit itself beareth witness with our spirit, that we are the children of God',
          parent: 'r8-10' },
        { id: 'r8-12', verses: '17', type: 'condition',
          keyword: 'And if', text: 'children, then heirs; heirs of God, and joint-heirs with Christ; if so be that we suffer with him, that we may be also glorified together',
          parent: 'r8-11' },
      ]
    },

    /* ── Romans 8:28-39 ── */
    { label: 'Romans 8:28-39', book: 'romans', chapter: 8,
      title: 'Nothing Can Separate Us',
      context: 'Paul\'s argument reaches its emotional and logical peak.',
      nodes: [
        { id: 'r8b-1', verses: '28', type: 'claim',
          keyword: 'And we know', text: 'that all things work together for good to them that love God, to them who are the called according to his purpose',
          parent: null },
        { id: 'r8b-2', verses: '29-30', type: 'ground',
          keyword: 'For', text: 'whom he did foreknow, he also did predestinate… Moreover whom he did predestinate, them he also called: and whom he called, them he also justified: and whom he justified, them he also glorified',
          parent: 'r8b-1' },
        { id: 'r8b-3', verses: '31', type: 'question',
          keyword: 'What shall we', text: 'then say to these things? If God be for us, who can be against us?',
          parent: 'r8b-2' },
        { id: 'r8b-4', verses: '32', type: 'ground',
          keyword: '', text: 'He that spared not his own Son, but delivered him up for us all, how shall he not with him also freely give us all things?',
          parent: 'r8b-3' },
        { id: 'r8b-5', verses: '33-34', type: 'question',
          keyword: 'Who shall', text: 'lay any thing to the charge of God\'s elect? It is God that justifieth. Who is he that condemneth? It is Christ that died, yea rather, that is risen again',
          parent: 'r8b-4' },
        { id: 'r8b-6', verses: '35', type: 'question',
          keyword: 'Who shall', text: 'separate us from the love of Christ? shall tribulation, or distress, or persecution, or famine, or nakedness, or peril, or sword?',
          parent: 'r8b-5' },
        { id: 'r8b-7', verses: '37', type: 'answer',
          keyword: 'Nay', text: 'in all these things we are more than conquerors through him that loved us',
          parent: 'r8b-6' },
        { id: 'r8b-8', verses: '38-39', type: 'claim',
          keyword: 'For I am persuaded', text: 'that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord',
          parent: 'r8b-7' },
      ]
    },

  ]},

  { name: '1 Corinthians', maps: [

    /* ── 1 Corinthians 13:1-13 ── */
    { label: '1 Corinthians 13:1-13', book: '1 corinthians', chapter: 13,
      title: 'Without Love, Nothing',
      context: 'Sandwiched between chapters on spiritual gifts, Paul reveals what actually matters.',
      nodes: [
        { id: 'c13-1', verses: '1', type: 'condition',
          keyword: 'Though I', text: 'speak with the tongues of men and of angels, and have not charity, I am become as sounding brass, or a tinkling cymbal',
          parent: null },
        { id: 'c13-2', verses: '2', type: 'condition',
          keyword: 'And though I', text: 'have the gift of prophecy, and understand all mysteries, and all knowledge; and though I have all faith, so that I could remove mountains, and have not charity, I am nothing',
          parent: 'c13-1' },
        { id: 'c13-3', verses: '3', type: 'condition',
          keyword: 'And though I', text: 'bestow all my goods to feed the poor, and though I give my body to be burned, and have not charity, it profiteth me nothing',
          parent: 'c13-2' },
        { id: 'c13-4', verses: '4-7', type: 'claim',
          keyword: '', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; rejoiceth not in iniquity, but rejoiceth in the truth; beareth all things, believeth all things, hopeth all things, endureth all things',
          parent: null },
        { id: 'c13-5', verses: '8', type: 'claim',
          keyword: '', text: 'Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away',
          parent: 'c13-4' },
        { id: 'c13-6', verses: '9-10', type: 'ground',
          keyword: 'For', text: 'we know in part, and we prophesy in part. But when that which is perfect is come, then that which is in part shall be done away',
          parent: 'c13-5' },
        { id: 'c13-7', verses: '11', type: 'ground',
          keyword: 'When I was', text: 'a child, I spake as a child, I understood as a child, I thought as a child: but when I became a man, I put away childish things',
          parent: 'c13-6' },
        { id: 'c13-8', verses: '12', type: 'ground',
          keyword: 'For now', text: 'we see through a glass, darkly; but then face to face: now I know in part; but then shall I know even as also I am known',
          parent: 'c13-7' },
        { id: 'c13-9', verses: '13', type: 'inference',
          keyword: 'And now', text: 'abideth faith, hope, charity, these three; but the greatest of these is charity',
          parent: null },
      ]
    },

    /* ── 1 Corinthians 15:12-22 ── */
    { label: '1 Corinthians 15:12-22', book: '1 corinthians', chapter: 15,
      title: 'If Christ Is Not Raised',
      context: 'Paul confronts doubters of the resurrection with a chain of devastating "if…then" logic.',
      nodes: [
        { id: 'c15-1', verses: '12', type: 'question',
          keyword: 'Now if', text: 'Christ be preached that he rose from the dead, how say some among you that there is no resurrection of the dead?',
          parent: null },
        { id: 'c15-2', verses: '13', type: 'condition',
          keyword: 'But if', text: 'there be no resurrection of the dead, then is Christ not risen',
          parent: 'c15-1' },
        { id: 'c15-3', verses: '14', type: 'result',
          keyword: 'And if', text: 'Christ be not risen, then is our preaching vain, and your faith is also vain',
          parent: 'c15-2' },
        { id: 'c15-4', verses: '15', type: 'result',
          keyword: 'Yea, and', text: 'we are found false witnesses of God; because we have testified of God that he raised up Christ: whom he raised not up, if so be that the dead rise not',
          parent: 'c15-3' },
        { id: 'c15-5', verses: '16-17', type: 'result',
          keyword: 'For if', text: 'the dead rise not, then is not Christ raised: And if Christ be not raised, your faith is vain; ye are yet in your sins',
          parent: 'c15-4' },
        { id: 'c15-6', verses: '18', type: 'result',
          keyword: 'Then', text: 'they also which are fallen asleep in Christ are perished',
          parent: 'c15-5' },
        { id: 'c15-7', verses: '19', type: 'result',
          keyword: 'If in this life only', text: 'we have hope in Christ, we are of all men most miserable',
          parent: 'c15-6' },
        { id: 'c15-8', verses: '20', type: 'contrast',
          keyword: 'But now', text: 'is Christ risen from the dead, and become the firstfruits of them that slept',
          parent: null },
        { id: 'c15-9', verses: '21', type: 'ground',
          keyword: 'For since', text: 'by man came death, by man came also the resurrection of the dead',
          parent: 'c15-8' },
        { id: 'c15-10', verses: '22', type: 'inference',
          keyword: 'For as', text: 'in Adam all die, even so in Christ shall all be made alive',
          parent: 'c15-9' },
      ]
    },

  ]},

  { name: 'Galatians', maps: [

    /* ── Galatians 3:1-14 ── */
    { label: 'Galatians 3:1-14', book: 'galatians', chapter: 3,
      title: 'Faith vs. the Law',
      context: 'Paul, exasperated, dismantles the idea that the law can justify anyone.',
      nodes: [
        { id: 'g3-1', verses: '1', type: 'question',
          keyword: 'O foolish Galatians', text: 'who hath bewitched you, that ye should not obey the truth, before whose eyes Jesus Christ hath been evidently set forth, crucified among you?',
          parent: null },
        { id: 'g3-2', verses: '2', type: 'question',
          keyword: 'This only', text: 'would I learn of you, Received ye the Spirit by the works of the law, or by the hearing of faith?',
          parent: 'g3-1' },
        { id: 'g3-3', verses: '3', type: 'question',
          keyword: 'Are ye so foolish?', text: 'having begun in the Spirit, are ye now made perfect by the flesh?',
          parent: 'g3-2' },
        { id: 'g3-4', verses: '5-6', type: 'ground',
          keyword: '', text: 'He therefore that ministereth to you the Spirit, and worketh miracles among you, doeth he it by the works of the law, or by the hearing of faith? Even as Abraham believed God, and it was accounted to him for righteousness',
          parent: 'g3-3' },
        { id: 'g3-5', verses: '7', type: 'inference',
          keyword: 'Know ye therefore', text: 'that they which are of faith, the same are the children of Abraham',
          parent: 'g3-4' },
        { id: 'g3-6', verses: '8-9', type: 'ground',
          keyword: 'And the scripture', text: 'foreseeing that God would justify the heathen through faith, preached before the gospel unto Abraham, saying, In thee shall all nations be blessed. So then they which be of faith are blessed with faithful Abraham',
          parent: 'g3-5' },
        { id: 'g3-7', verses: '10', type: 'contrast',
          keyword: 'For', text: 'as many as are of the works of the law are under the curse: for it is written, Cursed is every one that continueth not in all things which are written in the book of the law to do them',
          parent: null },
        { id: 'g3-8', verses: '11', type: 'claim',
          keyword: 'But that', text: 'no man is justified by the law in the sight of God, it is evident: for, The just shall live by faith',
          parent: 'g3-7' },
        { id: 'g3-9', verses: '13', type: 'claim',
          keyword: '', text: 'Christ hath redeemed us from the curse of the law, being made a curse for us: for it is written, Cursed is every one that hangeth on a tree',
          parent: 'g3-8' },
        { id: 'g3-10', verses: '14', type: 'result',
          keyword: 'That', text: 'the blessing of Abraham might come on the Gentiles through Jesus Christ; that we might receive the promise of the Spirit through faith',
          parent: 'g3-9' },
      ]
    },

  ]},

  { name: 'Ephesians', maps: [

    /* ── Ephesians 2:1-10 ── */
    { label: 'Ephesians 2:1-10', book: 'ephesians', chapter: 2,
      title: 'Dead in Sin, Alive in Grace',
      context: 'Paul contrasts humanity\'s hopeless state with God\'s radical intervention.',
      nodes: [
        { id: 'e2-1', verses: '1-3', type: 'claim',
          keyword: 'And you', text: 'hath he quickened, who were dead in trespasses and sins; wherein in time past ye walked according to the course of this world… fulfilling the desires of the flesh and of the mind; and were by nature the children of wrath, even as others',
          parent: null },
        { id: 'e2-2', verses: '4-5', type: 'contrast',
          keyword: 'But God', text: 'who is rich in mercy, for his great love wherewith he loved us, even when we were dead in sins, hath quickened us together with Christ, (by grace ye are saved)',
          parent: 'e2-1' },
        { id: 'e2-3', verses: '6-7', type: 'result',
          keyword: 'And hath', text: 'raised us up together, and made us sit together in heavenly places in Christ Jesus: that in the ages to come he might shew the exceeding riches of his grace in his kindness toward us through Christ Jesus',
          parent: 'e2-2' },
        { id: 'e2-4', verses: '8', type: 'ground',
          keyword: 'For', text: 'by grace are ye saved through faith; and that not of yourselves: it is the gift of God',
          parent: 'e2-3' },
        { id: 'e2-5', verses: '9', type: 'ground',
          keyword: 'Not of works', text: 'lest any man should boast',
          parent: 'e2-4' },
        { id: 'e2-6', verses: '10', type: 'ground',
          keyword: 'For', text: 'we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them',
          parent: 'e2-5' },
      ]
    },

  ]},

  { name: 'Philippians', maps: [

    /* ── Philippians 2:1-11 ── */
    { label: 'Philippians 2:1-11', book: 'philippians', chapter: 2,
      title: 'The Mind of Christ',
      context: 'Paul grounds his call for humility in the ultimate example: Christ emptying himself.',
      nodes: [
        { id: 'p2-1', verses: '1', type: 'condition',
          keyword: 'If there be', text: 'any consolation in Christ, if any comfort of love, if any fellowship of the Spirit, if any bowels and mercies',
          parent: null },
        { id: 'p2-2', verses: '2', type: 'exhortation',
          keyword: 'Fulfil ye', text: 'my joy, that ye be likeminded, having the same love, being of one accord, of one mind',
          parent: 'p2-1' },
        { id: 'p2-3', verses: '3-4', type: 'exhortation',
          keyword: 'Let nothing', text: 'be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves. Look not every man on his own things, but every man also on the things of others',
          parent: 'p2-2' },
        { id: 'p2-4', verses: '5', type: 'exhortation',
          keyword: 'Let this mind', text: 'be in you, which was also in Christ Jesus',
          parent: 'p2-3' },
        { id: 'p2-5', verses: '6-7', type: 'ground',
          keyword: 'Who', text: 'being in the form of God, thought it not robbery to be equal with God: but made himself of no reputation, and took upon him the form of a servant, and was made in the likeness of men',
          parent: 'p2-4' },
        { id: 'p2-6', verses: '8', type: 'ground',
          keyword: 'And', text: 'being found in fashion as a man, he humbled himself, and became obedient unto death, even the death of the cross',
          parent: 'p2-5' },
        { id: 'p2-7', verses: '9', type: 'inference',
          keyword: 'Wherefore', text: 'God also hath highly exalted him, and given him a name which is above every name',
          parent: 'p2-6' },
        { id: 'p2-8', verses: '10-11', type: 'result',
          keyword: 'That', text: 'at the name of Jesus every knee should bow, of things in heaven, and things in earth, and things under the earth; and that every tongue should confess that Jesus Christ is Lord, to the glory of God the Father',
          parent: 'p2-7' },
      ]
    },

  ]},

  { name: 'Hebrews', maps: [

    /* ── Hebrews 11:1-6, 12:1-2 ── */
    { label: 'Hebrews 11:1-6 + 12:1-2', book: 'hebrews', chapter: 11,
      title: 'Faith Defined and Applied',
      context: 'The author defines faith, proves it from history, then applies it to the reader.',
      nodes: [
        { id: 'h11-1', verses: '11:1', type: 'claim',
          keyword: 'Now', text: 'faith is the substance of things hoped for, the evidence of things not seen',
          parent: null },
        { id: 'h11-2', verses: '11:2', type: 'ground',
          keyword: 'For', text: 'by it the elders obtained a good report',
          parent: 'h11-1' },
        { id: 'h11-3', verses: '11:3', type: 'ground',
          keyword: 'Through faith', text: 'we understand that the worlds were framed by the word of God, so that things which are seen were not made of things which do appear',
          parent: 'h11-2' },
        { id: 'h11-4', verses: '11:4', type: 'ground',
          keyword: 'By faith', text: 'Abel offered unto God a more excellent sacrifice than Cain, by which he obtained witness that he was righteous',
          parent: 'h11-3' },
        { id: 'h11-5', verses: '11:5', type: 'ground',
          keyword: 'By faith', text: 'Enoch was translated that he should not see death… for before his translation he had this testimony, that he pleased God',
          parent: 'h11-4' },
        { id: 'h11-6', verses: '11:6', type: 'inference',
          keyword: 'But without faith', text: 'it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him',
          parent: 'h11-5' },
        { id: 'h12-1', verses: '12:1', type: 'exhortation',
          keyword: 'Wherefore', text: 'seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us',
          parent: 'h11-6' },
        { id: 'h12-2', verses: '12:2', type: 'exhortation',
          keyword: 'Looking unto', text: 'Jesus the author and finisher of our faith; who for the joy that was set before him endured the cross, despising the shame, and is set down at the right hand of the throne of God',
          parent: 'h12-1' },
      ]
    },

    /* ── Hebrews 4:12-16 ── */
    { label: 'Hebrews 4:12-16', book: 'hebrews', chapter: 4,
      title: 'The Living Word and Our High Priest',
      context: 'Two linked arguments: God\'s word exposes everything, and Christ\'s priesthood gives us boldness.',
      nodes: [
        { id: 'h4-1', verses: '12', type: 'claim',
          keyword: 'For', text: 'the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart',
          parent: null },
        { id: 'h4-2', verses: '13', type: 'ground',
          keyword: 'Neither is there', text: 'any creature that is not manifest in his sight: but all things are naked and opened unto the eyes of him with whom we have to do',
          parent: 'h4-1' },
        { id: 'h4-3', verses: '14', type: 'inference',
          keyword: 'Seeing then', text: 'that we have a great high priest, that is passed into the heavens, Jesus the Son of God, let us hold fast our profession',
          parent: 'h4-2' },
        { id: 'h4-4', verses: '15', type: 'ground',
          keyword: 'For', text: 'we have not an high priest which cannot be touched with the feeling of our infirmities; but was in all points tempted like as we are, yet without sin',
          parent: 'h4-3' },
        { id: 'h4-5', verses: '16', type: 'exhortation',
          keyword: 'Let us therefore', text: 'come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need',
          parent: 'h4-4' },
      ]
    },

  ]},

  { name: 'James', maps: [

    /* ── James 2:14-26 ── */
    { label: 'James 2:14-26', book: 'james', chapter: 2,
      title: 'Faith Without Works Is Dead',
      context: 'James tackles the question head-on: what good is faith if it doesn\'t change anything?',
      nodes: [
        { id: 'j2-1', verses: '14', type: 'question',
          keyword: 'What doth it profit', text: 'my brethren, though a man say he hath faith, and have not works? can faith save him?',
          parent: null },
        { id: 'j2-2', verses: '15-16', type: 'condition',
          keyword: 'If', text: 'a brother or sister be naked, and destitute of daily food, and one of you say unto them, Depart in peace, be ye warmed and filled; notwithstanding ye give them not those things which are needful to the body; what doth it profit?',
          parent: 'j2-1' },
        { id: 'j2-3', verses: '17', type: 'inference',
          keyword: 'Even so', text: 'faith, if it hath not works, is dead, being alone',
          parent: 'j2-2' },
        { id: 'j2-4', verses: '18', type: 'contrast',
          keyword: 'Yea, a man may say', text: 'Thou hast faith, and I have works: shew me thy faith without thy works, and I will shew thee my faith by my works',
          parent: 'j2-3' },
        { id: 'j2-5', verses: '19', type: 'ground',
          keyword: '', text: 'Thou believest that there is one God; thou doest well: the devils also believe, and tremble',
          parent: 'j2-4' },
        { id: 'j2-6', verses: '20', type: 'question',
          keyword: 'But wilt thou know', text: 'O vain man, that faith without works is dead?',
          parent: 'j2-5' },
        { id: 'j2-7', verses: '21-23', type: 'ground',
          keyword: 'Was not', text: 'Abraham our father justified by works, when he had offered Isaac his son upon the altar? Seest thou how faith wrought with his works, and by works was faith made perfect?',
          parent: 'j2-6' },
        { id: 'j2-8', verses: '26', type: 'inference',
          keyword: 'For as', text: 'the body without the spirit is dead, so faith without works is dead also',
          parent: 'j2-7' },
      ]
    },

  ]},
];

const ARGUMENT_MAPS = [];
for (const sec of ARGUMENT_SECTIONS) {
  for (const m of sec.maps) {
    m.section = sec.name;
    ARGUMENT_MAPS.push(m);
  }
}
