import type { ExerciseSet } from '../content/types';
import type { ProfileConfig } from '../profiles/profiles.config';
import { ProfileAvatar } from '../profiles/ProfileAvatar';
import type { ChildProgress } from '../progress/progressStore';
import { useSpeech } from '../speech/useSpeech';

const CATEGORY_LABELS: Record<string, string> = {
  counting: 'Счёт',
  math: 'Математика',
  letters: 'Буквы',
  reading: 'Чтение',
  numbers: 'Цифры',
  matching: 'Найди пару',
  facts: 'Хочу всё знать',
  shapes: 'Формы',
  colors: 'Цвета',
  seasons: 'Времена года',
  figures: 'Загадочные фигуры',
  cartoons: 'Мультики',
};

export function HomeScreen({
  profile,
  sets,
  progress,
  onPickSet,
  onSwitchProfile,
}: {
  profile: ProfileConfig;
  sets: ExerciseSet[];
  progress: ChildProgress;
  onPickSet: (set: ExerciseSet) => void;
  onSwitchProfile: () => void;
}) {
  const { muted, toggleMuted } = useSpeech();

  const grouped = sets.reduce<Record<string, ExerciseSet[]>>((acc, set) => {
    (acc[set.category] ??= []).push(set);
    return acc;
  }, {});

  return (
    <div className="app-shell" style={{ overflowY: 'auto', padding: '1rem 1.5rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ProfileAvatar profile={profile} size="2.75rem" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{profile.name}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              ⭐ {progress.stars} · 🔥 {progress.streakDays} дн.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={toggleMuted}
            className="big-tap"
            style={{
              minWidth: 'auto',
              minHeight: 'auto',
              padding: '0.5rem 0.9rem',
              fontSize: '1.3rem',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
            aria-label={muted ? 'Включить звук' : 'Выключить звук'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={onSwitchProfile}
            className="big-tap"
            style={{
              minWidth: 'auto',
              minHeight: 'auto',
              padding: '0.5rem 0.9rem',
              fontSize: '0.9rem',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          >
            Сменить игрока
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([category, categorySets], sectionIdx) => (
        <section key={category} style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.75rem' }}>{CATEGORY_LABELS[category] ?? category}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {categorySets.map((set, i) => {
              const done = progress.completedSets[set.id];
              return (
                <button
                  key={set.id}
                  onClick={() => onPickSet(set)}
                  className="big-tap bounce-in"
                  style={{
                    width: '10rem',
                    height: '8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    border: '2px solid var(--accent)',
                    animationDelay: `${(sectionIdx * 3 + i) * 0.04}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <span style={{ fontSize: '2.2rem' }}>{set.emoji}</span>
                  <span style={{ fontSize: '1rem', textAlign: 'center' }}>{set.title}</span>
                  {done && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>✓ {Math.round(done.bestScore * 100)}%</span>}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
