import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PlayerAvatar from '../components/PlayerAvatar';
import CardSuitBadge from '../components/CardSuitBadge';

export default function ScoreboardScreen({ game, onNextRound, onFinishGame, onBackToGame }) {
  const [activeTab, setActiveTab] = useState('LEADERBOARD'); // LEADERBOARD | MATRIX
  const isFinalRound = game.currentRoundIndex >= game.rounds.length - 1;
  const currentRound = game.rounds[game.currentRoundIndex];

  // Sort players by totalPoints descending
  const rankedPlayers = [...game.players].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackToGame} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>‹ Game</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scoreboard</Text>
        <View style={{ width: 45 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'LEADERBOARD' && styles.tabItemActive]}
          onPress={() => setActiveTab('LEADERBOARD')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'LEADERBOARD' && styles.tabTextActive]}>
            🏆 Leaderboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'MATRIX' && styles.tabItemActive]}
          onPress={() => setActiveTab('MATRIX')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'MATRIX' && styles.tabTextActive]}>
            📜 Score Matrix
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'LEADERBOARD' ? (
          <View>
            <Text style={styles.sectionTitle}>CURRENT STANDINGS</Text>

            {rankedPlayers.map((player, rankIdx) => {
              const lastScore = currentRound?.scores?.[player.id];
              const roundPoints = lastScore ? lastScore.points : null;
              const hasZeroStreak = (player.zeroStreak || 0) >= 2;

              return (
                <View
                  key={player.id}
                  style={[
                    styles.rankCard,
                    rankIdx === 0 && styles.firstRankCard,
                  ]}
                >
                  <Text style={styles.rankMedal}>{getRankBadge(rankIdx)}</Text>

                  <PlayerAvatar
                    name={player.name}
                    imageUri={player.avatar}
                    index={rankIdx}
                    size={46}
                  />

                  <View style={styles.playerMeta}>
                    <View style={styles.nameRow}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      {hasZeroStreak && (
                        <View style={styles.duckBadge}>
                          <Text style={styles.duckText}>🦆 {player.zeroStreak} ZEROS</Text>
                        </View>
                      )}
                    </View>

                    {lastScore !== undefined && roundPoints !== null && (
                      <Text style={styles.roundDiff}>
                        Last Round:{' '}
                        <Text style={roundPoints > 0 ? styles.greenDiff : styles.redDiff}>
                          {roundPoints > 0 ? `+${roundPoints}` : '0 (Duck)'}
                        </Text>{' '}
                        ({lastScore.bid} bid / {lastScore.won} won)
                      </Text>
                    )}
                  </View>

                  <View style={styles.pointsCol}>
                    <Text style={styles.pointsNumber}>{player.totalPoints || 0}</Text>
                    <Text style={styles.pointsLabel}>PTS</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          /* Score Matrix Table */
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.matrixTable}>
              {/* Header Row */}
              <View style={styles.matrixRowHeader}>
                <View style={[styles.matrixCell, styles.matrixColRound]}>
                  <Text style={styles.matrixHeaderText}>Rnd</Text>
                </View>
                <View style={[styles.matrixCell, styles.matrixColTrump]}>
                  <Text style={styles.matrixHeaderText}>Trump</Text>
                </View>

                {game.players.map(p => (
                  <View key={p.id} style={[styles.matrixCell, styles.matrixColPlayer]}>
                    <Text style={styles.matrixHeaderText} numberOfLines={1}>{p.name}</Text>
                  </View>
                ))}
              </View>

              {/* Rows */}
              {game.rounds.map((rnd, rIdx) => {
                const isCurrent = rIdx === game.currentRoundIndex;
                const isCompleted = rnd.isCompleted;

                return (
                  <View
                    key={rIdx}
                    style={[
                      styles.matrixRow,
                      isCurrent && styles.matrixRowCurrent,
                      !isCompleted && !isCurrent && styles.matrixRowFuture,
                    ]}
                  >
                    <View style={[styles.matrixCell, styles.matrixColRound]}>
                      <Text style={styles.matrixCellText}>
                        #{rnd.roundNumber} ({rnd.cardsDealt})
                      </Text>
                    </View>

                    <View style={[styles.matrixCell, styles.matrixColTrump]}>
                      <Text style={{ fontSize: 16 }}>{rnd.trumpSuit?.symbol}</Text>
                    </View>

                    {game.players.map(p => {
                      const score = rnd.scores?.[p.id];
                      const isSuccess = score && score.points > 0;

                      return (
                        <View key={p.id} style={[styles.matrixCell, styles.matrixColPlayer]}>
                          {score ? (
                            <View style={styles.scoreCellInner}>
                              <Text style={[styles.scorePts, isSuccess ? styles.greenText : styles.redText]}>
                                {score.points}
                              </Text>
                              <Text style={styles.scoreDetail}>
                                {score.bid}/{score.won}
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.cellEmpty}>-</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {isFinalRound ? (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={onFinishGame}
            activeOpacity={0.85}
          >
            <Text style={styles.finishBtnText}>Final Game Results 🏆</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextRoundBtn}
            onPress={onNextRound}
            activeOpacity={0.85}
          >
            <Text style={styles.nextRoundBtnText}>
              Start Round {game.currentRoundIndex + 2} ▶
            </Text>
          </TouchableOpacity>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: '#334155',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  firstRankCard: {
    borderColor: '#f59e0b',
    backgroundColor: '#1f2537',
  },
  rankMedal: {
    fontSize: 22,
    marginRight: 10,
    width: 32,
    textAlign: 'center',
  },
  playerMeta: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  duckBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  duckText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '900',
  },
  roundDiff: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 3,
  },
  greenDiff: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  redDiff: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  pointsCol: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  pointsNumber: {
    color: '#fbbf24',
    fontSize: 22,
    fontWeight: '900',
  },
  pointsLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
  },
  matrixTable: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  matrixRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  matrixRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  matrixRowCurrent: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  matrixRowFuture: {
    opacity: 0.5,
  },
  matrixCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixColRound: {
    width: 70,
  },
  matrixColTrump: {
    width: 50,
  },
  matrixColPlayer: {
    width: 80,
  },
  matrixHeaderText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
  },
  matrixCellText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreCellInner: {
    alignItems: 'center',
  },
  scorePts: {
    fontSize: 14,
    fontWeight: '900',
  },
  scoreDetail: {
    color: '#64748b',
    fontSize: 10,
  },
  greenText: {
    color: '#10b981',
  },
  redText: {
    color: '#ef4444',
  },
  cellEmpty: {
    color: '#475569',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#090d16',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  nextRoundBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextRoundBtnText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
  finishBtn: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  finishBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});
