export const CARD_SUITS = [
  { id: 'spades', name: 'Spades', symbol: '♠', color: '#1e293b', label: 'Hukum (Spades)', bg: '#f1f5f9' },
  { id: 'diamonds', name: 'Diamonds', symbol: '♦', color: '#dc2626', label: 'Chikat (Diamonds)', bg: '#fef2f2' },
  { id: 'clubs', name: 'Clubs', symbol: '♣', color: '#047857', label: 'Chidi (Clubs)', bg: '#ecfdf5' },
  { id: 'hearts', name: 'Hearts', symbol: '♥', color: '#e11d48', label: 'Paan (Hearts)', bg: '#fff1f2' },
  { id: 'notrump', name: 'No Trump', symbol: '🚫', color: '#8b5cf6', label: 'No Trump (NT)', bg: '#f5f3ff' },
];

export const ROUND_PRESETS = [
  { id: 'desc_10_1', name: '10 down to 1', desc: '10 rounds (Classic Indian)', cards: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { id: 'desc_7_1', name: '7 down to 1', desc: '7 rounds (Quick game)', cards: [7, 6, 5, 4, 3, 2, 1] },
  { id: 'desc_13_1', name: '13 down to 1', desc: '13 rounds (Full marathon)', cards: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { id: 'asc_1_10', name: '1 up to 10', desc: '10 rounds (Warm up to chaos)', cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 'v_shape_7', name: '1 to 7 to 1', desc: '13 rounds (The mountain)', cards: [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1] },
];
