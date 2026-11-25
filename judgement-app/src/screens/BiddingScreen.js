import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CardSuitBadge from '../components/CardSuitBadge';
import PlayerAvatar from '../components/PlayerAvatar';
import NumberStepper from '../components/NumberStepper';
import { soundService } from '../services/soundService';

export default function BiddingScreen({ game, onLockBids, onOpenScoreboard }) {
  const currentRound = game.rounds[game.currentRoundIndex];
  const { cardsDealt, trumpSuit, dealerId, roundNumber } = currentRound;

  // Organize players in bidding order: player directly after dealer bids first, dealer bids last
  const dealerIdx = game.players.findIndex(p => p.id === dealerId);
  const orderedPlayers = [];
  for (let i = 1; i <= game.players.length; i++) {
    const idx = (dealerIdx + i) % game.players.length;
    orderedPlayers.push(game.players[idx]);
  }

  // Local state for bids (initialized from currentRound.bids or 0)
  const [bids, setBids] = useState(() => {
    const initial = {};
    game.players.forEach(p => {
      initial[p.id] = currentRound.bids[p.id] ?? 0;
    });
    return initial;
  });

  const handleBidChange = (playerId, val) => {
    setBids(prev => ({
      ...prev,
      [playerId]: val,
    }));
  };

  // Calculate sum of bids from non-dealer players
  const nonDealerSum = orderedPlayers
    .filter(p => p.id !== dealerId)
    .reduce((sum, p) => sum + (bids[p.id] || 0), 0);

  // The restricted bid for the dealer
  const dealerRestrictedBid = cardsDealt - nonDealerSum;
  const isDealerRestricted = dealerRestrictedBid >= 0 && dealerRestrictedBid <= cardsDealt;

  // Total bids
  const totalBids = Object.values(bids).reduce((a, b) => a + b, 0);

  const handleSubmit = () => {
    // Validate dealer bid constraint
    if (isDealerRestricted && bids[dealerId] === dealerRestrictedBid) {
      soundService.playSound('clown_horn');
      soundService.triggerHaptic('error');
      Alert.alert(
        'Illegal Dealer Bid! 🚫',
        `The dealer cannot bid ${dealerRestrictedBid}! The sum of all bids cannot equal the cards dealt (${cardsDealt}). Please adjust the bid.`
      );
      return;
    }

    soundService.playSound('success');
    soundService.triggerHaptic('success');
    onLockBids(bids, isDealerRestricted ? dealerRestrictedBid : null);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.roundLabel}>ROUND {roundNumber} OF {game.rounds.length}</Text>
          <Text style={styles.cardsDealtLabel}>{cardsDealt} Cards Dealt</Text>
        </View>
        <CardSuitBadge suit={trumpSuit} size="normal" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner with Live Bid vs Cards Counter */}
        <View style={styles.trackerBanner}>
          <View style={styles.trackerRow}>
            <View>
              <Text style={styles.trackerLabel}>TOTAL BIDS</Text>
              <Text style={[styles.trackerValue, totalBids === cardsDealt && styles.trackerWarn]}>
                {totalBids} <Text style={styles.trackerMax}>/ {cardsDealt}</Text>
              </Text>
            </View>

            <View style={styles.trackerStatusBox}>
              {totalBids === cardsDealt ? (
                <Text style={styles.trackerStatusWarn}>⚠️ Exactly {cardsDealt} (Dealer must change)</Text>
              ) : totalBids > cardsDealt ? (
                <Text style={styles.trackerStatusOver}>⚔️ OVER-BID ({totalBids - cardsDealt} extra - Bloodbath!)</Text>
              ) : (
                <Text style={styles.trackerStatusUnder}>🛡️ UNDER-BID ({cardsDealt - totalBids} surplus hands)</Text>
              )}
            </View>
          </View>

          {isDealerRestricted && (
            <View style={styles.dealerRestrictionBox}>
              <Text style={styles.dealerRestrictionText}>
                ⚠️ Dealer ({orderedPlayers[orderedPlayers.length - 1].name}) cannot bid <Text style={styles.boldRed}>{dealerRestrictedBid}</Text>
              </Text>
            </View>
          )}
        </View>

        {/* Players Bidding List */}
        <Text style={styles.biddingOrderTitle}>BIDDING IN ORDER (Dealer Bids Last)</Text>

        {orderedPlayers.map((player, idx) => {
          const isDealer = player.id === dealerId;
          const playerBid = bids[player.id] ?? 0;
          const disabledNumbers = isDealer && isDealerRestricted ? [dealerRestrictedBid] : [];

          return (
            <View
              key={player.id}
              style={[
                styles.playerCard,
                isDealer && styles.dealerPlayerCard,
              ]}
            >
              <View style={styles.playerCardHeader}>
                <PlayerAvatar
                  name={player.name}
                  imageUri={player.avatar}
                  isDealer={isDealer}
                  index={idx}
                  size={42}
                />
                <View style={styles.playerMeta}>
                  <Text style={styles.playerName}>
                    {player.name} {isDealer && '👑 (Dealer)'}
                  </Text>
                  <Text style={styles.playerScore}>
                    Score: {player.totalPoints || 0} pts
                  </Text>
                </View>

                <View style={styles.bidDisplayBadge}>
                  <Text style={styles.bidDisplayLabel}>BID</Text>
                  <Text style={styles.bidDisplayVal}>{playerBid}</Text>
                </View>
              </View>

              {/* Number Stepper */}
              <NumberStepper
                value={playerBid}
                min={0}
                max={cardsDealt}
                onChange={(val) => handleBidChange(player.id, val)}
                disabledNumbers={disabledNumbers}
                disabledMessage={`Dealer cannot bid ${dealerRestrictedBid}`}
                accentColor={isDealer ? '#f59e0b' : '#38bdf8'}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.scoreboardBtn}
          onPress={onOpenScoreboard}
          activeOpacity={0.8}
        >
          <Text style={styles.scoreboardBtnText}>📊 Scoreboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>Lock In Bids ▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  roundLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardsDealtLabel: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  trackerBanner: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackerLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  trackerValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
  },
  trackerWarn: {
    color: '#ef4444',
  },
  trackerMax: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '700',
  },
  trackerStatusBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  trackerStatusWarn: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '800',
  },
  trackerStatusOver: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '800',
  },
  trackerStatusUnder: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '800',
  },
  dealerRestrictionBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  dealerRestrictionText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  boldRed: {
    color: '#ef4444',
    fontWeight: '900',
  },
  biddingOrderTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dealerPlayerCard: {
    borderColor: '#f59e0b',
    backgroundColor: '#1a2234',
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerMeta: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  playerScore: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  bidDisplayBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bidDisplayLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
  },
  bidDisplayVal: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '900',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#090d16',
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  scoreboardBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreboardBtnText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '800',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
});
