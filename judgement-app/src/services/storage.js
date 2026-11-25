import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACTIVE_GAME: '@judgement_active_game',
  GAME_HISTORY: '@judgement_game_history',
  CUSTOM_MEMES: '@judgement_custom_memes',
  SAVED_PLAYERS: '@judgement_saved_players',
  SETTINGS: '@judgement_settings',
};

export const storageService = {
  // Active Game
  async saveActiveGame(game) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_GAME, JSON.stringify(game));
    } catch (e) {
      console.warn('Failed to save active game', e);
    }
  },

  async getActiveGame() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_GAME);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async clearActiveGame() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
    } catch (e) {
      console.warn('Failed to clear active game', e);
    }
  },

  // Game History
  async saveCompletedGame(game) {
    try {
      const existing = await this.getGameHistory();
      const updated = [game, ...existing].slice(0, 30); // Keep last 30 games
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save completed game', e);
    }
  },

  async getGameHistory() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Custom Memes
  async getCustomMemes() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_MEMES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveCustomMeme(meme) {
    try {
      const existing = await this.getCustomMemes();
      const updated = [meme, ...existing.filter(m => m.id !== meme.id)];
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_MEMES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to save custom meme', e);
      return [];
    }
  },

  async deleteCustomMeme(memeId) {
    try {
      const existing = await this.getCustomMemes();
      const updated = existing.filter(m => m.id !== memeId);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_MEMES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to delete custom meme', e);
      return [];
    }
  },

  // Saved player names
  async getSavedPlayers() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PLAYERS);
      return data ? JSON.parse(data) : ['Arjun', 'Rohan', 'Pooja', 'Vikram'];
    } catch {
      return ['Arjun', 'Rohan', 'Pooja', 'Vikram'];
    }
  },

  async saveSavedPlayers(players) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PLAYERS, JSON.stringify(players));
    } catch (e) {
      console.warn('Failed to save players', e);
    }
  },
};
