import { useEffect } from 'react';
import { speak } from '../speech/speech';

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
      }}
    >
      <div style={{ fontSize: '5rem' }}>{'⭐'.repeat(Math.max(1, correctCount))}</div>
      <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>
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
