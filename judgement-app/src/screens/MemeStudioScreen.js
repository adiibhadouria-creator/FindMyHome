import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DEFAULT_MEMES, MEME_CATEGORIES } from '../constants/memeTemplates';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storage';

export default function MemeStudioScreen({ onBack }) {
  const [customMemes, setCustomMemes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newCategory, setNewCategory] = useState(MEME_CATEGORIES.HEAVY_CHOKE);
  const [newSound, setNewSound] = useState('moye_moye');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadCustomMemes();
  }, []);

  const loadCustomMemes = async () => {
    const list = await storageService.getCustomMemes();
    setCustomMemes(list);
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permissions are required to pick a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        soundService.playSound('tap');
      }
    } catch {
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const handleSaveCustomMeme = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Missing Title', 'Please give this meme roast a title.');
      return;
    }

    const newMeme = {
      id: `custom_${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      roast: '{player} got roasted! ' + (newQuote.trim() || 'Performance to yaad rakhna!'),
      quote: newQuote.trim() ? `"${newQuote.trim()}"` : '"Bhai kya kar raha hai tu?"',
      badge: 'CUSTOM FRIEND ROAST 🎯',
      emoji: '📸',
      gradient: ['#9333ea', '#6b21a8'],
      soundType: newSound,
      imageUri: selectedImage,
      customImage: !!selectedImage,
    };

    const updated = await storageService.saveCustomMeme(newMeme);
    setCustomMemes(updated);

    // Reset form
    setNewTitle('');
    setNewQuote('');
    setSelectedImage(null);
    setShowAddModal(false);

    soundService.playSound('success');
    soundService.triggerHaptic('success');
    Alert.alert('Meme Saved! 🎉', 'This custom roast will now automatically trigger during games!');
  };

  const handleDeleteCustomMeme = async (id) => {
    const updated = await storageService.deleteCustomMeme(id);
    setCustomMemes(updated);
    soundService.playSound('tap');
  };

  const playPreviewSound = (soundType) => {
    soundService.playSound(soundType);
    soundService.triggerHaptic('medium');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meme Studio & Roasts</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Soundboard Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>🔊 MEME SOUNDBOARD (TAP TO TEST)</Text>
          <View style={styles.soundGrid}>
            {[
              { type: 'moye_moye', label: '🦆 Moye Moye' },
              { type: 'sad_trombone', label: '🎺 Wah Wah' },
              { type: 'clown_horn', label: '🤡 Honk Honk' },
              { type: 'sad_violin', label: '🎻 Sad Violin' },
              { type: 'airhorn', label: '📢 Airhorn' },
            ].map(s => (
              <TouchableOpacity
                key={s.type}
                style={styles.soundChip}
                onPress={() => playPreviewSound(s.type)}
                activeOpacity={0.8}
              >
                <Text style={styles.soundChipText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Custom Meme Toggle */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            setShowAddModal(!showAddModal);
            soundService.playSound('tap');
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnEmoji}>📸</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.createBtnTitle}>
              {showAddModal ? 'Hide Meme Creator ✕' : '+ Add Custom Friend Roast'}
            </Text>
            <Text style={styles.createBtnSubtitle}>Upload photos of your friends to roast them!</Text>
          </View>
        </TouchableOpacity>

        {/* Custom Meme Creator Form */}
        {showAddModal && (
          <View style={styles.creatorCard}>
            <Text style={styles.formTitle}>NEW FRIEND ROAST</Text>

            {/* Photo Picker */}
            <TouchableOpacity
              style={styles.imagePickerBox}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadEmoji}>🖼️</Text>
                  <Text style={styles.uploadText}>Tap to pick friend photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Trigger Category */}
            <Text style={styles.fieldLabel}>WHEN SHOULD THIS TRIGGER?</Text>
            <View style={styles.categoryPicker}>
              {[
                { cat: MEME_CATEGORIES.HEAVY_CHOKE, label: '🤡 Heavy Choke' },
                { cat: MEME_CATEGORIES.ZERO_STREAK, label: '🦆 Zero Streak' },
                { cat: MEME_CATEGORIES.ACCIDENTAL_GREED, label: '🧲 Overloaded Greed' },
                { cat: MEME_CATEGORIES.CHAD_ZERO, label: '🗿 Chad Zero' },
              ].map(c => (
                <TouchableOpacity
                  key={c.cat}
                  style={[styles.categoryChip, newCategory === c.cat && styles.categoryChipActive]}
                  onPress={() => setNewCategory(c.cat)}
                >
                  <Text style={[styles.categoryChipText, newCategory === c.cat && styles.categoryChipTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title */}
            <Text style={styles.fieldLabel}>ROAST TITLE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Overconfidence Ki Dukaan"
              placeholderTextColor="#64748b"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            {/* Quote / Punchline */}
            <Text style={styles.fieldLabel}>PUNCHLINE / QUOTE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bhai poker chhod ke ludo khel!"
              placeholderTextColor="#64748b"
              value={newQuote}
              onChangeText={setNewQuote}
            />

            {/* Sound Selector */}
            <Text style={styles.fieldLabel}>ROAST SOUND EFFECT</Text>
            <View style={styles.soundSelectorRow}>
              {['moye_moye', 'sad_trombone', 'clown_horn', 'sad_violin', 'airhorn'].map(snd => (
                <TouchableOpacity
                  key={snd}
                  style={[styles.miniSoundChip, newSound === snd && styles.miniSoundChipActive]}
                  onPress={() => {
                    setNewSound(snd);
                    playPreviewSound(snd);
                  }}
                >
                  <Text style={[styles.miniSoundText, newSound === snd && styles.miniSoundTextActive]}>
                    {snd.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveMemeBtn}
              onPress={handleSaveCustomMeme}
              activeOpacity={0.85}
            >
              <Text style={styles.saveMemeBtnText}>Save Roast to Game 💾</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Custom Memes List */}
        {customMemes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>YOUR CUSTOM ROASTS ({customMemes.length})</Text>
            {customMemes.map(m => (
              <View key={m.id} style={styles.customMemeRow}>
                {m.imageUri ? (
                  <Image source={{ uri: m.imageUri }} style={styles.customThumb} />
                ) : (
                  <View style={styles.customThumbPlaceholder}>
                    <Text style={{ fontSize: 22 }}>📸</Text>
                  </View>
                )}
                <View style={styles.customMeta}>
                  <Text style={styles.customTitle}>{m.title}</Text>
                  <Text style={styles.customQuote} numberOfLines={1}>{m.quote}</Text>
                </View>

                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => handleDeleteCustomMeme(m.id)}
                >
                  <Text style={styles.delBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Default Memes Previews */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>BUILT-IN VIRAL ROASTS ({DEFAULT_MEMES.length})</Text>
          {DEFAULT_MEMES.map(meme => (
            <View key={meme.id} style={styles.defaultMemeCard}>
              <View style={styles.defaultMemeHeader}>
                <Text style={styles.defaultEmoji}>{meme.emoji}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.defaultTitle}>{meme.title}</Text>
                  <Text style={styles.defaultBadge}>{meme.badge}</Text>
                </View>

                <TouchableOpacity
                  style={styles.miniPlayBtn}
                  onPress={() => playPreviewSound(meme.soundType)}
                >
                  <Text style={{ fontSize: 16 }}>🔊</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.defaultQuote}>{meme.quote}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  soundChip: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  soundChipText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#9333ea',
    marginBottom: 20,
  },
  createBtnEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  createBtnTitle: {
    color: '#c084fc',
    fontSize: 16,
    fontWeight: '800',
  },
  createBtnSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  creatorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#475569',
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  imagePickerBox: {
    height: 140,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  uploadText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryChipActive: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  categoryChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryChipTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  soundSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 18,
  },
  miniSoundChip: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  miniSoundChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  miniSoundText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  miniSoundTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  saveMemeBtn: {
    backgroundColor: '#9333ea',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveMemeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  customMemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  customThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  customThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customMeta: {
    flex: 1,
    marginLeft: 12,
  },
  customTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  customQuote: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  delBtn: {
    padding: 10,
  },
  delBtnText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  defaultMemeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  defaultMemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultEmoji: {
    fontSize: 28,
  },
  defaultTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  defaultBadge: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  miniPlayBtn: {
    padding: 8,
  },
  defaultQuote: {
    color: '#cbd5e1',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
    paddingLeft: 38,
  },
});
