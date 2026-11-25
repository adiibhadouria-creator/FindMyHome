import { DEFAULT_MEMES, MEME_CATEGORIES } from '../constants/memeTemplates';

export const memeEngine = {
  /**
   * Evaluates a completed round for all players and returns triggered meme roasts
   * @param {Object} roundData Current round details (cards, trump, dealerId)
   * @param {Array} players List of players with history and current round scores
   * @param {Array} allRounds Full history of rounds played so far
   * @param {Array} customMemes User uploaded custom memes
   * @returns {Array} List of triggered roast events
   */
  evaluateRoundRoasts(roundData, players, allRounds, customMemes = []) {
    const roasts = [];
    const pool = [...customMemes, ...DEFAULT_MEMES];

    players.forEach(player => {
      const bid = player.currentBid ?? 0;
      const won = player.currentWon ?? 0;
      const points = bid === won ? 10 + bid : 0;
      const isDealer = roundData.dealerId === player.id;

      // Calculate zero streak (consecutive rounds where points === 0)
      let zeroStreak = 0;
      if (points === 0) {
        zeroStreak = 1;
        // Count backwards in previous rounds
        for (let i = allRounds.length - 1; i >= 0; i--) {
          const pastScore = allRounds[i].scores?.[player.id];
          if (pastScore && pastScore.points === 0) {
            zeroStreak++;
          } else {
            break;
          }
        }
      }

      // 1. Check for Zero Streak (2 or more zeroes in a row)
      if (zeroStreak >= 2) {
        const matchingMemes = pool.filter(m => m.category === MEME_CATEGORIES.ZERO_STREAK);
        const template = matchingMemes[Math.floor(Math.random() * matchingMemes.length)] || DEFAULT_MEMES[3];
        roasts.push(this.formatRoast(template, player, bid, won, zeroStreak, 'CRITICAL_FAIL'));
        return; // Don't stack multiple roasts for the same player in one round
      }

      // 2. Check for Heavy Choke (called much more than won)
      const chokeDiff = bid - won;
      const isHeavyChoke = chokeDiff >= 3 || (bid >= 3 && won === 0) || (bid >= 4 && won <= 1);

      if (isHeavyChoke) {
        const matchingMemes = pool.filter(m => m.category === MEME_CATEGORIES.HEAVY_CHOKE);
        const template = matchingMemes[Math.floor(Math.random() * matchingMemes.length)] || DEFAULT_MEMES[0];
        roasts.push(this.formatRoast(template, player, bid, won, 0, 'CHOKE'));
        return;
      }

      // 3. Check for Dealer Trap
      if (isDealer && points === 0 && roundData.restrictedBid === bid) {
        const matchingMemes = pool.filter(m => m.category === MEME_CATEGORIES.DEALER_TRAP);
        const template = matchingMemes[0] || DEFAULT_MEMES[0];
        roasts.push(this.formatRoast(template, player, bid, won, 0, 'DEALER_FAIL'));
        return;
      }

      // 4. Check for Accidental Greed (called low, overloaded with 3+ tricks)
      if (bid <= 1 && won >= 3 && won - bid >= 2) {
        const matchingMemes = pool.filter(m => m.category === MEME_CATEGORIES.ACCIDENTAL_GREED);
        const template = matchingMemes[0] || DEFAULT_MEMES[6];
        roasts.push(this.formatRoast(template, player, bid, won, 0, 'GREED'));
        return;
      }

      // 5. Chad Zero (Called 0 and survived)
      if (bid === 0 && won === 0 && roundData.cardsDealt >= 3) {
        const matchingMemes = pool.filter(m => m.category === MEME_CATEGORIES.CHAD_ZERO);
        const template = matchingMemes[0] || DEFAULT_MEMES[7];
        roasts.push(this.formatRoast(template, player, bid, won, 0, 'CHAD'));
      }
    });

    return roasts;
  },

  formatRoast(template, player, bid, won, streak, severity) {
    const replaceVars = text =>
      (text || '')
        .replace(/{player}/g, player.name)
        .replace(/{bid}/g, String(bid))
        .replace(/{won}/g, String(won))
        .replace(/{streak}/g, String(streak));

    return {
      id: `${template.id}_${player.id}_${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      playerAvatar: player.avatar,
      title: replaceVars(template.title),
      roast: replaceVars(template.roast),
      quote: replaceVars(template.quote),
      badge: template.badge || 'ROAST OF THE ROUND',
      emoji: template.emoji || '🔥',
      gradient: template.gradient || ['#ef4444', '#991b1b'],
      soundType: template.soundType || 'sad_trombone',
      imageUri: template.imageUri || null, // For custom meme images
      customImage: template.customImage || false,
      severity,
      bid,
      won,
      streak,
    };
  },
};
