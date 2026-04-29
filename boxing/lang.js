// l1ft0ff — Mission Babel v2 — i18n for nextelite-boxing
// "the ring speaks every language. the work is universal."
// Detects ?lang= param, saves to localStorage, persists across pages.
// v2: proper bokmål (æøå), translated nav, trendy no/en mix

(function() {
  'use strict';

  // ═══════════════════════════════════════
  // TRANSLATIONS
  // ═══════════════════════════════════════
  var translations = {

    // === NAV LABELS (main menu items) ===
    'nav-boxing': { en: 'BOXING', no: 'BOKSING' },
    'nav-tagteach': { en: 'TagTeach', no: 'TagTeach' },
    'nav-space': { en: 'THE SPACE', no: 'THE SPACE' },
    'nav-schedule': { en: 'SCHEDULE', no: 'TIMEPLAN' },
    'nav-n3xt3lit3': { en: 'N3XT3LIT3', no: 'N3XT3LIT3' },

    // === PAGE TITLES (h1 on sub-pages) ===
    'page-title-boxing': { en: 'BOXING', no: 'BOKSING' },
    'page-title-tagteach': { en: 'TagTeach', no: 'TagTeach' },
    'page-title-space': { en: 'THE SPACE', no: 'THE SPACE' },
    'page-title-schedule': { en: 'SCHEDULE', no: 'TIMEPLAN' },
    'page-title-n3xt3lit3': { en: 'N3XT3LIT3', no: 'N3XT3LIT3' },

    // === INDEX (nav hover labels) ===
    'nav-hover-boxing': { en: 'GLOVES ON', no: 'HANSKER PÅ' },
    'nav-hover-tagteach': { en: 'CLICK.', no: 'KLIKK.' },
    'nav-hover-space': { en: 'THE GYM', no: 'TRENINGSLOKALET' },
    'nav-hover-schedule': { en: 'SHOW UP', no: 'MØT OPP' },
    'nav-hover-n3xt3lit3': { en: 'XXX', no: 'XXX' },
    'footer-mailing': { en: 'MAILING LIST', no: 'NYHETSBREV' },
    'footer-boring': { en: 'BORING STUFF', no: 'KJEDELIGE TING' },

    // === MOBILE BOTTOM NAV LABELS ===
    'mob-nav-home': { en: 'HOME', no: 'HJEM' },
    'mob-nav-train': { en: 'TRAIN', no: 'TRÉN' },
    'mob-nav-walls': { en: 'WALLS', no: 'REGLER' },
    'mob-nav-more': { en: 'MORE', no: 'MER' },
    'mob-nav-box': { en: 'BOX', no: 'BOKS' },
    'mob-nav-space': { en: 'SPACE', no: 'ROM' },
    'mob-nav-gear': { en: 'GEAR', no: 'UTSTYR' },
    'mob-nav-time': { en: 'TIME', no: 'TID' },
    'mob-nav-tag': { en: 'TAG', no: 'TAG' },
    'mob-nav-nxt': { en: 'NXT', no: 'NXT' },

    // === BOXING PAGE ===
    'boxing-subtitle': { en: 'Gloves on.', no: 'Hansker på.' },
    'boxing-intro': {
      en: 'Not a fitness class. Not cardio. Boxing. The kind where you learn what your hands are for and your ego becomes optional.',
      no: 'Ikke en treningstime. Ikke cardio. Boksing. Den typen der du lærer hva hendene dine er til og egoet blir valgfritt.'
    },
    'boxing-what-happens': { en: 'WHAT HAPPENS HERE', no: 'HVA SKJER HER' },
    'boxing-list-1': { en: 'Rounds on the bag', no: 'Runder på sekken' },
    'boxing-list-2': { en: 'Combinations', no: 'Kombinasjoner' },
    'boxing-list-3': { en: 'Footwork', no: 'Fotarbeid' },
    'boxing-list-4': { en: 'Pad work', no: 'Putearbeid' },
    'boxing-statement': { en: 'The ring remembers.', no: 'Ringen husker.' },

    // === TAGTEACH PAGE ===
    'tagteach-subtitle': { en: 'Click.', no: 'Klikk.' },
    'tagteach-intro': {
      en: 'Precision feedback. One click at a time. TagTeach applies clicker training principles to human coaching. The tag point is the smallest piece of behavior that matters.',
      no: 'Presisjon i tilbakemelding. Ett klikk om gangen. TagTeach bruker klikkertrening på mennesker. Tag point er den minste delen av atferd som betyr noe.'
    },
    'tagteach-how': { en: 'HOW IT WORKS', no: 'SLIK FUNGERER DET' },
    'tagteach-step-1': { en: 'Identify the tag point', no: 'Identifiser tag point' },
    'tagteach-step-2': { en: 'Mark the moment', no: 'Markér øyeblikket' },
    'tagteach-step-3': { en: 'Reinforce', no: 'Forsterk' },
    'tagteach-statement': {
      en: 'The click is not a reward. It is information.',
      no: 'Klikket er ikke en belønning. Det er informasjon.'
    },

    // === THE SPACE PAGE ===
    'space-subtitle': { en: 'The gym.', no: 'Lokalet.' },
    'space-intro': {
      en: 'A garage gym above the arctic circle. Mirrors for shadowboxing, not for show. The gloves, the bags, the weights — we take care of them, they take care of us.',
      no: 'Et garasjelokale over polarsirkelen. Speil for skyggeboksing, ikke for show. Hanskene, sekkene, vektene — vi tar vare på dem, de tar vare på oss.'
    },
    'space-location': { en: 'Myre, Vesterålen.', no: 'Myre, Vesterålen.' },
    'space-coords': { en: '68 degrees north.', no: '68 grader nord.' },
    // Equipment labels
    'equip-full-space': { en: 'The full space', no: 'Hele lokalet' },
    'equip-command-wall': { en: 'Command wall', no: 'Kommandoveggen' },
    'equip-speed-bag': { en: 'Meister speed bag', no: 'Meister speed bag' },
    'equip-trx-corner': { en: 'TRX + speed bag corner', no: 'TRX + speed bag-hjørnet' },
    'equip-trx-straps': { en: 'TRX straps', no: 'TRX-stropper' },
    'equip-wallbag': { en: 'Fighter wallbag', no: 'Fighter veggbag' },
    'equip-wallbag-slip': { en: 'Wallbag + slip line', no: 'Veggbag + sliplinje' },
    'equip-speed-detail': { en: 'Meister speed bag', no: 'Meister speed bag' },
    'equip-timeless': { en: 'Timeless jump', no: 'Timeless jump' },
    'equip-wallbag-crate': { en: 'Fighter wallbag + crate', no: 'Fighter veggbag + bur' },
    'equip-reflex': { en: 'Reflex ball', no: 'Refleksball' },
    'equip-reflex-detail': { en: 'Reflex ball detail', no: 'Refleksball detalj' },
    'equip-reflex-stick': { en: 'Title reflex stick', no: 'Title refleksstav' },
    'equip-slip-line': { en: 'Slip line', no: 'Sliplinje' },

    // === SCHEDULE PAGE ===
    'schedule-subtitle': { en: 'Show up.', no: 'Møt opp.' },
    'schedule-intro': {
      en: 'The hardest round is the one before you start. Open the door.',
      no: 'Den tyngste runden er den før du begynner. Åpne døra.'
    },
    'schedule-weekly': { en: 'WEEKLY', no: 'UKENTLIG' },
    'schedule-monday': { en: 'MONDAY', no: 'MANDAG' },
    'schedule-wednesday': { en: 'WEDNESDAY', no: 'ONSDAG' },
    'schedule-friday': { en: 'FRIDAY', no: 'FREDAG' },
    'schedule-boxing': { en: 'Boxing', no: 'Boksing' },
    'schedule-tbd': { en: 'Time TBD', no: 'Tid kommer' },
    'schedule-contact': { en: 'CONTACT', no: 'KONTAKT' },
    'schedule-location': { en: 'Myre, Vesterålen', no: 'Myre, Vesterålen' },
    'schedule-statement': {
      en: 'No excuses accepted. No excuses needed.',
      no: 'Ingen unnskyldninger akseptert. Ingen unnskyldninger trengs.'
    },

    // === N3XT3LIT3 PAGE ===
    'n3xt3lit3-subtitle': {
      en: 'Not here to be pretty. Here to be dangerous.',
      no: 'Ikke her for å være pen. Her for å være farlig.'
    },
    'n3xt3lit3-about': {
      en: 'NextElite Boxing and TagTeach. Run by Nemine Steffensen. Myre, Vesterålen, Northern Norway. Above the arctic circle.',
      no: 'NextElite boksing og TagTeach. Drevet av Nemine Steffensen. Myre, Vesterålen, Nord-Norge. Over polarsirkelen.'
    },
    'n3xt3lit3-wall-1': { en: 'Show up', no: 'Møt opp' },
    'n3xt3lit3-wall-2': { en: 'Gloves on', no: 'Hansker på' },
    'n3xt3lit3-wall-3': { en: 'No shortcuts', no: 'Ingen snarveier' },
    'n3xt3lit3-wall-4': { en: 'The ring remembers', no: 'Ringen husker' },

    // === MOBILE SPECIFIC ===
    'mobile-swipe': { en: 'Swipe', no: 'Sveip' },
    'mobile-gallery-space': { en: 'THE SPACE', no: 'LOKALET' },
    'mobile-gallery-equipment': { en: 'THE EQUIPMENT', no: 'UTSTYRET' },
    'mobile-gallery-gear': { en: 'THE GEAR', no: 'UTSTYRET' },
    'mobile-gallery-method': { en: 'THE METHOD', no: 'METODEN' },
    'mobile-four-walls': { en: 'THE FOUR WALLS', no: 'DE FIRE VEGGENE' },
    'mobile-training': { en: 'THE TRAINING', no: 'TRENINGA' },

    // Boxing mobile equipment
    'mob-equip-bag-name': { en: 'The bag', no: 'Sekken' },
    'mob-equip-bag-desc': {
      en: 'Everlast heavy bag. Chain-mounted. The one that swings back. This is where you learn what your hands are for.',
      no: 'Everlast tung sekk. Kjedemontert. Den som svinger tilbake. Det er her du lærer hva hendene dine er til.'
    },
    'mob-equip-dummy-name': { en: 'the dummy', no: 'dukken' },
    'mob-equip-dummy-desc': {
      en: 'century bob. it never hits back. that\u0027s the point. practice precision when there are no consequences. then carry it into chaos.',
      no: 'century bob. den slår aldri tilbake. det er hele poenget. øv presisjon når det ikke er konsekvenser. så tar du det med inn i kaoset.'
    },
    'mob-equip-speed-name': { en: 'The speed', no: 'Farten' },
    'mob-equip-speed-desc': {
      en: 'meister speed bag. wall-mounted on wood. rhythm is violence made precise. you don\u0027t hit it. you tune into it.',
      no: 'meister speed bag. veggmontert på tre. rytme er vold gjort presist. du slår den ikke. du lytter til den.'
    },
    'mob-equip-wall-name': { en: 'The wall', no: 'Veggen' },
    'mob-equip-wall-desc': {
      en: 'Fighter wallbag. Wall-mounted uppercuts in the dark. When the heavy bag teaches power, the wall teaches angles. Close range. Personal.',
      no: 'Fighter veggbag. Veggmonterte uppercuts i mørket. Når den tunge sekken lærer kraft, lærer veggen vinkler. Nærdistanse. Personlig.'
    },

    // Boxing mobile statement
    'mob-boxing-statement-1': {
      en: 'Boxing is meditation with consequences.',
      no: 'Boksing er meditasjon med konsekvenser.'
    },
    'mob-boxing-statement-2': {
      en: 'one room. blue mats. bags that don\u0027t care about your day. two dogs watching from the corner. this is not a fitness center. this is where you remember what discipline feels like.',
      no: 'ett rom. blå matter. sekker som ikke bryr seg om dagen din. to hunder som ser på fra hjørnet. dette er ikke et treningssenter. dette er dit du går for å huske hva disiplin føles som.'
    },

    // Boxing mobile training cards
    'mob-train-rounds': { en: 'Rounds', no: 'Runder' },
    'mob-train-boxing': { en: 'Boxing', no: 'Boksing' },
    'mob-train-boxing-desc': {
      en: 'heavy bag. speed bag. bob. wallbag. reflex stick. combinations until your brain stops narrating and your body takes over. that\u0027s the goal.',
      no: 'tung sekk. speed bag. bob. veggbag. refleksstav. kombinasjoner til hjernen slutter å kommentere og kroppen tar over. det er målet.'
    },
    'mob-train-circuits': { en: 'Circuits', no: 'Sirkler' },
    'mob-train-conditioning': { en: 'Conditioning', no: 'Kondisjon' },
    'mob-train-conditioning-desc': {
      en: 'Jump rope. Agility ladder. TRX suspension. No machines. No screens. Just you, gravity, and the timer. The kind of tired that fixes things.',
      no: 'Hopptau. Agility-stige. TRX. Ingen maskiner. Ingen skjermer. Bare deg, tyngdekraften og klokka. Den typen sliten som fikser ting.'
    },
    'mob-train-film': { en: 'Film', no: 'Film' },
    'mob-train-analysis': { en: 'Analysis', no: 'Analyse' },
    'mob-train-analysis-desc': {
      en: 'tripod-recorded sessions. watch yourself back. what you thought you were doing vs. what you actually did. the mirror lies. the camera doesn\u0027t.',
      no: 'økter filmet på stativ. se deg selv. se hva du trodde du gjorde vs. hva du faktisk gjorde. speilet lyver. kameraet gjør ikke det.'
    },
    'mob-train-intro': {
      en: 'three modes. one principle: show up and the work reveals itself.',
      no: 'tre moduser. ett prinsipp: møt opp og arbeidet viser seg.'
    },

    // Boxing mobile four walls
    'mob-wall-1-name': { en: 'show up', no: 'møt opp' },
    'mob-wall-1-desc': {
      en: 'the hardest round is the one before you start. open the door. that is the workout.',
      no: 'den tyngste runden er den før du begynner. åpne døra. det er økta.'
    },
    'mob-wall-2-name': { en: 'gloves on', no: 'hansker på' },
    'mob-wall-2-desc': {
      en: 'no spectators. once you\u0027re here, you\u0027re here. wrap your hands. commit.',
      no: 'ingen tilskuere. når du er her, er du her. surr hendene. forplikt deg.'
    },
    'mob-wall-3-name': { en: 'no shortcuts', no: 'ingen snarveier' },
    'mob-wall-3-desc': {
      en: 'every rep counts or none of them do. form over speed. patience over ego. always.',
      no: 'hvert rep teller eller ingen av dem gjør det. form over fart. tålmodighet over ego. alltid.'
    },
    'mob-wall-4-name': { en: 'the ring remembers', no: 'ringen husker' },
    'mob-wall-4-desc': {
      en: 'what you do when nobody\u0027s watching is who you are. the room keeps score.',
      no: 'det du gjør når ingen ser på er den du er. rommet holder telling.'
    },

    // Boxing mobile location
    'mob-location-title': { en: 'myre, vesterålen', no: 'myre, vesterålen' },
    'mob-location-body-1': {
      en: 'above the arctic circle. winter is five months of darkness and the gym lights stay on. not a destination. this is where the work lives.',
      no: 'over polarsirkelen. der vinteren er fem måneder mørke og lyset i lokalet alltid er på. dette er ikke en destinasjon. dette er der arbeidet bor.'
    },
    'mob-location-body-2': {
      en: 'nextelite boxing and tagteach. run by nemine steffensen. two dogs on site. they don\u0027t judge your footwork. much.',
      no: 'nextelite boksing og tagteach. drevet av nemine steffensen. to hunder på stedet. de dømmer ikke fotarbeidet ditt. stort sett.'
    },
    'mob-closing-ring': { en: 'the ring remembers.', no: 'ringen husker.' },

    // The-space mobile equipment descriptions
    'mob-space-speed-desc': { en: 'wall-mounted on wood. rhythm is violence made precise.', no: 'veggmontert på tre. rytme er vold gjort presist.' },
    'mob-space-trx-desc': { en: 'suspension training. no machines. just gravity and intent.', no: 'suspensjonstrening. ingen maskiner. bare tyngdekraft og intensjon.' },
    'mob-space-reflex-desc': { en: 'hand-eye coordination. the thing that doesn\'t care how ready you think you are.', no: 'hånd-øye-koordinasjon. tingen som ikke bryr seg om hvor klar du tror du er.' },
    'mob-space-jump-desc': { en: 'jump rope collection. oldest conditioning tool there is. still the best.', no: 'hopptausamling. det eldste kondisjonsverktøy. fortsatt det beste.' },
    'mob-space-wallbag-desc': { en: 'wall-mounted uppercuts. close range. personal.', no: 'veggmonterte uppercuts. nærdistanse. personlig.' },
    'mob-space-location-body': {
      en: 'above the arctic circle. winter is five months of darkness and the gym lights stay on.',
      no: 'over polarsirkelen. der vinteren er fem måneder mørke og lyset i lokalet alltid er på.'
    },
    'mob-space-closing': { en: 'every piece earned its place.', no: 'hvert eneste utstyr fortjente plassen sin.' },

    // Tagteach mobile
    'mob-tagteach-step-1-desc': {
      en: 'the smallest learnable piece. one thing at a time. nothing more.',
      no: 'den minste lærbare delen. én ting om gangen. ikke mer.'
    },
    'mob-tagteach-step-2-desc': {
      en: 'the click lands at the exact moment the behavior is correct. timing is everything.',
      no: 'klikket skjer i nøyaktig det øyeblikket atferden er korrekt. timing er alt.'
    },
    'mob-tagteach-step-3-desc': {
      en: 'the brain connects the click to the action. repeat. the body learns what words cannot teach.',
      no: 'hjernen kobler klikket til handlingen. gjenta. kroppen lærer det ord ikke kan lære bort.'
    },

    // Schedule mobile
    'mob-schedule-statement': {
      en: 'no excuses accepted. no excuses needed.',
      no: 'ingen unnskyldninger akseptert. ingen unnskyldninger trengs.'
    },

    // n3xt3lit3 mobile
    'mob-n3xt3lit3-closing': { en: 'the ring remembers.', no: 'ringen husker.' },

    // Gallery captions (boxing mobile)
    'caption-dummy': { en: 'the dummy', no: 'dukken' },
    'caption-bag': { en: 'the bag', no: 'sekken' },
    'caption-floor': { en: 'the floor', no: 'gulvet' },
    'caption-speed': { en: 'the speed', no: 'farten' },
    'caption-wall': { en: 'the wall', no: 'veggen' },
    'caption-gear': { en: 'the gear', no: 'utstyret' },
    'caption-marker': { en: 'the marker', no: 'markøren' },
    'caption-bridge': { en: 'the bridge', no: 'broen' },
    'caption-focus': { en: 'the focus', no: 'fokuset' },
    'caption-review': { en: 'the review', no: 'gjennomgangen' },
    'caption-command': { en: 'command wall', no: 'kommandoveggen' },
    'caption-trx': { en: 'trx corner', no: 'trx-hjørnet' },
    'caption-reflex-stick': { en: 'reflex stick', no: 'refleksstav' },
    'caption-view': { en: 'the view', no: 'utsikten' },
    'caption-space': { en: 'the space', no: 'lokalet' },
    'caption-kriger': { en: 'kriger', no: 'kriger' },
    'caption-morning': { en: 'morning light', no: 'morgenlys' },

    // Back link
    'back': { en: '\u2190 BACK', no: '\u2190 TILBAKE' },

    // === SALGSBETINGELSER PAGE ===
    // Page chrome
    'salg-title': {
      no: 'Salgsbetingelser \u2014 NextElite Boxing',
      en: 'Terms of Sale \u2014 NextElite Boxing'
    },
    'salg-back': { no: '\u2190 Tilbake', en: '\u2190 Back' },
    'salg-h1': { no: 'Salgsbetingelser', en: 'Terms of Sale' },
    'salg-subtitle': {
      no: 'NextElite Boxing \u2014 Myre, Vester\u00e5len',
      en: 'NextElite Boxing \u2014 Myre, Vester\u00e5len'
    },

    // Meta block
    'salg-meta-seller-label': { no: 'Selger:', en: 'Seller:' },
    'salg-meta-seller-value': {
      no: 'Neminee Steffensen ENK',
      en: 'Neminee Steffensen ENK (sole proprietorship)'
    },
    'salg-meta-orgno-label': { no: 'Org.nr:', en: 'Org. no.:' },
    'salg-meta-orgno-value': { no: '926 490 486', en: '926 490 486' },
    'salg-meta-brand-label': {
      no: 'Foretaksnavn / merkevare:',
      en: 'Trade name / brand:'
    },
    'salg-meta-brand-value': { no: 'NextElite Boxing', en: 'NextElite Boxing' },
    'salg-meta-address-label': { no: 'Adresse:', en: 'Address:' },
    'salg-meta-address-value': {
      no: 'Myre, Vester\u00e5len, Norge',
      en: 'Myre, Vester\u00e5len, Norway'
    },
    'salg-meta-email-label': { no: 'E-post:', en: 'Email:' },
    'salg-meta-updated-label': { no: 'Sist oppdatert:', en: 'Last updated:' },
    'salg-meta-updated-value': { no: '28. april 2026', en: '28 April 2026' },

    // Lead paragraph
    'salg-lead': {
      no: 'Disse salgsbetingelsene gjelder for kj\u00f8p av drop-in og medlemskap hos NextElite Boxing. Ved \u00e5 gjennomf\u00f8re et kj\u00f8p aksepterer du betingelsene under. Vi f\u00f8lger norsk forbrukerlovgivning, inkludert forbrukerkj\u00f8psloven og angrerettloven. Forbrukerkj\u00f8p reguleres ellers av disse lovene der de gir deg sterkere rettigheter enn det som st\u00e5r her.',
      en: 'These terms of sale apply to the purchase of drop-in sessions and memberships at NextElite Boxing. By completing a purchase you accept the terms below. We follow Norwegian consumer law, including the Norwegian Consumer Purchases Act (Forbrukerkj\u00f8psloven) and the Norwegian Right of Withdrawal Act (Angrerettloven). Consumer purchases are otherwise governed by these statutes wherever they grant you stronger rights than what is stated here. This English version is provided for clarity; the contract is governed by Norwegian law.'
    },

    // Section 1 \u2014 Avtaleparter / Parties
    'salg-section-1-title': { no: 'Avtaleparter', en: 'Parties to the Agreement' },
    'salg-section-1-p1': {
      no: 'Selger er <strong>Neminee Steffensen ENK</strong> (org.nr. 926 490 486), heretter omtalt som "NextElite Boxing", "vi" eller "oss". Kj\u00f8per er den personen som gjennomf\u00f8rer bestilling, heretter omtalt som "du" eller "medlem".',
      en: 'The seller is <strong>Neminee Steffensen ENK</strong> (org. no. 926 490 486), hereinafter referred to as "NextElite Boxing", "we" or "us". The buyer is the person completing the order, hereinafter referred to as "you" or "the member".'
    },
    'salg-section-1-p2': {
      no: 'NextElite Boxing er merkenavnet \u2014 den juridiske enheten som driver virksomheten er enkeltpersonforetaket Neminee Steffensen ENK. Trenere og instrukt\u00f8rer er ikke avtalepart.',
      en: 'NextElite Boxing is the brand name \u2014 the legal entity operating the business is the sole proprietorship Neminee Steffensen ENK. Coaches and instructors are not parties to this agreement.'
    },

    // Section 2 \u2014 Hva du kj\u00f8per / What you are buying
    'salg-section-2-title': { no: 'Hva du kj\u00f8per', en: 'What You Are Buying' },
    'salg-section-2-h3-dropin': { no: 'Drop-in', en: 'Drop-in' },
    'salg-section-2-dropin-p': {
      no: 'Tilgang til \u00e9n trenings\u00f8kt p\u00e5 NextElite Boxing, gyldig p\u00e5 den dagen kj\u00f8pet gjelder.',
      en: 'Access to a single training session at NextElite Boxing, valid on the date the purchase applies to.'
    },
    'salg-price-th-category': { no: 'Kategori', en: 'Category' },
    'salg-price-th-price': { no: 'Pris', en: 'Price' },
    'salg-price-row-adult-label': { no: 'Voksen', en: 'Adult' },
    'salg-price-row-adult-value': { no: '120 kr', en: 'NOK 120' },
    'salg-price-row-student-label': { no: 'Student / ungdom', en: 'Student / youth' },
    'salg-price-row-student-value': { no: '80 kr', en: 'NOK 80' },
    'salg-section-2-dropin-note': {
      no: 'Studentpris krever gyldig studentbevis (digital eller fysisk) som vises ved f\u00f8rste oppm\u00f8te. Ungdomsrabatt gjelder 13-19 \u00e5r, verifisert via f\u00f8dselsdato ved registrering. Misvisende informasjon kan medf\u00f8re etterbetaling og oppsigelse av medlemskap.',
      en: 'Student pricing requires a valid student ID (digital or physical) shown at first attendance. The youth discount applies to ages 13-19 and is verified via date of birth at registration. Misleading information may result in back-payment and termination of the membership.'
    },

    'salg-section-2-h3-age': {
      no: 'Aldersgrenser og tilstedev\u00e6relse',
      en: 'Age limits and supervision'
    },
    'salg-age-th-age': { no: 'Alder', en: 'Age' },
    'salg-age-th-can': { no: 'Kan trene', en: 'May train' },
    'salg-age-th-req': { no: 'Krav', en: 'Requirement' },
    'salg-age-row-1-age': { no: '6-9 \u00e5r', en: '6-9 years' },
    'salg-age-row-1-can': {
      no: 'Med foresatt eller annen voksen (18+)',
      en: 'With a legal guardian or other adult (18+)'
    },
    'salg-age-row-1-req': {
      no: 'Foresatt signerer avtalen',
      en: 'Legal guardian signs the agreement'
    },
    'salg-age-row-2-age': { no: '10-12 \u00e5r', en: '10-12 years' },
    'salg-age-row-2-can': {
      no: 'Voksens tilstedev\u00e6relse anbefalt, ikke p\u00e5krevd',
      en: 'Adult presence recommended, not required'
    },
    'salg-age-row-2-req': {
      no: 'Foresatt signerer avtalen',
      en: 'Legal guardian signs the agreement'
    },
    'salg-age-row-3-age': { no: '13-15 \u00e5r', en: '13-15 years' },
    'salg-age-row-3-can': { no: 'Selvstendig', en: 'Independently' },
    'salg-age-row-3-req': {
      no: 'Foresatt signerer avtalen',
      en: 'Legal guardian signs the agreement'
    },
    'salg-age-row-4-age': { no: '16-17 \u00e5r', en: '16-17 years' },
    'salg-age-row-4-can': { no: 'Selvstendig', en: 'Independently' },
    'salg-age-row-4-req': {
      no: 'Foresatt signerer avtalen (vergem\u00e5lsloven)',
      en: 'Legal guardian signs the agreement (Norwegian Guardianship Act, Vergem\u00e5lsloven)'
    },
    'salg-age-row-5-age': { no: '18+', en: '18+' },
    'salg-age-row-5-can': { no: 'Selvstendig', en: 'Independently' },
    'salg-age-row-5-req': { no: 'Egen signatur', en: 'Signs personally' },

    'salg-section-2-h3-sparring': {
      no: 'Sparring og kontakt-trening',
      en: 'Sparring and contact training'
    },
    'salg-section-2-sparring-p': {
      no: 'Hard sparring (kontakt-boksing) tillates ikke f\u00f8r 15 \u00e5r. KO-trening tillates ikke f\u00f8r 18 \u00e5r. Disse grensene f\u00f8lger Norges Bokseforbunds anbefalinger og gjelder uten unntak.',
      en: 'Hard sparring (contact boxing) is not permitted before the age of 15. KO training is not permitted before the age of 18. These limits follow the recommendations of the Norwegian Boxing Federation (Norges Bokseforbund) and apply without exception.'
    },

    'salg-section-2-h3-monthly': {
      no: 'M\u00e5nedlig medlemskap uten binding',
      en: 'Monthly membership without commitment'
    },
    'salg-section-2-monthly-p': {
      no: 'L\u00f8pende medlemskap som fornyes automatisk hver m\u00e5ned via Vipps faste betalinger. Inkluderer tilgang til ordin\u00e6re treninger i \u00e5pningstiden.',
      en: 'An ongoing membership that renews automatically each month via Vipps Recurring Payments. Includes access to regular training sessions during opening hours.'
    },
    'salg-section-2-monthly-li1': {
      no: 'Pris: <strong>449 kr/mnd</strong>',
      en: 'Price: <strong>NOK 449/month</strong>'
    },
    'salg-section-2-monthly-li2': {
      no: 'Ingen bindingstid',
      en: 'No commitment period'
    },
    'salg-section-2-monthly-li3': {
      no: 'Fornyes automatisk inntil du selv avslutter avtalen i Vipps-appen',
      en: 'Renews automatically until you cancel the agreement yourself in the Vipps app'
    },

    'salg-section-2-h3-commit': {
      no: 'Medlemskap med 6 m\u00e5neders binding',
      en: 'Membership with 6-month commitment'
    },
    'salg-section-2-commit-p': {
      no: 'Rabattert medlemskap mot at du forplikter deg til seks m\u00e5neder. Inkluderer tilgang til lokalet i \u00e5pningstiden.',
      en: 'A discounted membership in exchange for a six-month commitment. Includes access to the gym during opening hours.'
    },
    'salg-section-2-commit-li1': {
      no: 'Pris: <strong>299 kr/mnd</strong> i seks m\u00e5neder, m\u00e5nedlig trekk via Vipps faste betalinger',
      en: 'Price: <strong>NOK 299/month</strong> for six months, charged monthly via Vipps Recurring Payments'
    },
    'salg-section-2-commit-li2': {
      no: 'Total i bindingsperioden: 1 794 kr',
      en: 'Total during the commitment period: NOK 1,794'
    },
    'salg-section-2-commit-li3': {
      no: 'Etter endt bindingsperiode g\u00e5r avtalen automatisk over til l\u00f8pende m\u00e5nedlig medlemskap til samme pris (299 kr/mnd) inntil du selv avslutter den i Vipps-appen.',
      en: 'After the commitment period ends, the agreement automatically converts to an ongoing monthly membership at the same price (NOK 299/month) until you cancel it yourself in the Vipps app.'
    },

    'salg-section-2-h3-includes': {
      no: 'Hva medlemskapet gir',
      en: 'What the membership includes'
    },
    'salg-section-2-includes-p': {
      no: 'Medlemskapet gir tilgang til lokalet i \u00e5pningstiden \u2014 sekken, vektene, speilet, refleksstaven, alt utstyret som finnes der. Du trener selvstendig eller med treningspartner. <strong>Etterhvert kommer planlagte treninger og gruppetimer som inkluderes i medlemskapet</strong>; vi varsler i god tid f\u00f8r disse settes i drift.',
      en: 'The membership grants access to the gym during opening hours \u2014 the bag, the weights, the mirror, the reflex stick, all the equipment in the room. You train independently or with a training partner. <strong>Scheduled sessions and group classes will be added later and included in the membership</strong>; we will give ample notice before these are launched.'
    },
    'salg-section-2-includes-note': {
      no: 'Praktiske detaljer om booking, kapasitet, \u00e5pningstider, husregler og pause-funksjon kommuniseres til medlemmer separat. Disse kan endres uten varsel; vesentlige endringer i hva medlemskapet inkluderer varsles 30 dager i forveien.',
      en: 'Practical details about booking, capacity, opening hours, house rules and the pause function are communicated to members separately. These may change without notice; material changes to what the membership includes will be announced 30 days in advance.'
    },

    // Section 3 \u2014 Betaling / Payment
    'salg-section-3-title': { no: 'Betaling', en: 'Payment' },
    'salg-section-3-h3-method': { no: 'Betalingsmetode', en: 'Payment method' },
    'salg-section-3-method-p': {
      no: 'Vi bruker <strong>Vipps</strong> som betalingsleverand\u00f8r. Drop-in betales med Vipps engangsbetaling. Medlemskap betales gjennom <strong>Vipps faste betalinger</strong> (Vipps Recurring), som trekkes automatisk hver m\u00e5ned.',
      en: 'We use <strong>Vipps</strong> as our payment provider. Drop-in is paid with a single Vipps payment. Memberships are paid through <strong>Vipps Recurring Payments</strong> (Vipps faste betalinger), charged automatically each month.'
    },
    'salg-section-3-h3-when': { no: 'N\u00e5r trekkes du', en: 'When you are charged' },
    'salg-section-3-when-p': {
      no: 'Ved kj\u00f8p av medlemskap blir f\u00f8rste bel\u00f8p trukket umiddelbart. Deretter trekkes du p\u00e5 samme dato hver m\u00e5ned. Du f\u00e5r varsel fra Vipps f\u00f8r hvert trekk.',
      en: 'When you purchase a membership, the first amount is charged immediately. After that, you are charged on the same date each month. Vipps notifies you before each charge.'
    },
    'salg-section-3-h3-renewal': {
      no: 'Automatisk fornyelse',
      en: 'Automatic renewal'
    },
    'salg-section-3-renewal-p': {
      no: 'Medlemskap er en abonnementsavtale med automatisk fornyelse. Avtalen fornyes hver m\u00e5ned inntil du selv avslutter den. Du finner en oversikt over avtalen og kan stoppe den n\u00e5r som helst i Vipps-appen \u2014 se punkt 5.',
      en: 'A membership is a subscription agreement with automatic renewal. The agreement renews monthly until you cancel it yourself. You can find an overview of the agreement and stop it at any time in the Vipps app \u2014 see section 5.'
    },
    'salg-section-3-h3-prices': { no: 'Prisendringer', en: 'Price changes' },
    'salg-section-3-prices-p': {
      no: 'Eventuelle prisendringer p\u00e5 l\u00f8pende medlemskap varsles minst 30 dager f\u00f8r de trer i kraft, slik at du har anledning til \u00e5 si opp avtalen f\u00f8r ny pris trekkes. Inng\u00e5tte bindingsavtaler holder avtalt pris ut bindingsperioden.',
      en: 'Any price changes to ongoing memberships will be announced at least 30 days before they take effect, so you have the opportunity to cancel the agreement before the new price is charged. Existing fixed-term commitment agreements retain the agreed price for the remainder of the commitment period.'
    },

    // Section 4 \u2014 Angrerett / Right of Withdrawal
    'salg-section-4-title': { no: 'Angrerett', en: 'Right of Withdrawal' },
    'salg-section-4-p1': {
      no: 'N\u00e5r du kj\u00f8per et medlemskap som forbruker i Norge, har du <strong>14 dagers angrerett</strong> etter angrerettloven, regnet fra den dagen avtalen ble inng\u00e5tt.',
      en: 'When you purchase a membership as a consumer in Norway, you have a <strong>14-day right of withdrawal</strong> under the Norwegian Right of Withdrawal Act (Angrerettloven), counted from the day the agreement was entered into.'
    },
    'salg-section-4-h3-how': {
      no: 'Hvordan benytter du angreretten',
      en: 'How to exercise your right of withdrawal'
    },
    'salg-section-4-how-p': {
      no: 'Send oss en e-post til <a href="mailto:nemine@nextelite.no">nemine@nextelite.no</a> innen 14 dager med beskjed om at du angrer. Du kan bruke det offisielle <a href="https://www.forbrukertilsynet.no/angrerettskjema" target="_blank" rel="noopener">angreskjemaet fra Forbrukertilsynet</a>, men det er ikke et krav. Det holder at meldingen er entydig.',
      en: 'Send us an email at <a href="mailto:nemine@nextelite.no">nemine@nextelite.no</a> within 14 days stating that you wish to withdraw. You may use the official <a href="https://www.forbrukertilsynet.no/angrerettskjema" target="_blank" rel="noopener">withdrawal form from the Norwegian Consumer Authority (Forbrukertilsynet)</a>, but it is not required. An unambiguous statement is sufficient.'
    },
    'salg-section-4-h3-what': {
      no: 'Hva skjer n\u00e5r du angrer',
      en: 'What happens when you withdraw'
    },
    'salg-section-4-what-p': {
      no: 'Vi stopper videre trekk og refunderer eventuelt betalt bel\u00f8p uten ugrunnet opphold, og senest innen 14 dager etter at vi har mottatt angremeldingen din. Tilbakebetaling skjer til samme betalingsmiddel som ble brukt ved kj\u00f8pet.',
      en: 'We stop further charges and refund any amount paid without undue delay, and at the latest within 14 days of receiving your withdrawal notice. Refunds are made to the same payment method used for the purchase.'
    },
    'salg-section-4-h3-exception': {
      no: 'Unntak \u2014 tjenester du allerede har brukt',
      en: 'Exception \u2014 services you have already used'
    },
    'salg-section-4-exception-p': {
      no: 'Dersom du har bedt om at medlemskapet skal starte f\u00f8r angrefristen utl\u00f8per og rakk \u00e5 bruke det (for eksempel deltatt p\u00e5 trening), kan vi kreve betaling for den forholdsmessige andelen av tjenesten du faktisk har benyttet, jf. angrerettloven \u00a7 26. Drop-in regnes som en digital tjeneste levert umiddelbart, og angreretten faller bort n\u00e5r \u00f8kten er gjennomf\u00f8rt.',
      en: 'If you have requested that the membership begin before the withdrawal period expires and you have used it (for example, attended a training session), we may charge for the proportionate part of the service you have actually used, cf. the Norwegian Right of Withdrawal Act (Angrerettloven) \u00a7 26. A drop-in is treated as a digital service delivered immediately, and the right of withdrawal lapses once the session has been completed.'
    },

    // Section 5 \u2014 Avbestilling og oppsigelse / Cancellation and Termination
    'salg-section-5-title': {
      no: 'Avbestilling og oppsigelse',
      en: 'Cancellation and Termination'
    },
    'salg-section-5-h3-ongoing': {
      no: 'L\u00f8pende medlemskap (uten binding)',
      en: 'Ongoing membership (no commitment)'
    },
    'salg-section-5-ongoing-p': {
      no: 'Avtaler via Vipps faste betalinger avsluttes i Vipps-appen. G\u00e5 til <em>Profil \u2192 Avtaler \u2192 NextElite Boxing \u2192 Avslutt avtale</em>. Avtalen l\u00f8per ut innev\u00e6rende betalingsperiode etter at du har avsluttet \u2014 du beholder tilgang til treningene til neste trekk-dato, men det blir ikke nytt trekk.',
      en: 'Agreements via Vipps Recurring Payments are cancelled in the Vipps app. Go to <em>Profile \u2192 Agreements \u2192 NextElite Boxing \u2192 End agreement</em>. The agreement runs to the end of the current billing period after you have cancelled \u2014 you keep access to training until the next charge date, but no new charge is made.'
    },
    'salg-section-5-h3-commit': {
      no: 'Medlemskap med 6 m\u00e5neders binding',
      en: 'Membership with 6-month commitment'
    },
    'salg-section-5-commit-p1': {
      no: 'Bindingstiden er bindende. Du kan ikke si opp avtalen i bindingsperioden, med mindre annet f\u00f8lger av ufravikelig forbrukerlovgivning (for eksempel ved vesentlig endring av tilbudet fra v\u00e5r side, eller s\u00e6rskilte sosiale forhold som dokumentert sykdom over lengre tid \u2014 ta kontakt s\u00e5 finner vi en l\u00f8sning).',
      en: 'The commitment period is binding. You cannot terminate the agreement during the commitment period unless otherwise required by mandatory consumer legislation (for example, in the case of a material change to the offering on our part, or specific personal circumstances such as documented long-term illness \u2014 get in touch and we will work something out).'
    },
    'salg-section-5-commit-p2': {
      no: 'Etter endt bindingsperiode fortsetter avtalen automatisk som l\u00f8pende m\u00e5nedlig medlemskap til samme pris (299 kr/mnd) inntil du selv avslutter den i Vipps-appen, p\u00e5 samme m\u00e5te som over.',
      en: 'After the commitment period ends, the agreement automatically continues as an ongoing monthly membership at the same price (NOK 299/month) until you cancel it yourself in the Vipps app, in the same way as above.'
    },
    'salg-section-5-h3-dropin': { no: 'Drop-in', en: 'Drop-in' },
    'salg-section-5-dropin-p': {
      no: 'Drop-in er kj\u00f8p av en enkelt trenings\u00f8kt. Vi tilbyr ikke refusjon ved avbestilling. Hvis du ikke kan m\u00f8te, kan du gi plassen din til en venn \u2014 bare gi oss beskjed p\u00e5 e-post s\u00e5 vi vet hvem som kommer.',
      en: 'A drop-in is the purchase of a single training session. We do not offer refunds for cancellations. If you cannot attend, you may give your spot to a friend \u2014 just let us know by email so we know who is coming.'
    },
    'salg-section-5-h3-gruppe': { no: 'Gruppetimer', en: 'Group classes' },
    'salg-section-5-gruppe-p': {
      no: 'Gruppetimer er inkludert i m\u00e5nedlig medlemskap. Ikke-medlemmer kan delta p\u00e5 gruppetime ved \u00e5 kj\u00f8pe drop-in til ordin\u00e6r pris. Plasser kan v\u00e6re begrenset \u2014 book derfor i forkant n\u00e5r dette er aktuelt.',
      en: 'Group classes are included in monthly memberships. Non-members can join a group class by purchasing a drop-in at the standard price. Spots may be limited \u2014 book in advance when relevant.'
    },

    // Section 6 \u2014 Reklamasjon / Complaints
    'salg-section-6-title': {
      no: 'Reklamasjon og klage',
      en: 'Complaints and Disputes'
    },
    'salg-section-6-p1': {
      no: 'Hvis du mener noe ikke er som det skal \u2014 feil trekk i Vipps, manglende tilgang, mangler ved tjenesten \u2014 vil vi gjerne h\u00f8re fra deg s\u00e5 snart som mulig. Send e-post til <a href="mailto:nemine@nextelite.no">nemine@nextelite.no</a> og beskriv hva som har skjedd.',
      en: 'If you believe something is not as it should be \u2014 an incorrect Vipps charge, lack of access, defects in the service \u2014 we want to hear from you as soon as possible. Email <a href="mailto:nemine@nextelite.no">nemine@nextelite.no</a> and describe what has happened.'
    },
    'salg-section-6-p2': {
      no: 'Vi svarer p\u00e5 alle e-poster innen 24 timer p\u00e5 hverdager. Vi svarer ikke i helger.',
      en: 'We respond to all emails within 24 hours on weekdays. We do not respond on weekends.'
    },
    'salg-section-6-p3': {
      no: 'Reklamasjon m\u00e5 fremsettes innen rimelig tid etter at du oppdaget eller burde oppdaget mangelen, og senest innen de fristene som f\u00f8lger av forbrukerkj\u00f8psloven og angrerettloven.',
      en: 'A complaint must be submitted within a reasonable time after you discovered or should have discovered the defect, and at the latest within the deadlines set out in the Norwegian Consumer Purchases Act (Forbrukerkj\u00f8psloven) and the Norwegian Right of Withdrawal Act (Angrerettloven).'
    },
    'salg-section-6-h3-disagree': {
      no: 'Hvis vi ikke blir enige',
      en: 'If we cannot reach an agreement'
    },
    'salg-section-6-disagree-p': {
      no: 'Partene skal fors\u00f8ke \u00e5 l\u00f8se eventuelle tvister i minnelighet. Dersom dette ikke lykkes, kan du som forbruker bringe saken inn for Forbrukertilsynet eller Forbrukerklageutvalget.',
      en: 'The parties shall attempt to resolve any dispute amicably. If that is not successful, you as a consumer may bring the matter before the Norwegian Consumer Authority (Forbrukertilsynet) or the Norwegian Consumer Disputes Commission (Forbrukerklageutvalget).'
    },
    'salg-section-6-li1': {
      no: 'Forbrukertilsynet: <a href="https://www.forbrukertilsynet.no" target="_blank" rel="noopener">forbrukertilsynet.no</a>',
      en: 'Norwegian Consumer Authority (Forbrukertilsynet): <a href="https://www.forbrukertilsynet.no" target="_blank" rel="noopener">forbrukertilsynet.no</a>'
    },
    'salg-section-6-li2': {
      no: 'Forbrukerr\u00e5det: telefon +47 23 400 500, <a href="https://www.forbrukerradet.no" target="_blank" rel="noopener">forbrukerradet.no</a>',
      en: 'Norwegian Consumer Council (Forbrukerr\u00e5det): phone +47 23 400 500, <a href="https://www.forbrukerradet.no" target="_blank" rel="noopener">forbrukerradet.no</a>'
    },
    'salg-section-6-li3': {
      no: 'EU-kommisjonens nettbaserte klageportal (ODR): <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener">ec.europa.eu/odr</a>',
      en: 'EU Commission online dispute resolution platform (ODR): <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener">ec.europa.eu/odr</a>'
    },

    // Section 7 \u2014 Personvern / Privacy
    'salg-section-7-title': {
      no: 'Behandling av personopplysninger',
      en: 'Processing of Personal Data'
    },
    'salg-section-7-p1': {
      no: 'For \u00e5 levere medlemskap og drop-in behandler vi personopplysninger om deg \u2014 typisk navn, e-postadresse, telefonnummer og betalingsinformasjon (sistnevnte h\u00e5ndteres av Vipps; vi lagrer ikke kortdata).',
      en: 'In order to deliver memberships and drop-in sessions, we process personal data about you \u2014 typically your name, email address, phone number and payment information (the latter is handled by Vipps; we do not store card data).'
    },
    'salg-section-7-p2': {
      no: 'Behandlingsansvarlig er Neminee Steffensen ENK. Rettslig grunnlag for behandlingen er oppfyllelse av avtalen med deg (GDPR art. 6 (1) (b)) samt rettslige forpliktelser, herunder bokf\u00f8ringsloven (GDPR art. 6 (1) (c)).',
      en: 'The data controller is Neminee Steffensen ENK. The legal basis for processing is performance of the agreement with you (GDPR art. 6 (1) (b)) as well as legal obligations, including the Norwegian Bookkeeping Act (Bokf\u00f8ringsloven) (GDPR art. 6 (1) (c)).'
    },
    'salg-section-7-p3': {
      no: 'Du har rett til innsyn, retting, sletting og dataportabilitet etter personopplysningsloven og GDPR. Du kan ogs\u00e5 klage til Datatilsynet (<a href="https://www.datatilsynet.no" target="_blank" rel="noopener">datatilsynet.no</a>).',
      en: 'You have the right of access, rectification, erasure and data portability under the Norwegian Personal Data Act (Personopplysningsloven) and the GDPR. You may also lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet) (<a href="https://www.datatilsynet.no" target="_blank" rel="noopener">datatilsynet.no</a>).'
    },
    'salg-section-7-p4': {
      no: 'Full personvernerkl\u00e6ring publiseres som eget dokument. Les den her: <a href="/personvern">personvernerkl\u00e6ring</a>.',
      en: 'A full privacy policy is published as a separate document. Read it here: <a href="/personvern">privacy policy</a>.'
    },

    // Footer version note + footer links
    'salg-footer-version': {
      no: 'Salgsbetingelser sist oppdatert: 28. april 2026.<br>Gjeldende versjon er den til enhver tid publiserte versjonen p\u00e5 denne siden.',
      en: 'Terms of Sale last updated: 28 April 2026.<br>The version currently published on this page is the version in force at any given time. This English version is a translation of the Norwegian original; in case of any discrepancy, the Norwegian version prevails as the contract is governed by Norwegian law.'
    },
    'salg-footer-home': { no: 'Forsiden', en: 'Home' },
    'salg-footer-privacy': { no: 'Personvern', en: 'Privacy' },
    'salg-footer-contact': { no: 'Kontakt', en: 'Contact' },

    // === PERSONVERNERKLÆRING (PRIVACY POLICY) PAGE ===
    // l1ft0ff — Mission Liftoff. v03 ship-ready, GDPR + personopplysningsloven compliant.

    'pv-title': {
      no: 'Personvernerklæring — NextElite Boxing',
      en: 'Privacy Policy — NextElite Boxing'
    },
    'pv-back': { no: '← Tilbake', en: '← Back' },
    'pv-h1': { no: 'Personvernerklæring', en: 'Privacy Policy' },
    'pv-subtitle': {
      no: 'NextElite Boxing — Myre, Vesterålen',
      en: 'NextElite Boxing — Myre, Vesterålen'
    },

    // Meta block
    'pv-meta-controller-label': { no: 'Behandlingsansvarlig:', en: 'Data controller:' },
    'pv-meta-controller-value': { no: 'Neminee Steffensen ENK', en: 'Neminee Steffensen ENK' },
    'pv-meta-orgno-label': { no: 'Org.nr:', en: 'Org. no:' },
    'pv-meta-orgno-value': { no: '926 490 486', en: '926 490 486' },
    'pv-meta-brand-label': { no: 'Foretaksnavn / merkevare:', en: 'Business name / brand:' },
    'pv-meta-brand-value': { no: 'NextElite Boxing', en: 'NextElite Boxing' },
    'pv-meta-address-label': { no: 'Adresse:', en: 'Address:' },
    'pv-meta-address-value': {
      no: 'Fjellveien 22A, 8430 Myre, Norge',
      en: 'Fjellveien 22A, 8430 Myre, Norway'
    },
    'pv-meta-email-label': { no: 'Kontakt:', en: 'Contact:' },
    'pv-meta-updated-label': { no: 'Sist oppdatert:', en: 'Last updated:' },
    'pv-meta-updated-value': { no: '29. april 2026', en: '29 April 2026' },
    'pv-meta-version-label': { no: 'Versjon:', en: 'Version:' },
    'pv-meta-version-value': { no: 'v03', en: 'v03' },
    'pv-meta-archive': {
      no: 'Tidligere versjoner: <a href="/personvern/historikk/">arkiv</a>',
      en: 'Previous versions: <a href="/personvern/historikk/">archive</a>'
    },

    // Lead
    'pv-lead': {
      no: 'Denne personvernerklæringen forklarer hvilke personopplysninger NextElite Boxing samler inn om deg, hvorfor vi gjør det, og hvilke rettigheter du har. Vi følger personopplysningsloven og personvernforordningen (GDPR). Hvis noe er uklart, send en e-post til nemine@nextelite.no — vi svarer.',
      en: 'This privacy policy explains which personal data NextElite Boxing collects about you, why we do it, and what rights you have. We comply with the Norwegian Personal Data Act (Personopplysningsloven) and the General Data Protection Regulation (GDPR). If anything is unclear, email nemine@nextelite.no — we will respond.'
    },

    // Section 1 — Behandlingsansvarlig / Data controller
    'pv-section-1-title': { no: 'Behandlingsansvarlig', en: 'Data controller' },
    'pv-section-1-p1': {
      no: 'Behandlingsansvarlig for personopplysningene dine er <strong>Neminee Steffensen ENK</strong> (org.nr. 926 490 486), heretter omtalt som "NextElite Boxing", "vi" eller "oss". Det betyr at vi bestemmer hvorfor og hvordan opplysningene dine behandles, og at vi er ansvarlige for at det skjer i tråd med loven.',
      en: 'The data controller for your personal data is <strong>Neminee Steffensen ENK</strong> (org. no. 926 490 486), hereinafter referred to as "NextElite Boxing", "we" or "us". This means we decide why and how your data is processed, and we are responsible for ensuring this is done in accordance with the law.'
    },
    'pv-section-1-p2': {
      no: 'Spørsmål om personvern rettes til:',
      en: 'Privacy questions should be directed to:'
    },
    'pv-section-1-li1': {
      no: 'E-post: <strong>nemine@nextelite.no</strong>',
      en: 'Email: <strong>nemine@nextelite.no</strong>'
    },
    'pv-section-1-li2': {
      no: 'Adresse: <strong>Fjellveien 22A, 8430 Myre, Norge</strong>',
      en: 'Address: <strong>Fjellveien 22A, 8430 Myre, Norway</strong>'
    },

    // Section 2 — Hvilke personopplysninger / Which personal data
    'pv-section-2-title': {
      no: 'Hvilke personopplysninger vi behandler',
      en: 'Which personal data we process'
    },
    'pv-section-2-p1': {
      no: 'Vi behandler kun de opplysningene vi trenger for å levere tjenesten og oppfylle våre lovpålagte plikter.',
      en: 'We only process the data we need to deliver the service and fulfil our legal obligations.'
    },
    'pv-section-2-h3-purchase': {
      no: 'Når du kjøper drop-in eller medlemskap',
      en: 'When you buy a drop-in or membership'
    },
    'pv-section-2-purchase-li1': { no: 'Navn', en: 'Name' },
    'pv-section-2-purchase-li2': { no: 'E-postadresse', en: 'Email address' },
    'pv-section-2-purchase-li3': { no: 'Telefonnummer', en: 'Phone number' },
    'pv-section-2-purchase-li4': {
      no: 'Betalingsinformasjon — håndteres av Vipps. <strong>Vi lagrer ikke kortdata eller kontonummer.</strong> Vi mottar kun bekreftelse på at betalingen er gjennomført, samt et avtale-ID for medlemskap.',
      en: 'Payment information — handled by Vipps. <strong>We do not store card data or account numbers.</strong> We only receive confirmation that the payment has been completed, along with an agreement ID for the membership.'
    },
    'pv-section-2-h3-health': {
      no: 'Når du melder deg inn (helse-skjema)',
      en: 'When you sign up (health form)'
    },
    'pv-section-2-health-p1': {
      no: 'Ved innmelding fyller du ut et frivillig digitalt skjema (via Tally) hvor du kan dele:',
      en: 'When signing up, you fill out a voluntary digital form (via Tally) where you can share:'
    },
    'pv-section-2-health-li1': {
      no: 'Skader, sykdom eller andre helseforhold som er relevante for trygg trening.',
      en: 'Injuries, illness or other health conditions relevant to safe training.'
    },
    'pv-section-2-health-li2': {
      no: 'Kontaktperson i nødssituasjoner.',
      en: 'Emergency contact person.'
    },
    'pv-section-2-health-p2': {
      no: 'Det er <strong>ditt valg</strong> hva du vil dele. Du kan stå over hele skjemaet og fortsatt trene. Hvis du fyller ut skjemaet, behandler vi opplysningene som <strong>særlig kategori-data (helseopplysninger)</strong> etter GDPR artikkel 9 — se punkt 7c for full beskrivelse.',
      en: 'It is <strong>your choice</strong> what you share. You can skip the entire form and still train. If you fill out the form, we treat the data as <strong>special category data (health data)</strong> under GDPR article 9 — see section 7c for the full description.'
    },
    'pv-section-2-h3-attendance': {
      no: 'Når du møter til trening',
      en: 'When you attend training'
    },
    'pv-section-2-attendance-li1': {
      no: 'Oppmøtedata (hvilke økter du har deltatt på).',
      en: 'Attendance data (which sessions you have participated in).'
    },
    'pv-section-2-attendance-li2': {
      no: 'Vi har ingen booking-system. Faste treningstider gjelder, du møter opp.',
      en: 'We have no booking system. Fixed training times apply, you simply show up.'
    },
    'pv-section-2-h3-contact': {
      no: 'Når du tar kontakt med oss',
      en: 'When you contact us'
    },
    'pv-section-2-contact-p': {
      no: 'Innholdet i e-post, SMS, eller Signal-meldinger du sender oss, samt kontaktinformasjonen din.',
      en: 'The content of emails, SMS or Signal messages you send us, along with your contact information.'
    },
    'pv-section-2-h3-website': { no: 'Når du besøker nettsiden', en: 'When you visit the website' },
    'pv-section-2-website-p': {
      no: 'Anonyme, aggregerte besøksdata (sidevisninger, nettleser-type, omtrentlig geografisk region på landsnivå). Disse dataene knyttes <strong>ikke</strong> til deg som person og kan ikke brukes til å identifisere deg. Se punkt 7a for detaljer om analyseverktøyet.',
      en: 'Anonymous, aggregated visit data (page views, browser type, approximate geographic region at country level). This data is <strong>not</strong> linked to you as a person and cannot be used to identify you. See section 7a for details about the analytics tool.'
    },

    // Section 3 — Rettslig grunnlag / Legal basis
    'pv-section-3-title': { no: 'Rettslig grunnlag', en: 'Legal basis' },
    'pv-section-3-p1': {
      no: 'Vi behandler personopplysningene dine på følgende grunnlag etter GDPR artikkel 6 og 9:',
      en: 'We process your personal data on the following grounds under GDPR articles 6 and 9:'
    },
    'pv-section-3-th-purpose': { no: 'Formål', en: 'Purpose' },
    'pv-section-3-th-basis': { no: 'Rettslig grunnlag', en: 'Legal basis' },
    'pv-section-3-row1-purpose': {
      no: 'Levere medlemskap og drop-in du har kjøpt',
      en: 'Deliver the membership and drop-in you have purchased'
    },
    'pv-section-3-row1-basis': {
      no: 'Art. 6 (1) (b) — oppfyllelse av avtale',
      en: 'Art. 6 (1) (b) — performance of a contract'
    },
    'pv-section-3-row2-purpose': { no: 'Bokføring og regnskap', en: 'Bookkeeping and accounting' },
    'pv-section-3-row2-basis': {
      no: 'Art. 6 (1) (c) — rettslig forpliktelse (bokføringsloven)',
      en: 'Art. 6 (1) (c) — legal obligation (Norwegian Bookkeeping Act)'
    },
    'pv-section-3-row3-purpose': {
      no: 'Oppmøteregistrering og sikkerhet i lokalet',
      en: 'Attendance registration and on-site safety'
    },
    'pv-section-3-row3-basis': {
      no: 'Art. 6 (1) (f) — berettiget interesse',
      en: 'Art. 6 (1) (f) — legitimate interest'
    },
    'pv-section-3-row4-purpose': {
      no: 'Anonyme besøksanalytikk for å forbedre nettsiden',
      en: 'Anonymous visit analytics to improve the website'
    },
    'pv-section-3-row4-basis': {
      no: 'Art. 6 (1) (f) — berettiget interesse',
      en: 'Art. 6 (1) (f) — legitimate interest'
    },
    'pv-section-3-row5-purpose': {
      no: 'Helseopplysninger du selv deler i innmeldingsskjema',
      en: 'Health data you share in the sign-up form'
    },
    'pv-section-3-row5-basis': {
      no: 'Art. 9 (2) (a) — uttrykkelig samtykke',
      en: 'Art. 9 (2) (a) — explicit consent'
    },
    'pv-section-3-row6-purpose': {
      no: 'Helseopplysninger du muntlig deler om skader på trening',
      en: 'Health data you verbally share about injuries during training'
    },
    'pv-section-3-row6-basis': {
      no: 'Art. 9 (2) (a) — uttrykkelig samtykke',
      en: 'Art. 9 (2) (a) — explicit consent'
    },
    'pv-section-3-p2': {
      no: 'Den berettigede interessen for trening og lokalsikkerhet er at vi må vite hvem som er på trening for å kunne drive forsvarlig (kapasitet, sikkerhet, forsikring). Den berettigede interessen for besøksanalytikk er at vi trenger å forstå hvordan siden brukes for å forbedre den; behandlingen er anonym, cookieløs og ikke-inngripende. Vi har vurdert at ingen av disse går ut over dine rettigheter på en uforholdsmessig måte.',
      en: 'The legitimate interest for training and on-site safety is that we must know who is present in order to operate responsibly (capacity, safety, insurance). The legitimate interest for visit analytics is that we need to understand how the site is used in order to improve it; the processing is anonymous, cookieless and non-intrusive. We have assessed that none of these override your rights disproportionately.'
    },
    'pv-section-3-p3': {
      no: 'For helseopplysninger gjelder strengere regler — se punkt 7c.',
      en: 'Stricter rules apply to health data — see section 7c.'
    },

    // Section 4 — Databehandlere og deling / Processors and sharing
    'pv-section-4-title': { no: 'Databehandlere og deling', en: 'Data processors and sharing' },
    'pv-section-4-p1': {
      no: 'Vi deler personopplysninger kun med leverandører som behandler data på våre vegne (databehandlere), eller når vi er lovpålagt å gjøre det.',
      en: 'We share personal data only with providers that process data on our behalf (data processors), or when we are legally required to do so.'
    },
    'pv-section-4-h3-processors': { no: 'Databehandlere vi bruker', en: 'Data processors we use' },
    'pv-section-4-th-vendor': { no: 'Leverandør', en: 'Provider' },
    'pv-section-4-th-what': { no: 'Hva de gjør', en: 'What they do' },
    'pv-section-4-th-where': { no: 'Hvor data lagres', en: 'Where data is stored' },
    'pv-section-4-th-status': { no: 'Status', en: 'Status' },
    'pv-section-4-row1-vendor': {
      no: '<strong>Vipps Mobilepay AS</strong>',
      en: '<strong>Vipps Mobilepay AS</strong>'
    },
    'pv-section-4-row1-what': {
      no: 'Betalingsbehandling og faste betalinger (Vipps Recurring)',
      en: 'Payment processing and recurring payments (Vipps Recurring)'
    },
    'pv-section-4-row1-where': { no: 'EØS', en: 'EEA' },
    'pv-section-4-row1-status': { no: 'Aktiv', en: 'Active' },
    'pv-section-4-row2-vendor': {
      no: '<strong>GitHub Inc. (GitHub Pages)</strong>',
      en: '<strong>GitHub Inc. (GitHub Pages)</strong>'
    },
    'pv-section-4-row2-what': {
      no: 'Hosting av nextelite.no',
      en: 'Hosting of nextelite.no'
    },
    'pv-section-4-row2-where': {
      no: 'EØS / USA (under EU Standard Contractual Clauses)',
      en: 'EEA / USA (under EU Standard Contractual Clauses)'
    },
    'pv-section-4-row2-status': { no: 'Aktiv', en: 'Active' },
    'pv-section-4-row3-vendor': {
      no: '<strong>Umami Software Inc. (Umami Cloud)</strong>',
      en: '<strong>Umami Software Inc. (Umami Cloud)</strong>'
    },
    'pv-section-4-row3-what': {
      no: 'Anonym, cookieløs besøksanalytikk',
      en: 'Anonymous, cookieless visit analytics'
    },
    'pv-section-4-row3-where': {
      no: 'EU — AWS Frankfurt, Tyskland',
      en: 'EU — AWS Frankfurt, Germany'
    },
    'pv-section-4-row3-status': { no: 'Aktiv', en: 'Active' },
    'pv-section-4-row4-vendor': { no: '<strong>Tally</strong>', en: '<strong>Tally</strong>' },
    'pv-section-4-row4-what': {
      no: 'Digitalt innmeldingsskjema (helseopplysninger)',
      en: 'Digital sign-up form (health data)'
    },
    'pv-section-4-row4-where': {
      no: 'EU — GDPR-vennlig databehandler',
      en: 'EU — GDPR-friendly data processor'
    },
    'pv-section-4-row4-status': { no: 'Aktiv', en: 'Active' },
    'pv-section-4-p2': {
      no: 'Vi har — eller vil ha — databehandleravtaler (DPA) med alle leverandører som behandler personopplysninger på våre vegne, før de tas i bruk.',
      en: 'We have — or will have — data processing agreements (DPAs) with all providers that process personal data on our behalf, before they are taken into use.'
    },
    'pv-section-4-h3-sms': {
      no: 'Kommunikasjon via SMS og Signal',
      en: 'Communication via SMS and Signal'
    },
    'pv-section-4-sms-p1': {
      no: 'Ved kortsiktig avlysning eller praktiske beskjeder kan vi sende SMS eller Signal-meldinger til medlemmer. Vi bruker da:',
      en: 'For short-notice cancellations or practical messages, we may send SMS or Signal messages to members. In that case we use:'
    },
    'pv-section-4-sms-li1': {
      no: '<strong>Telenor / din mobiloperatør</strong> (SMS) — meldingen går gjennom standard mobilnett. Vi har ingen avtale med operatøren utover at vi er kunder hos dem.',
      en: '<strong>Telenor / your mobile operator</strong> (SMS) — the message goes through the standard mobile network. We have no agreement with the operator beyond being their customer.'
    },
    'pv-section-4-sms-li2': {
      no: '<strong>Signal</strong> (Foundation, USA) — ende-til-ende-kryptert. Signal-serveren ser kun teknisk metadata, ikke meldingsinnholdet.',
      en: '<strong>Signal</strong> (Foundation, USA) — end-to-end encrypted. The Signal server only sees technical metadata, not the message content.'
    },
    'pv-section-4-sms-p2': {
      no: 'Telefonnummeret ditt lagres lokalt i CEOs telefon (kontaktliste) og i medlemsregisteret vårt — det deles ikke med tredjeparter for kommunikasjon utover dette.',
      en: 'Your phone number is stored locally on the CEO\'s phone (contact list) and in our member registry — it is not shared with third parties for communication beyond this.'
    },
    'pv-section-4-h3-legal': {
      no: 'Når vi er lovpålagt å dele',
      en: 'When we are legally required to share'
    },
    'pv-section-4-legal-p': {
      no: 'Vi kan utlevere opplysninger til offentlige myndigheter (f.eks. Skatteetaten, politiet) når vi er pålagt det ved lov.',
      en: 'We may disclose information to public authorities (e.g. the Norwegian Tax Administration, the police) when required by law.'
    },
    'pv-section-4-p-final': {
      no: 'Vi <strong>selger ikke</strong> personopplysningene dine. Vi deler dem ikke med markedsføringspartnere.',
      en: 'We <strong>do not sell</strong> your personal data. We do not share it with marketing partners.'
    },

    // Section 5 — Oppbevaringstid / Retention period
    'pv-section-5-title': { no: 'Oppbevaringstid', en: 'Retention period' },
    'pv-section-5-p1': {
      no: 'Vi oppbevarer personopplysninger kun så lenge det er nødvendig for formålet:',
      en: 'We retain personal data only as long as necessary for the purpose:'
    },
    'pv-section-5-th-type': { no: 'Type opplysning', en: 'Type of data' },
    'pv-section-5-th-time': { no: 'Oppbevaringstid', en: 'Retention period' },
    'pv-section-5-row1-type': {
      no: 'Bilag og regnskapsdata (faktura, kvittering, navn knyttet til transaksjon)',
      en: 'Vouchers and accounting data (invoice, receipt, name linked to transaction)'
    },
    'pv-section-5-row1-time': {
      no: '<strong>5 år</strong> etter regnskapsårets slutt — bokføringsloven § 13',
      en: '<strong>5 years</strong> after the end of the accounting year — Norwegian Bookkeeping Act § 13'
    },
    'pv-section-5-row2-type': {
      no: 'Aktivt medlemskap: kontakt- og oppmøtedata',
      en: 'Active membership: contact and attendance data'
    },
    'pv-section-5-row2-time': {
      no: 'Så lenge medlemskapet er aktivt',
      en: 'As long as the membership is active'
    },
    'pv-section-5-row3-type': {
      no: 'Avsluttet medlemskap: kontaktdata',
      en: 'Ended membership: contact data'
    },
    'pv-section-5-row3-time': {
      no: 'Slettes innen 12 måneder etter siste trekk, med mindre bokføringsloven krever lengre lagring',
      en: 'Deleted within 12 months of the final charge, unless the Bookkeeping Act requires longer retention'
    },
    'pv-section-5-row4-type': {
      no: 'Helse-skjema-data (Tally)',
      en: 'Health form data (Tally)'
    },
    'pv-section-5-row4-time': {
      no: '<strong>12 måneder</strong>, eller frem til utmelding — det som inntreffer først',
      en: '<strong>12 months</strong>, or until you cancel membership — whichever comes first'
    },
    'pv-section-5-row5-type': {
      no: 'Helseopplysninger du muntlig deler om skader',
      en: 'Health data you verbally share about injuries'
    },
    'pv-section-5-row5-time': {
      no: 'Slettes så snart de ikke lenger er nødvendige, eller når du trekker samtykket',
      en: 'Deleted as soon as no longer necessary, or when you withdraw consent'
    },
    'pv-section-5-row6-type': {
      no: 'E-postkorrespondanse fra medlemmer',
      en: 'Email correspondence from members'
    },
    'pv-section-5-row6-time': {
      no: 'Slettes når saken er ferdigbehandlet, senest <strong>12 måneder</strong> etter siste utveksling',
      en: 'Deleted when the matter is resolved, no later than <strong>12 months</strong> after last exchange'
    },
    'pv-section-5-row7-type': {
      no: 'E-postkorrespondanse fra ikke-medlemmer (forespørsler)',
      en: 'Email correspondence from non-members (inquiries)'
    },
    'pv-section-5-row7-time': {
      no: 'Slettes senest <strong>6 måneder</strong> etter siste utveksling',
      en: 'Deleted no later than <strong>6 months</strong> after last exchange'
    },
    'pv-section-5-row8-type': {
      no: 'SMS/Signal-meldinger om praktiske beskjeder',
      en: 'SMS/Signal messages with practical notices'
    },
    'pv-section-5-row8-time': {
      no: 'Slettes når beskjeden er irrelevant (typisk innen 30 dager)',
      en: 'Deleted when the message is no longer relevant (typically within 30 days)'
    },
    'pv-section-5-row9-type': {
      no: 'Anonyme besøksdata (Umami)',
      en: 'Anonymous visit data (Umami)'
    },
    'pv-section-5-row9-time': {
      no: 'Aggregert og anonymisert ved innsamling — ingen personlig kobling. Rådata slettes etter 12 måneder.',
      en: 'Aggregated and anonymised at collection — no personal link. Raw data is deleted after 12 months.'
    },
    'pv-section-5-p2': {
      no: 'Når oppbevaringstiden er ute, slettes eller anonymiseres dataene.',
      en: 'When the retention period expires, the data is deleted or anonymised.'
    },

    // Section 6 — Dine rettigheter / Your rights
    'pv-section-6-title': { no: 'Dine rettigheter', en: 'Your rights' },
    'pv-section-6-p1': {
      no: 'Du har følgende rettigheter etter personopplysningsloven og GDPR:',
      en: 'You have the following rights under the Norwegian Personal Data Act (Personopplysningsloven) and the GDPR:'
    },
    'pv-section-6-li1': {
      no: '<strong>Innsyn</strong> — du kan be om en kopi av opplysningene vi har om deg.',
      en: '<strong>Access</strong> — you may request a copy of the data we hold about you.'
    },
    'pv-section-6-li2': {
      no: '<strong>Retting</strong> — du kan kreve at feil opplysninger rettes.',
      en: '<strong>Rectification</strong> — you may request correction of inaccurate data.'
    },
    'pv-section-6-li3': {
      no: '<strong>Sletting</strong> — du kan kreve at opplysninger slettes når de ikke lenger er nødvendige, eller når du trekker tilbake samtykket. Merk at vi må beholde bilag i 5 år etter bokføringsloven.',
      en: '<strong>Erasure</strong> — you may request deletion when data is no longer necessary, or when you withdraw consent. Note that we must retain accounting vouchers for 5 years under the Bookkeeping Act.'
    },
    'pv-section-6-li4': {
      no: '<strong>Begrensning</strong> — du kan kreve at behandlingen begrenses i visse tilfeller.',
      en: '<strong>Restriction</strong> — you may request that processing be restricted in certain cases.'
    },
    'pv-section-6-li5': {
      no: '<strong>Dataportabilitet</strong> — du kan få utlevert opplysningene du har gitt oss i et maskinlesbart format, eller få dem overført til en annen behandlingsansvarlig.',
      en: '<strong>Data portability</strong> — you may receive the data you have provided in a machine-readable format, or have it transferred to another data controller.'
    },
    'pv-section-6-li6': {
      no: '<strong>Innsigelse</strong> — du kan protestere mot behandling som er basert på berettiget interesse, inkludert besøksanalytikk.',
      en: '<strong>Objection</strong> — you may object to processing based on legitimate interest, including visit analytics.'
    },
    'pv-section-6-li7': {
      no: '<strong>Trekke samtykke</strong> — der behandlingen er basert på samtykke (inkludert helseopplysninger), kan du når som helst trekke det tilbake. Det påvirker ikke lovligheten av behandlingen før samtykket ble trukket.',
      en: '<strong>Withdraw consent</strong> — where processing is based on consent (including health data), you may withdraw it at any time. This does not affect the lawfulness of processing before withdrawal.'
    },
    'pv-section-6-p2': {
      no: 'For å bruke rettighetene dine, send en e-post til <strong>nemine@nextelite.no</strong>. Vi svarer innen 30 dager.',
      en: 'To exercise your rights, email <strong>nemine@nextelite.no</strong>. We respond within 30 days.'
    },
    'pv-section-6-h3-complaint': {
      no: 'Klage til Datatilsynet',
      en: 'Complaint to the Norwegian Data Protection Authority'
    },
    'pv-section-6-complaint-p': {
      no: 'Hvis du mener vi behandler personopplysningene dine i strid med loven, kan du klage til Datatilsynet:',
      en: 'If you believe we process your data in violation of the law, you may lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet):'
    },
    'pv-section-6-complaint-li1': {
      no: 'Nettside: <a href="https://www.datatilsynet.no" target="_blank" rel="noopener"><strong>datatilsynet.no</strong></a>',
      en: 'Website: <a href="https://www.datatilsynet.no" target="_blank" rel="noopener"><strong>datatilsynet.no</strong></a>'
    },
    'pv-section-6-complaint-li2': { no: 'Telefon: 22 39 69 00', en: 'Phone: +47 22 39 69 00' },
    'pv-section-6-complaint-li3': {
      no: 'Adresse: Postboks 458 Sentrum, 0105 Oslo',
      en: 'Address: Postboks 458 Sentrum, 0105 Oslo, Norway'
    },
    'pv-section-6-p3': {
      no: 'Vi setter pris på om du tar kontakt med oss først, slik at vi får mulighet til å rette opp i saken.',
      en: 'We appreciate it if you contact us first, so we have a chance to resolve the matter.'
    },

    // Section 7 — Cookies og lokal lagring / Cookies and local storage
    'pv-section-7-title': { no: 'Cookies og lokal lagring', en: 'Cookies and local storage' },
    'pv-section-7-p1': {
      no: 'NextElite Boxing-siden bruker <strong>kun teknisk nødvendige cookies / lokal lagring</strong>. Konkret lagrer vi:',
      en: 'The NextElite Boxing site uses <strong>only strictly necessary cookies / local storage</strong>. Specifically, we store:'
    },
    'pv-section-7-li1': {
      no: '<strong>Språkvalg (norsk / engelsk)</strong> — slik at siden husker preferansen din mellom besøk. Lagres lokalt i nettleseren din (<code>localStorage</code>). Ingen cookie sendes til vår server.',
      en: '<strong>Language preference (Norwegian / English)</strong> — so the site remembers your preference between visits. Stored locally in your browser (<code>localStorage</code>). No cookie is sent to our server.'
    },
    'pv-section-7-p2': {
      no: 'Du kan slette språkpreferansen ved å tømme nettleserdata for nextelite.no. Siden vil fortsatt fungere — den vil bare bruke standardspråk neste gang.',
      en: 'You can delete the language preference by clearing browser data for nextelite.no. The site will still work — it will simply use the default language next time.'
    },
    'pv-section-7-p3': {
      no: 'Vipps og GitHub Pages kan sette tekniske cookies under sine egne tjenester når du bruker dem. Vi anbefaler å lese deres personvernerklæringer for detaljer:',
      en: 'Vipps and GitHub Pages may set technical cookies under their own services when you use them. We recommend reading their privacy policies for details:'
    },
    'pv-section-7-li2': {
      no: 'Vipps: <a href="https://vipps.no/personvern" target="_blank" rel="noopener">vipps.no/personvern</a>',
      en: 'Vipps: <a href="https://vipps.no/personvern" target="_blank" rel="noopener">vipps.no/personvern</a>'
    },
    'pv-section-7-li3': {
      no: 'GitHub: <a href="https://docs.github.com/privacy" target="_blank" rel="noopener">docs.github.com/privacy</a>',
      en: 'GitHub: <a href="https://docs.github.com/privacy" target="_blank" rel="noopener">docs.github.com/privacy</a>'
    },

    // Section 7a — Analyseverktøy (Umami)
    'pv-section-7a-title': { no: 'Analyseverktøy (Umami)', en: 'Analytics tool (Umami)' },
    'pv-section-7a-p1': {
      no: 'For å forstå hvordan nettsiden brukes — hvilke sider som leses, hvor mange som kommer hit, hvilke enheter folk bruker — benytter vi et <strong>personvernvennlig analyseverktøy som heter Umami</strong> (Umami Cloud, EU-region).',
      en: 'To understand how the website is used — which pages are read, how many visit, what devices people use — we use a <strong>privacy-friendly analytics tool called Umami</strong> (Umami Cloud, EU region).'
    },
    'pv-section-7a-h3-not': { no: 'Hva Umami gjør IKKE:', en: 'What Umami does NOT do:' },
    'pv-section-7a-not-li1': { no: 'Setter ingen cookies.', en: 'Sets no cookies.' },
    'pv-section-7a-not-li2': {
      no: 'Lagrer ikke IP-adressen din i klartekst — IP-en hashes umiddelbart og forkastes.',
      en: 'Does not store your IP address in plaintext — the IP is hashed immediately and discarded.'
    },
    'pv-section-7a-not-li3': {
      no: 'Bygger ingen personlig profil av deg.',
      en: 'Builds no personal profile of you.'
    },
    'pv-section-7a-not-li4': {
      no: 'Følger deg ikke på tvers av andre nettsteder.',
      en: 'Does not follow you across other websites.'
    },
    'pv-section-7a-not-li5': {
      no: 'Selger ingen data til tredjeparter.',
      en: 'Sells no data to third parties.'
    },
    'pv-section-7a-h3-does': { no: 'Hva Umami gjør:', en: 'What Umami does:' },
    'pv-section-7a-does-li1': {
      no: 'Teller anonyme sidevisninger.',
      en: 'Counts anonymous page views.'
    },
    'pv-section-7a-does-li2': {
      no: 'Registrerer hvilken nettleser-type og operativsystem (anonymt) som brukes.',
      en: 'Records which browser type and operating system (anonymously) is used.'
    },
    'pv-section-7a-does-li3': {
      no: 'Estimerer omtrentlig geografisk region (f.eks. "Norge" eller "Nordland") basert på den hashede IP-en, før IP-en forkastes.',
      en: 'Estimates approximate geographic region (e.g. "Norway" or "Nordland") based on the hashed IP, before the IP is discarded.'
    },
    'pv-section-7a-p2': {
      no: '<strong>Rettslig grunnlag:</strong> Berettiget interesse, GDPR art. 6 (1) (f). Fordi behandlingen er anonym og cookieløs, faller den utenfor samtykkekravet i ekomloven § 2-7b (cookie-paragrafen).',
      en: '<strong>Legal basis:</strong> Legitimate interest, GDPR art. 6 (1) (f). Because the processing is anonymous and cookieless, it falls outside the consent requirement in the Norwegian Electronic Communications Act (ekomloven) § 2-7b (the cookie paragraph).'
    },
    'pv-section-7a-p3': {
      no: '<strong>Hvor data lagres:</strong> AWS Frankfurt, Tyskland (EU). Databehandleravtale (DPA) er signert med Umami Software Inc.',
      en: '<strong>Where data is stored:</strong> AWS Frankfurt, Germany (EU). A data processing agreement (DPA) is signed with Umami Software Inc.'
    },
    'pv-section-7a-p4': {
      no: '<strong>Hvordan du sier nei:</strong> Selv om behandlingen er anonym og du har rett til å protestere etter punkt 6 (Innsigelse), kan du blokkere all besøksanalytikk ved å aktivere "Do Not Track" i nettleseren eller bruke en innholdsblokker. Vi respekterer DNT-signalet.',
      en: '<strong>How to opt out:</strong> Even though processing is anonymous and you have the right to object under section 6 (Objection), you may block all visit analytics by enabling "Do Not Track" in your browser or using a content blocker. We respect the DNT signal.'
    },

    // Section 7b — Hva vi IKKE bruker / What we do NOT use
    'pv-section-7b-title': { no: 'Hva vi IKKE bruker', en: 'What we do NOT use' },
    'pv-section-7b-p': { no: 'Vi bruker <strong>ikke</strong>:', en: 'We do <strong>not</strong> use:' },
    'pv-section-7b-li1': { no: 'Google Analytics', en: 'Google Analytics' },
    'pv-section-7b-li2': { no: 'Meta Pixel (Facebook Pixel)', en: 'Meta Pixel (Facebook Pixel)' },
    'pv-section-7b-li3': { no: 'TikTok Pixel', en: 'TikTok Pixel' },
    'pv-section-7b-li4': { no: 'LinkedIn Insight Tag', en: 'LinkedIn Insight Tag' },
    'pv-section-7b-li5': { no: 'Markedsførings-cookies', en: 'Marketing cookies' },
    'pv-section-7b-li6': { no: 'Tredjeparts profileringsverktøy', en: 'Third-party profiling tools' },
    'pv-section-7b-li7': { no: 'Retargeting-piksler', en: 'Retargeting pixels' },
    'pv-section-7b-li8': {
      no: 'A/B-test-verktøy som lagrer personlige identifikatorer',
      en: 'A/B testing tools that store personal identifiers'
    },
    'pv-section-7b-li9': {
      no: 'Booking-systemer som lagrer treningsdata hos tredjepart (vi har ingen Spond, ingen MyClub, ingen Pacta)',
      en: 'Booking systems that store training data with third parties (we have no Spond, no MyClub, no Pacta)'
    },
    'pv-section-7b-p2': {
      no: 'Hvis vi i fremtiden ønsker å ta i bruk noen av disse, vil personvernerklæringen oppdateres og varsel sendes (se punkt 9).',
      en: 'If we wish to adopt any of these in future, the privacy policy will be updated and notice given (see section 9).'
    },

    // Section 7c — Særlig kategori — helseopplysninger / Special category — health data
    'pv-section-7c-title': {
      no: 'Særlig kategori — helseopplysninger',
      en: 'Special category — health data'
    },
    'pv-section-7c-p1': {
      no: 'Helseopplysninger er en <strong>særlig kategori</strong> av personopplysninger etter GDPR artikkel 9. Det betyr strengere regler. Vi behandler helseopplysningene dine kun hvis du gir <strong>uttrykkelig samtykke</strong> (art. 9 (2) (a)).',
      en: 'Health data is a <strong>special category</strong> of personal data under GDPR article 9. This means stricter rules. We only process your health data if you give <strong>explicit consent</strong> (art. 9 (2) (a)).'
    },
    'pv-section-7c-h3-when': {
      no: 'Når deler du helseopplysninger med oss:',
      en: 'When you share health data with us:'
    },
    'pv-section-7c-when-li1': {
      no: '<strong>Frivillig digitalt innmeldingsskjema (Tally)</strong> — ved innmelding kan du fylle ut et skjema med skader, kronisk sykdom, allergier, eller kontaktperson i nødssituasjoner. Skjemaet er valgfritt. Du kan trene uten å fylle det ut.',
      en: '<strong>Voluntary digital sign-up form (Tally)</strong> — when signing up you may fill out a form with injuries, chronic illness, allergies, or emergency contact. The form is optional. You can train without filling it out.'
    },
    'pv-section-7c-when-li2': {
      no: '<strong>Muntlig på trening</strong> — du kan informere coachen om en skade eller en dårlig dag før økten starter.',
      en: '<strong>Verbally at training</strong> — you may tell the coach about an injury or a bad day before the session starts.'
    },
    'pv-section-7c-h3-how': {
      no: 'Hvordan vi behandler dataene:',
      en: 'How we process the data:'
    },
    'pv-section-7c-how-li1': {
      no: '<strong>Kun CEO</strong> (Neminee Steffensen) leser helseopplysninger. Coachene får kun beskjed om hva som er relevant for å tilpasse din økt — ikke detaljer.',
      en: '<strong>Only the CEO</strong> (Neminee Steffensen) reads health data. Coaches are only told what is relevant to adapt your session — not details.'
    },
    'pv-section-7c-how-li2': {
      no: '<strong>Lagring:</strong> Tally-skjema-svar lagres i Tallys EU-baserte database. Vi henter ut nødvendige opplysninger og noterer dem i medlemsregisteret vårt. <strong>Datene krypteres i transit (HTTPS) og hos databehandleren.</strong>',
      en: '<strong>Storage:</strong> Tally form responses are stored in Tally\'s EU-based database. We extract necessary information and note it in our member registry. <strong>Data is encrypted in transit (HTTPS) and at the data processor.</strong>'
    },
    'pv-section-7c-how-li3': {
      no: '<strong>Lagringstid:</strong> 12 måneder, eller frem til du melder deg ut — det som inntreffer først. Du kan be om sletting når som helst.',
      en: '<strong>Retention:</strong> 12 months, or until you cancel membership — whichever comes first. You may request deletion at any time.'
    },
    'pv-section-7c-how-li4': {
      no: '<strong>Deling:</strong> vi deler aldri helseopplysninger med tredjeparter, med mindre du selv samtykker (f.eks. ved akutt nødssituasjon der ambulanse må kontaktes).',
      en: '<strong>Sharing:</strong> we never share health data with third parties, unless you consent (e.g. in an acute emergency where an ambulance must be called).'
    },
    'pv-section-7c-p2': {
      no: '<strong>Du kan trekke samtykket når som helst</strong> ved å sende e-post til nemine@nextelite.no. Da slettes helseopplysningene umiddelbart fra våre systemer (med unntak av lovpålagt bilag-data, som ikke inneholder helsedata).',
      en: '<strong>You may withdraw consent at any time</strong> by emailing nemine@nextelite.no. The health data is then immediately deleted from our systems (except for legally required accounting data, which contains no health data).'
    },

    // Section 8 — Sikkerhet / Security
    'pv-section-8-title': { no: 'Sikkerhet', en: 'Security' },
    'pv-section-8-p1': {
      no: 'Vi tar rimelige tekniske og organisatoriske forholdsregler for å beskytte opplysningene dine mot uautorisert tilgang, endring eller sletting. Konkret:',
      en: 'We take reasonable technical and organisational measures to protect your data from unauthorised access, alteration or deletion. Specifically:'
    },
    'pv-section-8-li1': {
      no: 'All trafikk til nettsiden går over <strong>HTTPS</strong> (kryptert).',
      en: 'All site traffic uses <strong>HTTPS</strong> (encrypted).'
    },
    'pv-section-8-li2': {
      no: 'Betalingsdata håndteres av Vipps og berører aldri våre systemer.',
      en: 'Payment data is handled by Vipps and never touches our systems.'
    },
    'pv-section-8-li3': {
      no: 'Helseopplysninger krypteres i transit (HTTPS) og hos databehandleren (Tally).',
      en: 'Health data is encrypted in transit (HTTPS) and at the data processor (Tally).'
    },
    'pv-section-8-li4': {
      no: 'Tilgang til kunderegister er begrenset til personer som trenger det for å levere tjenesten. Kun CEO har tilgang til helseopplysninger.',
      en: 'Access to the member registry is limited to those who need it to deliver the service. Only the CEO has access to health data.'
    },
    'pv-section-8-li5': {
      no: 'Ved et eventuelt sikkerhetsbrudd som utgjør en risiko for dine rettigheter, varsles Datatilsynet innen 72 timer, og du varsles uten ugrunnet opphold.',
      en: 'In the event of a security breach posing a risk to your rights, the Norwegian Data Protection Authority is notified within 72 hours, and you are notified without undue delay.'
    },

    // Section 9 — Endringer i personvernerklæringen / Changes to the privacy policy
    'pv-section-9-title': {
      no: 'Endringer i personvernerklæringen',
      en: 'Changes to the privacy policy'
    },
    'pv-section-9-p1': {
      no: 'Vi kan oppdatere denne personvernerklæringen ved endringer i tjenesten, regelverket, eller bruken av nye verktøy.',
      en: 'We may update this privacy policy when the service, regulations or our use of tools changes.'
    },
    'pv-section-9-p2': {
      no: '<strong>Material endringer</strong> — endringer som påvirker hvilke data vi samler inn, hvem vi deler dem med, eller dine rettigheter — varsles på følgende måter:',
      en: '<strong>Material changes</strong> — changes affecting what data we collect, who we share it with, or your rights — are announced as follows:'
    },
    'pv-section-9-li1': {
      no: '<strong>E-post</strong> til alle aktive medlemmer minst <strong>30 dager før</strong> endringen trer i kraft.',
      en: '<strong>Email</strong> to all active members at least <strong>30 days before</strong> the change takes effect.'
    },
    'pv-section-9-li2': {
      no: '<strong>Banner på forsiden</strong> av nextelite.no/boxing i 30 dager før og etter ikrafttredelse.',
      en: '<strong>Banner on the front page</strong> of nextelite.no/boxing for 30 days before and after the change takes effect.'
    },
    'pv-section-9-li3': {
      no: '<strong>Versjonsnummer og dato</strong> oppdateres i header på erklæringen.',
      en: '<strong>Version number and date</strong> are updated in the policy header.'
    },
    'pv-section-9-p3': {
      no: '<strong>Mindre, ikke-materielle endringer</strong> (språkvask, klargjøringer som ikke endrer behandlingen) publiseres uten 30-dagers varsel, men dato og versjonsnummer oppdateres alltid.',
      en: '<strong>Minor, non-material changes</strong> (language polish, clarifications that do not alter processing) are published without 30 days notice, but the date and version number are always updated.'
    },
    'pv-section-9-p4': {
      no: '<strong>Tidligere versjoner</strong> av personvernerklæringen arkiveres på <a href="/personvern/historikk/"><strong>nextelite.no/personvern/historikk/</strong></a> slik at du kan se hva som tidligere har vært gjeldende. Hver arkivert versjon er tidsstemplet og inneholder en kort changelog.',
      en: '<strong>Previous versions</strong> of the privacy policy are archived at <a href="/personvern/historikk/"><strong>nextelite.no/personvern/historikk/</strong></a> so you can see what previously applied. Each archived version is timestamped and includes a brief changelog.'
    },
    'pv-section-9-p5': {
      no: 'Den til enhver tid gjeldende versjonen ligger publisert på nextelite.no.',
      en: 'The version currently in force is the one published on nextelite.no at any given time.'
    },

    // Footer
    'pv-footer-version': {
      no: 'Personvernerklæring versjon <strong>v03</strong>, sist oppdatert <strong>29. april 2026</strong>.<br>Tidligere versjoner: <a href="/personvern/historikk/">arkiv</a> (v01 — 29.04.2026, v02 — 29.04.2026).',
      en: 'Privacy policy version <strong>v03</strong>, last updated <strong>29 April 2026</strong>.<br>Previous versions: <a href="/personvern/historikk/">archive</a> (v01 — 29.04.2026, v02 — 29.04.2026). This English version is a translation of the Norwegian original; in case of discrepancy, the Norwegian version prevails.'
    },
    'pv-footer-home': { no: 'Forsiden', en: 'Home' },
    'pv-footer-terms': { no: 'Salgsbetingelser', en: 'Terms of Sale' },
    'pv-footer-archive': { no: 'Arkiv', en: 'Archive' },
    'pv-footer-contact': { no: 'Kontakt', en: 'Contact' }
  };

  // ═══════════════════════════════════════
  // LANGUAGE DETECTION
  // ═══════════════════════════════════════
  function detectLanguage() {
    // 1. Check URL parameter
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang === 'no' || urlLang === 'en') {
      localStorage.setItem('nextelite-lang', urlLang);
      // Clean URL without reload
      if (window.history && window.history.replaceState) {
        var cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', cleanUrl);
      }
      return urlLang;
    }

    // 2. Check localStorage
    var stored = localStorage.getItem('nextelite-lang');
    if (stored === 'no' || stored === 'en') {
      return stored;
    }

    // 3. Default to English
    return 'en';
  }

  // ═══════════════════════════════════════
  // APPLY TRANSLATIONS
  // ═══════════════════════════════════════
  function applyLanguage(lang) {
    // Update html lang attribute
    document.documentElement.lang = lang === 'no' ? 'no' : 'en';

    // Find all elements with data-i18n
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (translations[key] && translations[key][lang]) {
        el.textContent = translations[key][lang];
      }
    });

    // Find all elements with data-i18n-html (for HTML content like arrows)
    var htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (translations[key] && translations[key][lang]) {
        el.innerHTML = translations[key][lang];
      }
    });

    // Update toggle buttons
    var langBtns = document.querySelectorAll('[data-lang-btn]');
    langBtns.forEach(function(btn) {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang-btn') === lang) {
        btn.classList.add('active');
      }
    });

    // Save to localStorage
    localStorage.setItem('nextelite-lang', lang);
  }

  // ═══════════════════════════════════════
  // TOGGLE SETUP
  // ═══════════════════════════════════════
  function setupToggle() {
    var langBtns = document.querySelectorAll('[data-lang-btn]');
    langBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var lang = btn.getAttribute('data-lang-btn');
        applyLanguage(lang);
      });
    });
  }

  // ═══════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════
  var currentLang = detectLanguage();

  // Apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyLanguage(currentLang);
      setupToggle();
    });
  } else {
    applyLanguage(currentLang);
    setupToggle();
  }

  // Expose for external use
  window.nexteliteLang = {
    get: function() { return localStorage.getItem('nextelite-lang') || 'en'; },
    set: applyLanguage
  };

  // the ring speaks every language. the work is universal.
  // l1ft0ff — bokmål er ikke SMS. æøå eller ingenting.
  console.log('%c lang: ' + currentLang + ' ', 'color: #888; font-size: 10px;');
})();
