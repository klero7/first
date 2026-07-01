import { useEffect, useState } from 'react';
import type { GameComponentProps } from './GameComponentProps';
import { ChoiceButtons } from './ChoiceButtons';
import { assetEmoji } from './assets';
import { speak } from '../speech/speech';

export function CountTheObjects({ question, onAnswer }: GameComponentProps) {
  const total = question.count ?? 0;
  const emoji = assetEmoji(question.visualAsset);
  const [tapped, setTapped] = useState<Set<number>>(new Set());

  useEffect(() => {
    setTapped(new Set());
    speak(question.speak ?? question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const toggle = (idx: number) => {
    setTapped((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2rem', margin: 0, textAlign: 'center' }}>{question.prompt}</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          maxWidth: '32rem',
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="big-tap"
            style={{
              fontSize: '2.2rem',
              background: tapped.has(i) ? 'var(--success)' : 'var(--surface-solid)',
              border: '2px solid var(--accent)',
              width: '4rem',
              height: '4rem',
              minWidth: '4rem',
              minHeight: '4rem',
              padding: 0,
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div style={{ fontSize: '1.3rem' }}>Посчитал: {tapped.size}</div>
      <ChoiceButtons choices={question.choices ?? []} onAnswer={onAnswer} />
    </div>
  );
}
