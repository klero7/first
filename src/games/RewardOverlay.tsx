import { useEffect, useMemo } from 'react';
import { speak } from '../speech/speech';

const CONFETTI_EMOJI = ['⭐', '🎉', '✨', '🌟'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 1.5,
        emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
      })),
    [],
  );

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}

export function RewardOverlay({
  correctCount,
  totalCount,
  onReplay,
  onHome,
}: {
  correctCount: number;
  totalCount: number;
  onReplay: () => void;
  onHome: () => void;
}) {
  useEffect(() => {
    speak(`Раунд закончен! Правильно ${correctCount} из ${totalCount}.`);
  }, [correctCount, totalCount]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 6, 26, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <Confetti />
      <div className="bounce-in" style={{ fontSize: '5rem' }}>
        {'⭐'.repeat(Math.max(1, correctCount))}
      </div>
      <h2 className="bounce-in" style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>
        Правильно: {correctCount} из {totalCount}!
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <button
          className="big-tap"
          onClick={onReplay}
          style={{ background: 'var(--accent)', color: '#0b1130', padding: '0 1.5rem' }}
        >
          Играть ещё раз
        </button>
        <button
          className="big-tap"
          onClick={onHome}
          style={{ background: 'var(--accent-2)', color: '#0b1130', padding: '0 1.5rem' }}
        >
          Домой
        </button>
      </div>
    </div>
  );
}
