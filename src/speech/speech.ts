let voices: SpeechSynthesisVoice[] = [];
let ready = false;
let muted = false;

const MUTE_KEY = 'kidsapp:speechMuted';

export function initSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  muted = localStorage.getItem(MUTE_KEY) === 'true';
  const load = () => {
    voices = window.speechSynthesis.getVoices();
    ready = voices.length > 0;
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
}

export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && ready;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  localStorage.setItem(MUTE_KEY, String(value));
  if (value && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Fire-and-forget: speech is always a secondary channel on top of visual
// feedback, so a missing/unavailable voice must never block correctness
// feedback from showing.
export function speak(text: string): void {
  if (muted) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    const ruVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ru'));
    if (ruVoice) utter.voice = ruVoice;
    utter.lang = 'ru-RU';
    utter.rate = 0.9;
    utter.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch {
    // Speech is a nice-to-have; swallow any browser quirks silently.
  }
}

const PRAISE = ['Молодец!', 'Правильно!', 'Отлично!', 'Умница!', 'Так держать!', 'Супер!'];
const ENCOURAGE = ['Почти! Попробуй ещё раз.', 'Не страшно, попробуем снова.', 'Давай ещё разок!'];

export function speakPraise(): void {
  speak(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
}

export function speakEncourage(): void {
  speak(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]);
}
