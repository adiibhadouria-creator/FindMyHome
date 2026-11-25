import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameSetupScreen from './src/screens/GameSetupScreen';
import BiddingScreen from './src/screens/BiddingScreen';
import ActualHandsScreen from './src/screens/ActualHandsScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import MemeStudioScreen from './src/screens/MemeStudioScreen';
import RulesScreen from './src/screens/RulesScreen';
import MemeModal from './src/components/MemeModal';
import { storageService } from './src/services/storage';
import { memeEngine } from './src/services/memeEngine';
import { soundService } from './src/services/soundService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [game, setGame] = useState(null);
  const [customMemes, setCustomMemes] = useState([]);

  // Roast Modal State
  const [activeRoasts, setActiveRoasts] = useState([]);
  const [showMemeModal, setShowMemeModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const active = await storageService.getActiveGame();
    if (active) {
      setGame(active);
    }
    const memes = await storageService.getCustomMemes();
    setCustomMemes(memes);
  };

  // Screen Navigation handlers
  const handleStartNewGameSetup = () => {
    setCurrentScreen('SETUP');
  };

  const handleStartGame = async (newGame) => {
    setGame(newGame);
    await storageService.saveActiveGame(newGame);
    setCurrentScreen('BIDDING');
  };

  const handleResumeGame = () => {
    if (!game) return;
    if (game.phase === 'ACTUAL_HANDS') {
      setCurrentScreen('ACTUAL_HANDS');
    } else if (game.phase === 'SCOREBOARD') {
      setCurrentScreen('SCOREBOARD');
    } else {
      setCurrentScreen('BIDDING');
    }
  };

  // Bidding Phase -> Actual Hands Phase
  const handleLockBids = async (bids, restrictedBid) => {
    const updatedGame = { ...game };
    const currentRound = updatedGame.rounds[updatedGame.currentRoundIndex];
    currentRound.bids = bids;
    currentRound.restrictedBid = restrictedBid;
    updatedGame.phase = 'ACTUAL_HANDS';

    setGame(updatedGame);
    await storageService.saveActiveGame(updatedGame);
    setCurrentScreen('ACTUAL_HANDS');
  };

  // Actual Hands Phase -> Score & Roast Evaluation
  const handleSubmitActualHands = async (won) => {
    const updatedGame = { ...game };
    const currentRound = updatedGame.rounds[updatedGame.currentRoundIndex];
    currentRound.won = won;
    currentRound.scores = {};

    // Fresh custom memes
    const memes = await storageService.getCustomMemes();

    // Calculate score for each player
    updatedGame.players = updatedGame.players.map(player => {
      const bid = currentRound.bids[player.id] ?? 0;
      const tricksWon = won[player.id] ?? 0;
      const isMatch = bid === tricksWon;
      const points = isMatch ? 10 + bid : 0;

      // Update round score map
      currentRound.scores[player.id] = {
        bid,
        won: tricksWon,
        points,
      };

      const updatedStreak = points === 0 ? (player.zeroStreak || 0) + 1 : 0;
      const updatedMatches = isMatch ? (player.matchesWon || 0) + 1 : (player.matchesWon || 0);

      return {
        ...player,
        totalPoints: (player.totalPoints || 0) + points,
        zeroStreak: updatedStreak,
        matchesWon: updatedMatches,
        currentBid: bid,
        currentWon: tricksWon,
      };
    });

    currentRound.isCompleted = true;
    updatedGame.phase = 'SCOREBOARD';

    // Trigger Meme Roasts Engine!
    const pastRounds = updatedGame.rounds.slice(0, updatedGame.currentRoundIndex);
    const triggeredRoasts = memeEngine.evaluateRoundRoasts(
      currentRound,
      updatedGame.players,
      pastRounds,
      memes
    );

    setGame(updatedGame);
    await storageService.saveActiveGame(updatedGame);

    if (triggeredRoasts.length > 0) {
      setActiveRoasts(triggeredRoasts);
      setShowMemeModal(true);
    } else {
      setCurrentScreen('SCOREBOARD');
    }
  };

  const handleCloseMemeModal = () => {
    setShowMemeModal(false);
    setActiveRoasts([]);
    setCurrentScreen('SCOREBOARD');
  };

  // Scoreboard -> Next Round
  const handleNextRound = async () => {
    const updatedGame = { ...game };
    updatedGame.currentRoundIndex++;
    updatedGame.phase = 'BIDDING';

    setGame(updatedGame);
    await storageService.saveActiveGame(updatedGame);
    soundService.playSound('tap');
    setCurrentScreen('BIDDING');
  };

  // Scoreboard -> Final Game Over
  const handleFinishGame = async () => {
    const ranked = [...game.players].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    const completedGame = {
      ...game,
      winner: ranked[0],
      finishedAt: new Date().toISOString(),
    };

    await storageService.saveCompletedGame(completedGame);
    await storageService.clearActiveGame();
    setGame(completedGame);
    setCurrentScreen('GAME_OVER');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('SETUP');
  };

  const handleGoHome = () => {
    setCurrentScreen('HOME');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <View style={styles.container}>
        {currentScreen === 'HOME' && (
          <HomeScreen
            onStartNew={handleStartNewGameSetup}
            onResumeGame={handleResumeGame}
            onOpenMemes={() => setCurrentScreen('MEME_STUDIO')}
            onOpenRules={() => setCurrentScreen('RULES')}
          />
        )}

        {currentScreen === 'SETUP' && (
          <GameSetupScreen
            onBack={handleGoHome}
            onStartGame={handleStartGame}
          />
        )}

        {currentScreen === 'BIDDING' && game && (
          <BiddingScreen
            game={game}
            onLockBids={handleLockBids}
            onOpenScoreboard={() => setCurrentScreen('SCOREBOARD')}
          />
        )}

        {currentScreen === 'ACTUAL_HANDS' && game && (
          <ActualHandsScreen
            game={game}
            onSubmitResults={handleSubmitActualHands}
            onEditBids={() => setCurrentScreen('BIDDING')}
          />
        )}

        {currentScreen === 'SCOREBOARD' && game && (
          <ScoreboardScreen
            game={game}
            onNextRound={handleNextRound}
            onFinishGame={handleFinishGame}
            onBackToGame={() => setCurrentScreen(game.phase === 'ACTUAL_HANDS' ? 'ACTUAL_HANDS' : 'BIDDING')}
          />
        )}

        {currentScreen === 'GAME_OVER' && game && (
          <GameOverScreen
            game={game}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )}

        {currentScreen === 'MEME_STUDIO' && (
          <MemeStudioScreen
            onBack={handleGoHome}
          />
        )}

        {currentScreen === 'RULES' && (
          <RulesScreen
            onBack={handleGoHome}
          />
        )}

        {/* Global Roast & Meme Popup Modal */}
        <MemeModal
          visible={showMemeModal}
          roasts={activeRoasts}
          onClose={handleCloseMemeModal}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
});
