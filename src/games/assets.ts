// Maps the `visualAsset` key used in content markdown to an emoji glyph.
// Using emoji instead of image files keeps content authoring dependency-free
// (no image asset pipeline needed to add a new exercise).
const ASSET_EMOJI: Record<string, string> = {
  rocket: '🚀',
  planet: '🪐',
  star: '⭐',
  galaxy: '🌌',
  astronaut: '🧑‍🚀',
  moon: '🌙',
  comet: '☄️',
  lipstick: '💄',
  nail_polish: '💅',
  perfume: '🧴',
  mirror: '🪞',
  syringe: '💉',
  bandage: '🩹',
  stethoscope: '🩺',
  pill: '💊',
  heart: '💖',
  note_monster: '👾',
  music_note: '🎵',
};

export function assetEmoji(key: string | undefined): string {
  if (!key) return '⭐';
  return ASSET_EMOJI[key] ?? '⭐';
}
