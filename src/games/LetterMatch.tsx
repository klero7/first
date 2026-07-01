import { useEffect } from 'react';
import type { GameComponentProps } from './GameComponentProps';
import { ChoiceButtons } from './ChoiceButtons';
import { speak } from '../speech/speech';

export function LetterMatch({ question, onAnswer }: GameComponentProps) {
  useEffect(() => {
    speak(question.speak ?? question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0, textAlign: 'center' }}>{question.prompt}</h2>
      <div
        style={{
          fontSize: '6rem',
          fontWeight: 900,
          background: 'var(--surface)',
          borderRadius: '2rem',
          padding: '1rem 2.5rem',
        }}
      >
        {question.visualAsset}
      </div>
      <ChoiceButtons choices={question.choices ?? []} onAnswer={onAnswer} />
    </div>
  );
}
