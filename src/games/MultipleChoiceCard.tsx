import { useEffect } from 'react';
import type { GameComponentProps } from './GameComponentProps';
import { ChoiceButtons } from './ChoiceButtons';
import { speak } from '../speech/speech';

export function MultipleChoiceCard({ question, onAnswer }: GameComponentProps) {
  useEffect(() => {
    speak(question.speak ?? question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
      {question.visualAsset && <div style={{ fontSize: '5rem' }}>{question.visualAsset}</div>}
      <h2 style={{ fontSize: '2.2rem', margin: 0, textAlign: 'center' }}>{question.prompt}</h2>
      <ChoiceButtons choices={question.choices ?? []} onAnswer={onAnswer} />
    </div>
  );
}
