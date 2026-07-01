import { useEffect } from 'react';
import type { GameComponentProps } from './GameComponentProps';
import { ChoiceButtons } from './ChoiceButtons';
import { speak } from '../speech/speech';

export function NumberLine({ question, onAnswer }: GameComponentProps) {
  const start = question.sequenceStart ?? 1;
  const sequence = [start, start + 1, start + 2];

  useEffect(() => {
    speak(question.speak ?? question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2rem', margin: 0, textAlign: 'center' }}>{question.prompt}</h2>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '2.5rem', alignItems: 'center' }}>
        {sequence.map((n) => (
          <span
            key={n}
            style={{
              minWidth: '4rem',
              textAlign: 'center',
              background: 'var(--surface)',
              borderRadius: '1rem',
              padding: '0.25rem 0.5rem',
            }}
          >
            {n}
          </span>
        ))}
        <span
          style={{
            minWidth: '4rem',
            textAlign: 'center',
            background: 'var(--surface)',
            borderRadius: '1rem',
            padding: '0.25rem 0.5rem',
            border: '3px dashed var(--accent)',
          }}
        >
          ?
        </span>
      </div>
      <ChoiceButtons choices={question.choices ?? []} onAnswer={onAnswer} />
    </div>
  );
}
