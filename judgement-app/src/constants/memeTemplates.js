export const MEME_CATEGORIES = {
  HEAVY_CHOKE: 'HEAVY_CHOKE',       // Called way more than won (e.g. called >= 3, won <= 1, or diff >= 3)
  ZERO_STREAK: 'ZERO_STREAK',       // 2 or more rounds with 0 points
  ACCIDENTAL_GREED: 'ACCIDENTAL_GREED', // Called low (0 or 1), got overloaded with 3+ hands
  CHAD_ZERO: 'CHAD_ZERO',           // Boldly called 0 and survived with 0
  DEALER_TRAP: 'DEALER_TRAP',       // Dealer got stuck with illegal bid and lost
  GENERAL_MISS: 'GENERAL_MISS',     // Normal miss
};

export const DEFAULT_MEMES = [
  // Heavy Choke (Overcalled by a lot)
  {
    id: 'choke_1',
    category: MEME_CATEGORIES.HEAVY_CHOKE,
    title: '🤡 The Overconfidence Clown',
    roast: 'Called {bid} hands, won {won}! "Overconfidence will be the end of you, my friend."',
    quote: '"Bhai thoda aaram se, World Cup nahi chal raha!"',
    badge: 'CHOKER OF THE ROUND',
    emoji: '🤡',
    gradient: ['#ef4444', '#b91c1c'],
    soundType: 'clown_horn',
  },
  {
    id: 'choke_2',
    category: MEME_CATEGORIES.HEAVY_CHOKE,
    title: '🤦‍♂️ Bhai Kya Kar Raha Hai Tu?',
    roast: 'Claimed {bid} hands like a boss, crawled out with {won}.',
    quote: '"Bilkul bakwaas performance! Yeh sab doglapan hai."',
    badge: 'OVERCALLED DISASTER',
    emoji: '📉',
    gradient: ['#ea580c', '#c2410c'],
    soundType: 'sad_buzzer',
  },
  {
    id: 'choke_3',
    category: MEME_CATEGORIES.HEAVY_CHOKE,
    title: '🏏 Disappointed Fan Stare',
    roast: '{player} stood confident with {bid} bid, but ended with {won}. Entire table in shock.',
    quote: '"Hum mar jayenge par tum sudhroge nahi!"',
    badge: 'SPECTACULAR COLLAPSE',
    emoji: '🤷‍♂️',
    gradient: ['#7c2d12', '#451a03'],
    soundType: 'crickets',
  },

  // Zero Streak (Consistent 0s)
  {
    id: 'zero_streak_1',
    category: MEME_CATEGORIES.ZERO_STREAK,
    title: '🦆 Moye Moye Express!',
    roast: '{player} is on a {streak}-round ZERO streak! Serving fresh duck eggs to the whole table.',
    quote: '"Moye Moye... Moyeeeee Moyeeeeee 🎶"',
    badge: 'HAT-TRICK OF EGGS 🥚',
    emoji: '🦆',
    gradient: ['#6366f1', '#4338ca'],
    soundType: 'moye_moye',
  },
  {
    id: 'zero_streak_2',
    category: MEME_CATEGORIES.ZERO_STREAK,
    title: '👴 Sanse Na Ho Payega',
    roast: 'Another round, another big fat 0 for {player}. Streak: {streak} in a row!',
    quote: '"Beta tumse na ho payega, lakshan theek nahi lag rahe tumhare."',
    badge: 'PERMANENT 0 HUNTER',
    emoji: '🪦',
    gradient: ['#475569', '#1e293b'],
    soundType: 'sad_violin',
  },
  {
    id: 'zero_streak_3',
    category: MEME_CATEGORIES.ZERO_STREAK,
    title: '👋 Khatam, Tata, Bye Bye',
    roast: 'Scoreboard forgot how to add points for {player} ({streak} zeroes in a row).',
    quote: '"Good bye, gaya, tata, finish!"',
    badge: 'ZERO REPEAT OFFENDER',
    emoji: '👋',
    gradient: ['#be123c', '#881337'],
    soundType: 'sad_trombone',
  },

  // Accidental Greed (Called low, got overloaded)
  {
    id: 'greed_1',
    category: MEME_CATEGORIES.ACCIDENTAL_GREED,
    title: '📦 Sabka Theka Tune Liya Hai?',
    roast: 'Called {bid}, but took {won} hands! Accidental contractor of the table.',
    quote: '"Arey bhai itna kyu kheecha, baki kya aachar daalenge?"',
    badge: 'UNWANTED TRICK MAGNET',
    emoji: '🧲',
    gradient: ['#d97706', '#b45309'],
    soundType: 'whoosh',
  },

  // Chad Zero (Called 0 and made 0)
  {
    id: 'chad_zero_1',
    category: MEME_CATEGORIES.CHAD_ZERO,
    title: '🗿 Gigachad Zero Survivor',
    roast: '{player} smelled danger, called 0, threw cards in trash, and walked away with 10 POINTS!',
    quote: '"Jalwa hai hamara yahan!"',
    badge: 'ZERO IS A HERO',
    emoji: '😎',
    gradient: ['#059669', '#047857'],
    soundType: 'airhorn',
  },

  // Dealer Trap
  {
    id: 'dealer_trap_1',
    category: MEME_CATEGORIES.DEALER_TRAP,
    title: '🪤 Trapped at the Dealer Seat',
    roast: 'Dealer restriction had {player} trapped at bid {bid}. Fate was sealed from the start!',
    quote: '"Kismat hi kharab thi, dealer ban ke phas gaya!"',
    badge: 'DEALER SACRIFICE',
    emoji: '🪤',
    gradient: ['#9333ea', '#6b21a8'],
    soundType: 'screaming_goat',
  },
];
